import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {Player, PlayerState} from '..';

const mp3 = [
  'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/blocSonic/Flex_Vector/Born_Ready/Flex_Vector_-_Born_Ready.mp3',
];

const Demo = () => {
  const [state, setState] = React.useState<null | PlayerState>(null);

  return (
    <div>
      <div>
        <Player src={mp3[0]} autoPlay onState={setState} />
      </div>
      <div>
        <pre>{JSON.stringify(state, null, 4)}</pre>
      </div>
    </div>
  );
};

storiesOf('components/Player', module)
  .add('Default', () => {
    return <Player src={mp3[0]} autoPlay />;
  })
  .add('Demo', () => {
    return <Demo />;
  });
