import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton } from "theme-ui";
import Konva from "konva";

import TextareaAutosize from "../TextareaAutoSize";

import MapMenu from "../map/MapMenu";

import colors, { Color, colorOptions } from "../../helpers/colors";

import usePrevious from "../../hooks/usePrevious";

import LockIcon from "../../icons/TokenLockIcon";
import UnlockIcon from "../../icons/TokenUnlockIcon";
import ShowIcon from "../../icons/TokenShowIcon";
import HideIcon from "../../icons/TokenHideIcon";
import NoteIcon from "../../icons/NoteToolIcon";
import TextIcon from "../../icons/NoteTextIcon";

import { useUserId } from "../../contexts/UserIdContext";

import {
  NoteChangeEventHandler,
  RequestCloseEventHandler,
} from "../../types/Events";
import { Note } from "../../types/Note";
import { Map } from "../../types/Map";

type NoteMenuProps = {
  isOpen: boolean;
  onRequestClose: RequestCloseEventHandler;
  note?: Note;
  noteNode?: Konva.Node;
  focus: boolean;
  onNoteChange: NoteChangeEventHandler;
  map: Map | null;
};

function NoteMenu({
  isOpen,
  onRequestClose,
  note,
  noteNode,
  focus = false,
  onNoteChange,
  map,
}: NoteMenuProps) {
  const userId = useUserId();

  const wasOpen = usePrevious(isOpen);

  const [menuLeft, setMenuLeft] = useState(0);
  const [menuTop, setMenuTop] = useState(0);
  useEffect(() => {
    if (isOpen && !wasOpen && note) {
      // Update menu position
      if (noteNode) {
        const nodeRect = noteNode.getClientRect();
        const mapElement = document.querySelector(".map");
        if (mapElement) {
          const mapRect = mapElement.getBoundingClientRect();
          // Center X for the menu which is 156px wide
          setMenuLeft(mapRect.left + nodeRect.x + nodeRect.width / 2 - 156 / 2);
          // Y 20px from the bottom
          setMenuTop(mapRect.top + nodeRect.y + nodeRect.height + 20);
        }
      }
    }
  }, [isOpen, note, wasOpen, noteNode]);

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = event.target.value.substring(0, 1024);
    note && onNoteChange({ [note.id]: { text: text } });
  }

  function handleColorChange(color: Color) {
    if (!note) {
      return;
    }
    onNoteChange({ [note.id]: { color: color } });
  }

  function handleVisibleChange() {
    note && onNoteChange({ [note.id]: { visible: !note.visible } });
  }

  function handleLockChange() {
    note && onNoteChange({ [note.id]: { locked: !note.locked } });
  }

  function handleModeChange() {
    note && onNoteChange({ [note.id]: { textOnly: !note.textOnly } });
  }

  function handleModalContent(node: HTMLElement) {
    if (node) {
      // Focus input
      const tokenLabelInput =
        node.querySelector<HTMLInputElement>("#changeNoteText");
      if (tokenLabelInput && focus) {
        tokenLabelInput.focus();
        tokenLabelInput.select();
      }

      // Ensure menu is in bounds
      const nodeRect = node.getBoundingClientRect();
      const mapElement = document.querySelector(".map");
      if (mapElement) {
        const mapRect = mapElement.getBoundingClientRect();
        setMenuLeft((prevLeft) =>
          Math.min(
            mapRect.right - nodeRect.width,
            Math.max(mapRect.left, prevLeft)
          )
        );
        setMenuTop((prevTop) =>
          Math.min(mapRect.bottom - nodeRect.height, prevTop)
        );
      }
    }
  }

  function handleTextKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onRequestClose();
    }
  }

  return (
    <MapMenu
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      top={`${menuTop}px`}
      left={`${menuLeft}px`}
      onModalContent={handleModalContent}
    >
      <Box sx={{ width: "156px", overflow: "hidden" }} p={1}>
        <Flex
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            onRequestClose();
          }}
          sx={{ alignItems: "center" }}
        >
          <TextareaAutosize
            id="changeNoteText"
            onChange={handleTextChange}
            value={(note && note.text) || ""}
            onKeyPress={handleTextKeyPress}
            maxRows={4}
          />
        </Flex>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {colorOptions
            .filter((color) => color !== "primary")
            .map((color) => (
              <Box
                key={color}
                sx={{
                  width: "16.66%",
                  paddingTop: "16.66%",
                  borderRadius: "50%",
                  transform: "scale(0.75)",
                  backgroundColor: colors[color],
                  cursor: "pointer",
                }}
                onClick={() => handleColorChange(color)}
                aria-label={`Note label Color ${color}`}
              >
                {note && note.color === color && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: "2px solid white",
                      position: "absolute",
                      top: 0,
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Box>
            ))}
        </Box>
        {/* Only show hide and lock token actions to map owners */}
        {map && map.owner === userId && (
          <Flex sx={{ alignItems: "center", justifyContent: "space-around" }}>
            <IconButton
              onClick={handleVisibleChange}
              title={note && note.visible ? "Hide Note" : "Show Note"}
              aria-label={note && note.visible ? "Hide Note" : "Show Note"}
            >
              {note && note.visible ? <ShowIcon /> : <HideIcon />}
            </IconButton>
            <IconButton
              onClick={handleLockChange}
              title={note && note.locked ? "Unlock Note" : "Lock Note"}
              aria-label={note && note.locked ? "Unlock Note" : "Lock Note"}
            >
              {note && note.locked ? <LockIcon /> : <UnlockIcon />}
            </IconButton>
            <IconButton
              onClick={handleModeChange}
              title={note && note.textOnly ? "Note Mode" : "Text Mode"}
              aria-label={note && note.textOnly ? "Note Mode" : "Text Mode"}
            >
              {note && note.textOnly ? <TextIcon /> : <NoteIcon />}
            </IconButton>
          </Flex>
        )}
      </Box>
    </MapMenu>
  );
}

export default NoteMenu;
