import * as React from 'react';
import {rule} from 'p4-css';
import useAudio from 'react-use/lib/useAudio';
import {HTMLMediaState, HTMLMediaControls} from 'react-use/lib/util/createHTMLMediaHook';
import IconPlay from '../../icons/Play';
import IconPause from '../../icons/Pause';

const {useEffect} = React;

export const height = 64;
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

export interface PlayerProps {
  /**
   * URL of .mp3 or other audio media.
   */
  src: string;

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
   * Callback called every time player state changes.
   */
  onState?: (state: HTMLMediaState) => void,
}

export const Player: React.FC<PlayerProps> = ({src, autoPlay, controls: controlsRef, state: stateRef, onState}) => {
  const [audio, state, controls, ref] = useAudio({
    src,
    autoPlay: !!autoPlay,
  });

  if (stateRef) stateRef.current = state;
  if (controlsRef) controlsRef.current = controls;

  useEffect(() => {
    if (onState) onState(state);
  }, [state]);

  return (
    <div className={blockClass}>
      {audio}
      <button className={playButtonClass} onClick={() => {
        if (state.paused) controls.play();
        else controls.pause();
      }}>
        {state.paused ? <IconPlay /> : <IconPause />}
      </button>
    </div>
  );
};
