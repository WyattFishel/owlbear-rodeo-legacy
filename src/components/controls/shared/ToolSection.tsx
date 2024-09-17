import React, { useState, useEffect } from "react";
import { Box, Flex } from "theme-ui";

import RadioIconButton from "../../RadioIconButton";

export type Tool = {
  id: string;
  title: string;
  isSelected: boolean;
  icon: React.ReactNode;
  disabled?: boolean;
};

type ToolSectionProps = {
  collapse: boolean;
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
};

// Section of map tools with the option to collapse into a vertical list
function ToolSection({ collapse = false, tools, onToolClick }: ToolSectionProps) {
  const [showMore, setShowMore] = useState(false);
  const [collapsedTool, setCollapsedTool] = useState<Tool>();

  useEffect(() => {
    const selectedTool = tools.find((tool) => tool.isSelected);
    if (selectedTool) {
      setCollapsedTool(selectedTool);
    } else {
      // No selected tool, deselect if we have a tool or get the first tool if not
      setCollapsedTool((prevTool) =>
        prevTool ? { ...prevTool, isSelected: false } : tools[0]
      );
    }
  }, [tools]);

  function handleToolClick(tool: Tool) {
    if (collapse && tool.isSelected) {
      setShowMore(!showMore);
    } else if (collapse && !tool.isSelected) {
      setShowMore(false);
    }
    onToolClick(tool);
  }

  function renderTool(tool: Tool) {
    return (
      <RadioIconButton
        title={tool.title}
        onClick={() => handleToolClick(tool)}
        key={tool.id}
        isSelected={tool.isSelected}
        disabled={tool.disabled}
      >
        {tool.icon}
      </RadioIconButton>
    );
  }

  if (collapse) {
    if (!collapsedTool) {
      return null;
    }
    return (
      <Box sx={{ position: "relative" }}>
        {renderTool(collapsedTool)}
        {/* Render chevron when more tools is available */}
        <Box
          sx={{
            position: "absolute",
            width: 0,
            height: 0,
            borderTop: "4px solid",
            borderTopColor: "text",
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            transform: "translate(0, -4px) rotate(-45deg)",
            bottom: 0,
            right: 0,
            pointerEvents: "none",
          }}
        />
        {showMore && (
          <Flex
            sx={{
              position: "absolute",
              top: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              flexDirection: "column",
              borderRadius: "4px",
            }}
            bg="overlay"
            p={2}
          >
            {tools.filter((tool) => !tool.isSelected).map(renderTool)}
          </Flex>
        )}
      </Box>
    );
  } else {
    return (
      <>
        {tools.map((tool) => (
          <RadioIconButton
            title={tool.title}
            onClick={() => handleToolClick(tool)}
            key={tool.id}
            isSelected={tool.isSelected}
            disabled={tool.disabled}
          >
            {tool.icon}
          </RadioIconButton>
        ))}
      </>
    );
  }
}

export default ToolSection;
