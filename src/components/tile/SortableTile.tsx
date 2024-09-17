import React from "react";
import { Box } from "theme-ui";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { animated, useSpring } from "react-spring";

import { GROUP_ID_PREFIX } from "../../contexts/TileDragContext";

type SortableTileProps = {
  id: string;
  disableGrouping: boolean;
  disableSorting: boolean;
  hidden: boolean;
  children: React.ReactNode;
  isDragging: boolean;
  cursor: string;
};

function SortableTile({
  id,
  disableGrouping,
  disableSorting,
  hidden,
  children,
  isDragging,
  cursor = "pointer",
}: SortableTileProps) {
  const {
    attributes,
    listeners,
    setDroppableNodeRef,
    setDraggableNodeRef,
    over,
    active,
  } = useSortable({ id });

  const { setNodeRef: setGroupNodeRef } = useDroppable({
    id: `${GROUP_ID_PREFIX}${id}`,
    disabled: disableGrouping,
  });

  const dragStyle = {
    cursor,
    opacity: isDragging ? 0.25 : undefined,
  };

  // Sort div left aligned
  const sortDropStyle: React.CSSProperties = {
    position: "absolute",
    left: "-5px",
    top: 0,
    width: "2px",
    height: "100%",
    borderRadius: "2px",
    visibility: over?.id === id && !disableSorting ? "visible" : "hidden",
  };

  // Group div center aligned
  const groupDropStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderWidth: "4px",
    borderRadius: "4px",
    borderStyle:
      over?.id === `${GROUP_ID_PREFIX}${id}` && active?.id !== id
        ? "solid"
        : "none",
  };

  const { opacity } = useSpring({ opacity: hidden ? 0 : 1 });

  return (
    <animated.div style={{ opacity, position: "relative" }}>
      <Box
        ref={setDraggableNodeRef}
        style={dragStyle}
        {...listeners}
        {...attributes}
      >
        {children}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: 0,
          paddingTop: "100%",
          pointerEvents: "none",
          position: "absolute",
          top: 0,
        }}
      >
        <Box ref={setDroppableNodeRef} style={sortDropStyle} bg="primary" />
        <Box
          ref={setGroupNodeRef}
          style={groupDropStyle}
          sx={{ borderColor: "primary" }}
        />
      </Box>
    </animated.div>
  );
}

export default SortableTile;
