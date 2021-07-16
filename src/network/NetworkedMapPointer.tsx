import React, { useState, useEffect, useRef } from "react";
import { Group } from "react-konva";

import { useUserId } from "../contexts/UserIdContext";

import MapPointer from "../components/map/MapPointer";
import { isEmpty } from "../helpers/shared";
import Vector2 from "../helpers/Vector2";

import useSetting from "../hooks/useSetting";
import Session from "./Session";

// Send pointer updates every 50ms (20fps)
const sendTickRate = 50;

function NetworkedMapPointer({
  session,
  active,
}: {
  session: Session;
  active: boolean;
}) {
  const userId = useUserId();
  const [localPointerState, setLocalPointerState] = useState({});
  const [pointerColor] = useSetting("pointer.color");

  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (userId && !(userId in localPointerState)) {
      setLocalPointerState({
        [userId]: {
          position: { x: 0, y: 0 },
          visible: false,
          id: userId,
          color: pointerColor,
        },
      });
    }
  }, [userId, localPointerState, pointerColor]);

  // Send pointer updates every sendTickRate to peers to save on bandwidth
  // We use requestAnimationFrame as setInterval was being blocked during
  // re-renders on Chrome with Windows
  const ownPointerUpdateRef: React.MutableRefObject<
    { position; visible: boolean; id; color } | undefined | null
  > = useRef();
  useEffect(() => {
    let prevTime = performance.now();
    let request = requestAnimationFrame(update);
    let counter = 0;
    function update(time) {
      request = requestAnimationFrame(update);
      const deltaTime = time - prevTime;
      counter += deltaTime;
      prevTime = time;

      if (counter > sendTickRate) {
        counter -= sendTickRate;
        if (
          ownPointerUpdateRef.current &&
          sessionRef.current &&
          sessionRef.current.socket
        ) {
          sessionRef.current.socket.emit(
            "player_pointer",
            ownPointerUpdateRef.current
          );
          ownPointerUpdateRef.current = null;
        }
      }
    }

    return () => {
      cancelAnimationFrame(request);
    };
  }, []);

  function updateOwnPointerState(position, visible: boolean) {
    setLocalPointerState((prev) => ({
      ...prev,
      [userId]: { position, visible, id: userId, color: pointerColor },
    }));
    ownPointerUpdateRef.current = {
      position,
      visible,
      id: userId,
      color: pointerColor,
    };
  }

  function handleOwnPointerDown(position) {
    updateOwnPointerState(position, true);
  }

  function handleOwnPointerMove(position) {
    updateOwnPointerState(position, true);
  }

  function handleOwnPointerUp(position) {
    updateOwnPointerState(position, false);
  }

  // Handle pointer data receive
  const interpolationsRef: React.MutableRefObject = useRef({});
  useEffect(() => {
    // TODO: Handle player disconnect while pointer visible
    function handleSocketPlayerPointer(pointer) {
      const interpolations = interpolationsRef.current;
      const id = pointer.id;
      if (!(id in interpolations)) {
        interpolations[id] = {
          id,
          from: null,
          to: { ...pointer, time: performance.now() + sendTickRate },
        };
      } else if (
        !Vector2.compare(
          interpolations[id].to.position,
          pointer.position,
          0.0001
        ) ||
        interpolations[id].to.visible !== pointer.visible
      ) {
        const from = interpolations[id].to;
        interpolations[id] = {
          id,
          from: {
            ...from,
            time: performance.now(),
          },
          to: {
            ...pointer,
            time: performance.now() + sendTickRate,
          },
        };
      }
    }

    session.socket?.on("player_pointer", handleSocketPlayerPointer);

    return () => {
      session.socket?.off("player_pointer", handleSocketPlayerPointer);
    };
  }, [session]);

  // Animate to the peer pointer positions
  useEffect(() => {
    let request = requestAnimationFrame(animate);

    function animate() {
      request = requestAnimationFrame(animate);
      const time = performance.now();
      let interpolatedPointerState = {};
      for (let interp of Object.values(interpolationsRef.current)) {
        if (!interp.from || !interp.to) {
          continue;
        }
        const totalInterpTime = interp.to.time - interp.from.time;
        const currentInterpTime = time - interp.from.time;
        const alpha = currentInterpTime / totalInterpTime;

        if (alpha >= 0 && alpha <= 1) {
          interpolatedPointerState[interp.id] = {
            id: interp.id,
            visible: interp.from.visible,
            position: Vector2.lerp(
              interp.from.position,
              interp.to.position,
              alpha
            ),
            color: interp.from.color,
          };
        }
        if (alpha > 1 && !interp.to.visible) {
          interpolatedPointerState[interp.id] = {
            id: interp.id,
            visible: interp.to.visible,
            position: interp.to.position,
            color: interp.to.color,
          };
          delete interpolationsRef.current[interp.id];
        }
      }
      if (!isEmpty(interpolatedPointerState)) {
        setLocalPointerState((prev) => ({
          ...prev,
          ...interpolatedPointerState,
        }));
      }
    }

    return () => {
      cancelAnimationFrame(request);
    };
  }, []);

  return (
    <Group>
      {Object.values(localPointerState).map((pointer) => (
        <MapPointer
          key={pointer.id}
          active={pointer.id === userId ? active : false}
          position={pointer.position}
          visible={pointer.visible}
          onPointerDown={pointer.id === userId && handleOwnPointerDown}
          onPointerMove={pointer.id === userId && handleOwnPointerMove}
          onPointerUp={pointer.id === userId && handleOwnPointerUp}
          color={pointer.color}
        />
      ))}
    </Group>
  );
}

export default NetworkedMapPointer;
