import * as types from './types';
import { inlineDataEntityStrategy } from './strategies';
import InlineDataEntity from './InlineDataEntity';

export const inlineDataEntityDecorator = {
  strategy: inlineDataEntityStrategy,
  matchesEntityType: type => type === types.INLINEDATAENTITY,
  component: InlineDataEntity,
};
