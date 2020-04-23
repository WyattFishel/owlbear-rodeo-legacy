import blankImage from "./Blank Grid 22x22.jpg";
import grassImage from "./Grass Grid 22x22.jpg";
import sandImage from "./Sand Grid 22x22.jpg";
import stoneImage from "./Stone Grid 22x22.jpg";
import waterImage from "./Water Grid 22x22.jpg";
import woodImage from "./Wood Grid 22x22.jpg";

const defaultProps = {
  gridX: 22,
  gridY: 22,
  width: 1024,
  height: 1024,
  default: true,
};

export const blank = {
  ...defaultProps,
  source: blankImage,
  id: "Blank Grid 22x22",
};

export const grass = {
  ...defaultProps,
  source: grassImage,
  id: "Grass Grid 22x22",
};

export const sand = {
  ...defaultProps,
  source: sandImage,
  id: "Sand Grid 22x22",
};

export const stone = {
  ...defaultProps,
  source: stoneImage,
  id: "Stone Grid 22x22",
};

export const water = {
  ...defaultProps,
  source: waterImage,
  id: "Water Grid 22x22",
};

export const wood = {
  ...defaultProps,
  source: woodImage,
  id: "Wood Grid 22x22",
};
