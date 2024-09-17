import React from "react";
import { Flex, IconButton, Box, Text, Badge } from "theme-ui";

import EditTileIcon from "../../icons/EditTileIcon";

type TileProps = {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDoubleClick: () => void;
  canEdit: boolean;
  badges: React.ReactChild[];
  editTitle: string;
  size: string,
  columns: string,
  children: React.ReactNode;
};

function Tile({
  title = "",
  isSelected = false,
  onSelect = () => { },
  onEdit = () => { },
  onDoubleClick = () => { },
  size = "medium",
  canEdit = false,
  badges = [],
  editTitle = "Edit",
  columns = "1fr",
  children,
}: TileProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "0",
        paddingTop: "100%",
        borderRadius: "4px",
        overflow: "hidden",
        userSelect: "none",
      }}
      bg="background"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={onDoubleClick}
      aria-label={title}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </Box>
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.65) 100%);",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
        p={2}
      >
        <Text
          as="p"
          variant="heading"
          color="hsl(210, 50%, 96%)"
          sx={{ textAlign: "center" }}
        >
          {title}
        </Text>
      </Flex>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          borderColor: "primary",
          borderStyle: isSelected ? "solid" : "none",
          borderWidth: "4px",
          pointerEvents: "none",
          borderRadius: "4px",
        }}
      />
      <Flex
        sx={{
          position: "absolute",
          top: "6px",
          left: "6px",
        }}
      >
        {badges.map((badge, i) => (
          <Badge
            m="2px"
            key={i}
            bg="overlay"
            color="text"
            sx={{ width: "fit-content" }}
          >
            {badge}
          </Badge>
        ))}
      </Flex>
      {canEdit && (
        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton
            aria-label={editTitle}
            title={editTitle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            bg="overlay"
            sx={{ borderRadius: "50%" }}
            m={2}
          >
            <EditTileIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default Tile;
