import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {Rail} from '..';

storiesOf('components/Rail', module).add('Default', () => {
  return <Rail value={0.8} />;
});
