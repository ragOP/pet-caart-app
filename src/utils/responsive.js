// utils/responsive.js
import { useWindowDimensions } from 'react-native';

const guidelineBaseWidth = 375;
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const wp = p => (width * p) / 100;
  const hp = p => (height * p) / 100;
  const scale = width / guidelineBaseWidth;
  const ms = (size, factor = 0.5) => size + (scale * size - size) * factor;
  const sm = width < 360;
  const md = width >= 360 && width < 768;
  const lg = width >= 768;
  return { width, height, wp, hp, ms, sm, md, lg };
};
