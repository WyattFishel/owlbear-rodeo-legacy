import { useState } from "react";
import { Box, Slider as ThemeSlider, SliderProps } from "theme-ui";

type SliderModalProps = SliderProps & {
  min: number;
  max: number;
  value: number;
  labelFunc: (value: number) => string;
};

function Slider({
  min = 0,
  max = 1,
  value = 0,
  ml = 0,
  mr = 0,
  labelFunc = (value: number) => value.toString(),
  ...rest
}: SliderModalProps) {
  const percentValue = ((value - min) * 100) / (max - min);

  const [labelVisible, setLabelVisible] = useState<boolean>(false);

  return (
    <Box sx={{ position: "relative" }} ml={ml} mr={mr}>
      {labelVisible && (
        <Box
          sx={{
            position: "absolute",
            top: "-42px",
          }}
          style={{
            left: `calc(${percentValue}% + ${-8 - percentValue * 0.15}px)`,
          }}
        >
          <Box
            sx={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50% 50% 50% 0%",
              transform: "rotate(-45deg)",
            }}
            bg="primary"
          >
            <Box
              sx={{
                fontFamily: "body2",
                fontWeight: "caption",
                fontSize: 0,
                transform: "rotate(45deg)",
              }}
            >
              {labelFunc(value)}
            </Box>
          </Box>
        </Box>
      )}
      <ThemeSlider
        min={min}
        max={max}
        value={value}
        onMouseDown={() => setLabelVisible(true)}
        onMouseUp={() => setLabelVisible(false)}
        onTouchStart={() => setLabelVisible(true)}
        onTouchEnd={() => setLabelVisible(false)}
        {...rest}
      />
    </Box>
  );
}

export default Slider;
