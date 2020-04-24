import * as React from 'react';
import {rule} from 'p4-css';

const blockClass = rule({
  d: 'flex',
  h: '100%',
  minH: '5px',
});

export interface RailProps {
  color?: string;
  value: number;
}

export const Rail: React.FC<RailProps> = ({color = 'red', value}) => {
  const style: React.CSSProperties = {
    background: color,
    width: `${value * 100}%`,
  };

  return (
    <span className={blockClass} style={style} />
  );
};
