import * as types from './types';
import { inlineDataEntityStrategy } from './strategies';
import { ConnectedDataInline } from './components';

export const inlineDataEntityDecorator = {
  strategy: inlineDataEntityStrategy,
  matchesEntityType: type => type === types.INLINEDATAENTITY,
  component: ConnectedDataInline,
};
