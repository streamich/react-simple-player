const formatTime = (seconds: number) => {
  const round = Math.round(seconds);
  const s = round % 60;
  const minutes = Math.round((round - s) / 60);
  const m = minutes % 60;
  const h = Math.round((minutes - m) / 60);
  
  return `${h ? h + ':' : ''}${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
};

export default formatTime;
