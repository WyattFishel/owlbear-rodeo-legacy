import React from "react";
import { IconButton } from "theme-ui";

import MultilayerOnIcon from "../../../icons/FogMultilayerOnIcon";
import MultilayerOffIcon from "../../../icons/FogMultilayerOffIcon";

function MultilayerToggle({ multilayer, onMultilayerChange, disabled }) {
  return (
    <IconButton
      aria-label={
        multilayer ? "Disable Multilayer (L)" : "Enable Multilayer (L)"
      }
      title={multilayer ? "Disable Multilayer (L)" : "Enable Multilayer (L)"}
      onClick={() => onMultilayerChange(!multilayer)}
      disabled={disabled}
    >
      {multilayer ? <MultilayerOnIcon /> : <MultilayerOffIcon />}
    </IconButton>
  );
}

export default MultilayerToggle;
