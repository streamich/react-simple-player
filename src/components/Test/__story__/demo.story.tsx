import * as React from 'react';
import {storiesOf} from '@storybook/react';
import Test from '..';

storiesOf('components/Test', module)
  .add('Default', () => {
    return <Test />
  });
