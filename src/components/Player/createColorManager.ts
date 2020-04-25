const createColorManager = (grey: [number, number, number], accent: [number, number, number]) => {
  const [r, g, b] = grey;
  const avg = Math.round((r + g + b) / 3);
  const isLight = avg > 127;
  const contrast = isLight ? [0, 0, 0] : [255, 255, 255];

  return {
    isLight,
    avg,
    grey,
    accent,
    shade: (value: number) => {
      const base = isLight ? '0' : '255';
      return `rgba(${base},${base},${base},${value})`;
    },
    shift: (value: number, opacity = 1) => {
      const r1 = Math.max(0, Math.min(255, r + (isLight ? value : -value)));
      const g1 = Math.max(0, Math.min(255, g + (isLight ? value : -value)));
      const b1 = Math.max(0, Math.min(255, b + (isLight ? value : -value)));
      return opacity === 1 ? `rgba(${r1},${g1},${b1},${opacity})` : `rgb(${r1},${g1},${b1})`;
    },
    contrast: (opacity = 1) => `rgba(${contrast[0]},${contrast[1]},${contrast[2]},${opacity})`,
  };
};

export default createColorManager;
