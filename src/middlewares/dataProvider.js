import { GET_DATA_FROM_PROVIDER } from '@eeacms/volto-datablocks/constants';

export const dataProvider = (middlewares) => [
  (store) => (next) => (action) => {
    const state = store.getState();
    if (action.type === GET_DATA_FROM_PROVIDER) {
      const path = `${action.path?.replace('/@connector-data', '')}${
        action.hashValue ? `#${action.hashValue}` : ''
      }`;
      const isPending = state.data_providers.pendingConnectors[path];

      if (isPending) {
        return;
      }
      store.dispatch({
        type: `${GET_DATA_FROM_PROVIDER}_PENDING`,
        path: action.path,
        hashValue: action.hashValue,
      });
    }
    try {
      const result = next(action);

      if (result && typeof result.catch === 'function') {
        return result.catch((error) => {
          throw error;
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
  ...middlewares,
];
