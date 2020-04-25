import * as React from 'react';
import {rule} from 'p4-css';

const blockClass = rule({
  d: 'inline-block',
  pos: 'absolute',
  h: '100%',
  minH: '5px',
});

export interface RailProps {
  value: number;
  skip?: number;
  color?: string;
}

export const Rail: React.FC<RailProps> = ({color = 'red', value, skip}) => {
  const style: React.CSSProperties = {
    background: color,
    width: `${value * 100}%`,
  };

  if (skip) {
    style.marginLeft = `${skip}%`;
  }

  return <span className={blockClass} style={style} />;
};
