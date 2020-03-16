import { useEffect, useState } from "react";
import Peer from "peerjs";

function useSession(imgRef) {
  const [peerId, setPeerId] = useState(null);
  const [peer, setPeer] = useState(null);
  const [connections, setConnections] = useState({});

  useEffect(() => {
    setPeer(new Peer());
  }, []);

  useEffect(() => {
    function handleOpen(id) {
      setPeerId(id);
    }

    function handleConnection(connection) {
      setConnections(prevConnnections => ({
        ...prevConnnections,
        [connection.peer]: connection
      }));

      connection.on("open", () => {
        if (imgRef.current) {
          connection.send(imgRef.current);
        }
      });

      function removeConnection() {
        setConnections(prevConnections => {
          const { [connection.peer]: old, ...rest } = prevConnections;
          return rest;
        });
      }

      connection.on("close", removeConnection);
      connection.on("error", removeConnection);
    }

    if (!peer) {
      return;
    }

    peer.on("open", handleOpen);
    peer.on("connection", handleConnection);
    return () => {
      peer.removeListener("open", handleOpen);
      peer.removeListener("connection", handleConnection);
    };
  }, [peer, peerId, connections, imgRef]);

  return [peer, peerId, connections];
}

export default useSession;