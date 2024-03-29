import * as React from 'react';
import {rule} from 'p4-css';
import useSlider from 'react-use/lib/useSlider';
import {RailWrap} from '../RailWrap';
import {Rail} from '../Rail';

const {useRef} = React;

const volumeSliderClass = rule({
  d: 'flex',
  flex: '0 0 100px',
  w: '100px',
  h: '100%',
  alignItems: 'center',
  cur: 'pointer',
  marr: '16px',
  cursor: 'ew-resize',
});

export interface VolumeProps {
  value: number;
  bg: string;
  rail: string;
  railHover: string;
  onChange: (value: number) => void;
}

export const Volume: React.FC<VolumeProps> = ({value, bg, rail, railHover, onChange}) => {
  const volumeRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = React.useState(false);
  useSlider(volumeRef, {
    onScrub: onChange,
  });

  return (
    <span ref={volumeRef} className={volumeSliderClass} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <RailWrap>
        <Rail value={1} color={bg} />
        {!!value && <Rail value={value} color={hover ? railHover : rail} />}
      </RailWrap>
    </span>
  );
};
