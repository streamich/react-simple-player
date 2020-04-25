import * as React from 'react';
import {rule} from 'p4-css';

export const railHeight = 8;

const railClass = rule({
  d: 'flex',
  w: '100%',
  h: railHeight + 'px',
  pos: 'relative',
  bdrad: '2px',
  ov: 'hidden',
});

export const RailWrap: React.FC = ({children}) => {
  return <span className={railClass}>{children}</span>;
};
