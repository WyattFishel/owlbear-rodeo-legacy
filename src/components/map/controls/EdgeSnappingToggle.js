import React from "react";
import { IconButton } from "theme-ui";

import SnappingOnIcon from "../../../icons/SnappingOnIcon";
import SnappingOffIcon from "../../../icons/SnappingOffIcon";

function EdgeSnappingToggle({
  useEdgeSnapping,
  onEdgeSnappingChange,
  disabled,
}) {
  return (
    <IconButton
      aria-label={
        useEdgeSnapping
          ? "Disable Edge Snapping (S)"
          : "Enable Edge Snapping (S)"
      }
      title={
        useEdgeSnapping
          ? "Disable Edge Snapping (S)"
          : "Enable Edge Snapping (S)"
      }
      onClick={() => onEdgeSnappingChange(!useEdgeSnapping)}
      disabled={disabled}
    >
      {useEdgeSnapping ? <SnappingOnIcon /> : <SnappingOffIcon />}
    </IconButton>
  );
}

export default EdgeSnappingToggle;
