import * as React from 'react';
import {rule} from 'p4-css';
import useAudio from 'react-use/lib/useAudio';
import useSlider from 'react-use/lib/useSlider';
import {HTMLMediaState, HTMLMediaControls} from 'react-use/lib/util/createHTMLMediaHook';
import IconPlay from '../../icons/Play';
import IconPause from '../../icons/Pause';
import IconVolume from '../../icons/Volume';
import IconMuted from '../../icons/Muted';
import { Rail } from '../Rail';

const {useRef, useEffect} = React;

export const defaultHeight = 64;
export const railHeight = 8;

export type PlayerState = HTMLMediaState;
export type PlayerControls = HTMLMediaControls;

const blockClass = rule({
  d: 'flex',
  alignItems: 'center',
  bg: '#eee',
  h: defaultHeight + 'px',
  bdrad: '4px',
});

const playButtonClass = rule({
  d: 'flex',
  alignItems: 'center',
  h: '100%',
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
  h: '100%',
  cur: 'pointer',
});

const railClass = rule({
  d: 'flex',
  w: '100%',
  h: railHeight + 'px',
  pos: 'relative',
  bdrad: '2px',
  ov: 'hidden',
});

const volumeButtonClass = rule({
  d: 'flex',
  alignItems: 'center',
  h: '100%',
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
   * Player height in px.
   */
  height?: number;

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
  height = defaultHeight,
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

  const latestState = useRef<PlayerState>(state)
  latestState.current = state;

  const latestControls = useRef<PlayerControls>(controls)
  latestControls.current = controls;

  const seekAreaRef = useRef<HTMLSpanElement>(null);
  const seek = useSlider(seekAreaRef, {
    onScrubStop: (value) => {
      if (!latestState.current.duration) return;
      latestControls.current.seek(Math.round(latestState.current.duration * value));
    },
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

  if (height !== defaultHeight) {
    style.height = height;
  }

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

  const seekArea = (
    <span ref={seekAreaRef} className={seekAreaClass}>
      <span className={railClass}>
        <Rail value={1} color={'rgba(0,0,0,.04)'} />
        {!!state.duration && (
          <Rail value={(state.time || 0) / state.duration} color={seek.isSliding ? `rgba(${accent[0]},${accent[1]},${accent[2]},.5)` : `rgb(${accent[0]},${accent[1]},${accent[2]})`} />
        )}
        {!!seek.isSliding && (
          <Rail value={seek.value} color={`rgba(${accent[0]},${accent[1]},${accent[2]},.6)`} />
        )}
      </span>
    </span>
  );

  const volumeButton = (
    <button className={volumeButtonClass} onClick={() => {
      if (state.muted) controls.unmute();
      else controls.mute();
    }}>
      {state.muted || !state.volume ? <IconMuted /> : <IconVolume />}
    </button>
  );

  return (
    <span className={blockClass} style={style}>
      {audio}
      {mainButton}
      {seekArea}
      {volumeButton}
    </span>
  );
};
