import { GET_DATA_FROM_PROVIDER } from '../constants';

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
    return next(action);
  },
  ...middlewares,
];
