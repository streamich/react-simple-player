import * as React from 'react';
import {rule} from 'p4-css';
import useAudio from 'react-use/lib/useAudio';
import {HTMLMediaState, HTMLMediaControls} from 'react-use/lib/util/createHTMLMediaHook';
import IconPlay from '../../icons/Play';
import IconPause from '../../icons/Pause';
import { Rail } from '../Rail';

const {useEffect} = React;

export const height = 64;
export const railHeight = 8;

export type PlayerState = HTMLMediaState;
export type PlayerControls = HTMLMediaControls;

const blockClass = rule({
  d: 'flex',
  alignItems: 'center',
  bg: '#eee',
  h: height + 'px',
  bdrad: '4px',
});

const playButtonClass = rule({
  h: height + 'px',
  pad: '0 16px',
  cur: 'pointer',
  mar: 0,
  bd: 0,
  bg: 'transparent',
  '& svg': {
    w: '18px',
    h: '18px',
  },
});

const seekAreaClass = rule({
  d: 'flex',
  flex: '1 1 100%',
  alignItems: 'center',
  h: height + 'px',
});

const railClass = rule({
  d: 'flex',
  w: '100%',
  h: railHeight + 'px',
  pos: 'relative',
  bdrad: '2px',
  ov: 'hidden',
});

export interface PlayerProps {
  /**
   * URL of .mp3 or other audio media.
   */
  src: string;

  /**
   * Shade of grey to use as base color for player. Must be number from 0 to 255.
   */
  grey?: number;

  /**
   * Accent color 3-tuple of numbers from 0 to 255, representing RGB color.
   */
  accent?: [number, number, number];

  /**
   * Whether to autoplay the audio on mount.
   */
  autoPlay?: boolean;

  /**
   * React mutable ref which will be set to contain audio player controls.
   */
  controls?: React.MutableRefObject<HTMLMediaControls>;

  /**
   * React mutable ref which will be set to contain latest state of the player.
   */
  state?: React.MutableRefObject<HTMLMediaState>;

  /**
   * Get reference to HTML <audio> element.
   */
  audio?: React.MutableRefObject<HTMLAudioElement | null>;

  /**
   * Callback called every time player state changes.
   */
  onState?: (state: HTMLMediaState) => void;
}

export const Player: React.FC<PlayerProps> = ({
  src,
  grey = 250,
  accent = [255, 0, 0],
  autoPlay,
  controls: controlsRef,
  state: stateRef,
  audio: audioRef,
  onState,
}) => {
  const [audio, state, controls, ref] = useAudio({
    src,
    autoPlay: !!autoPlay,
  });

  if (stateRef) stateRef.current = state;
  if (controlsRef) controlsRef.current = controls;
  if (audioRef) audioRef.current = ref.current;

  useEffect(() => {
    if (onState) onState(state);
  }, [state]);

  const style: React.CSSProperties = {
    background: `rgb(${grey}, ${grey}, ${grey})`,
  };

  const playIconStyle: React.CSSProperties = {
    fill: `rgba(${accent[0]},${accent[1]},${accent[2]},.9)`,
  };

  const mainButton = (
    <button
        className={playButtonClass}
        onClick={() => {
          if (state.paused) controls.play();
          else controls.pause();
        }}
      >
      {state.paused ? <IconPlay style={playIconStyle} /> : <IconPause />}
    </button>
  );

  const seek = (
    <span className={seekAreaClass}>
      <span className={railClass}>
        <Rail value={1} color={'rgba(0,0,0,.04)'} />
        {!!state.duration && (
          <Rail value={(state.time || 0) / state.duration} color={'rgba(0,0,0,.04)'} />
        )}
      </span>
    </span>
  );

  return (
    <span className={blockClass} style={style}>
      {audio}
      {mainButton}
      {seek}
    </span>
  );
};
