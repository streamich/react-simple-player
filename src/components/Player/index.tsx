import * as React from 'react';
import {rule} from 'p4-css';
import useAudio from 'react-use/lib/useAudio';
import useSlider from 'react-use/lib/useSlider';
import {HTMLMediaState, HTMLMediaControls} from 'react-use/lib/util/createHTMLMediaHook';
import IconPlay from '../../icons/Play';
import IconPause from '../../icons/Pause';
import IconVolume from '../../icons/Volume';
import IconMuted from '../../icons/Muted';
import {Rail} from '../Rail';
import {RailWrap} from '../RailWrap';
import {Volume} from '../Volume';
import createColorManager from './createColorManager';
import formatTime from './formatTime';

const {useRef, useEffect, useState, useMemo} = React;

const ff = '"Open Sans",Roboto,sans-serif';
export const defaultHeight = 64;

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
  pos: 'relative',
  d: 'flex',
  flex: '1 1 100%',
  alignItems: 'center',
  h: '100%',
  cur: 'pointer',
});

const tooltipClass = rule({
  pos: 'absolute',
  op: .9,
});

const tooltipInnerClass = rule({
  d: 'inline-block',
  mar: '0 0 0 -50%',
  pad: '4px 8px',
  fz: '12px',
  ff,
  bdrad: '3px',
  whiteSpace: 'nowrap',
});

const timeClass = rule({
  whiteSpace: 'nowrap',
  userSelect: 'none',
  pad: '0 0 0 16px',
  ff,
  fz: '12px',
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
   * Shade of grey to use as base color for player. 3-tuple of numbers in
   * 0 to 255 range, representing an RGB color.
   */
  grey?: [number, number, number];

  /**
   * Accent color 3-tuple of numbers from 0 to 255, representing an RGB color.
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
   * Whether to hide volume slider.
   */
  hideVolume?: boolean;

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
  grey = [246, 248, 250],
  accent = [255, 0, 0],
  autoPlay,
  hideVolume,
  controls: controlsRef,
  state: stateRef,
  audio: audioRef,
  onState,
}) => {
  const color = useMemo(() => createColorManager(grey, accent), [...grey, ...accent]);
  const [hovered, setHovered] = useState(false);
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
    background: hovered ? color.shift(-6) : color.shift(0),
  };

  const playIconStyle: React.CSSProperties = {
    fill: color.contrast(.85),
    // fill: `rgba(${accent[0]},${accent[1]},${accent[2]},.9)`,
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
      {state.paused ? <IconPlay style={playIconStyle} /> : <IconPause style={{fill: color.contrast(.85)}} />}
    </button>
  );

  const seekArea = (
    <span ref={seekAreaRef} className={seekAreaClass}>
      <RailWrap>
        <Rail value={1} color={color.contrast(.08)} />
        {!!state.duration && !!state.buffered && (
          state.buffered.map(({start, end}: {start: number, end: number}) => (
            <Rail value={(end - start) / state.duration} skip={start / state.duration} color={color.contrast(.08)} />
          ))
        )}
        {!!state.duration && (
          <Rail value={(state.time || 0) / state.duration} color={state.paused ? color.shade(.4) : seek.isSliding ? `rgba(${accent[0]},${accent[1]},${accent[2]},.5)` : `rgb(${accent[0]},${accent[1]},${accent[2]})`} />
        )}
        {!!seek.isSliding && (
          <Rail value={seek.value} color={`rgba(${accent[0]},${accent[1]},${accent[2]},.6)`} />
        )}
      </RailWrap>
      {!!state.duration && seek.isSliding && (
        <span className={tooltipClass} style={{top: ((-30 + (height / 2)) + 'px'), left: seek.isSliding ? `${100 * seek.value}%` : `${100 * state.time / state.duration}%`}}>
          <span className={tooltipInnerClass} style={{background: '#000', color: '#fff'}}>
            {formatTime(seek.value * state.duration)}
          </span>
        </span>
      )}
    </span>
  );

  const volumeButton = (
    <button className={volumeButtonClass} onClick={() => {
      if (state.muted) controls.unmute();
      else controls.mute();
    }}>
      {state.muted || !state.volume ? <IconMuted style={{fill: color.contrast(.85)}} /> : <IconVolume style={{fill: color.contrast(.85)}} />}
    </button>
  );

  return (
    <span className={blockClass} style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {audio}
      {mainButton}
      {seekArea}
      {!!state.duration && (
        <span className={timeClass} style={{color: color.contrast(.85)}}>
          {formatTime(state.time) + ' / ' + formatTime(state.duration)}
        </span>
      )}
      {volumeButton}
      {!hideVolume && (
        <Volume
          value={state.volume || 0}
          onChange={(value) => controls.volume(value)}
          bg={color.contrast(.06)}
          rail={color.contrast(.12)}
        />
      )}
    </span>
  );
};
