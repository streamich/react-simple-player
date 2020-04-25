import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {Player, PlayerState} from '..';

const mp3 = [
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/blocSonic/Flex_Vector/Born_Ready/Flex_Vector_-_Born_Ready.mp3',
  'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
  'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_5MG.mp3',
];

const Demo = () => {
  const [state, setState] = React.useState<null | PlayerState>(null);

  return (
    <div>
      <div>
        <Player src={mp3[2]} autoPlay onState={setState} height={40} />
      </div>
      <div>
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    </div>
  );
};

storiesOf('components/Player', module)
  .add('Default', () => {
    return <Player src={mp3[0]} autoPlay hideVolume />;
  })
  .add('Demo', () => {
    return <Demo />;
  })
  .add('Hight scale', () => {
    return (
      <div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={30} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={50} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={80} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={128} />
        </div>
      </div>
    )
  })
  .add('Dark mode', () => {
    return (
      <div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={48} grey={[30, 32, 34]} />
        </div>
      </div>
    )
  })
  .add('Grey scale', () => {
    return (
      <div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[0, 0, 0]} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[50, 50, 50]} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[100, 100, 100]} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[150, 150, 150]} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[200, 200, 200]} />
        </div>
        <div style={{padding: 16}}>
          <Player src={mp3[0]} height={40} grey={[250, 250, 250]} />
        </div>
      </div>
    )
  })
  .add('in flex', () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Player src={mp3[0]} height={40} grey={[0, 0, 0]} />
      </div>
    )
  })
