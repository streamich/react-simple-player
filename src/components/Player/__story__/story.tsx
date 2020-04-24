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
  });
