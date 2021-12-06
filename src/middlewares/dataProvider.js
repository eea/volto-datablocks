import { getProviderMetadata } from '../actions';
import { GET_DATA_FROM_PROVIDER } from '../constants';

export const dataProvider = (middlewares) => [
  (store) => (next) => (action) => {
    const state = store.getState();
    if (action.type === GET_DATA_FROM_PROVIDER) {
      const url = `${action.path}${action.queryString}`;
      const isPending = state.data_providers.pendingConnectors[url];

      if (isPending) {
        return;
      }
      store.dispatch({
        type: `${GET_DATA_FROM_PROVIDER}_PENDING`,
        path: action.path,
        queryString: action.queryString,
      });

      store.dispatch(getProviderMetadata(action.path));
    }
    return next(action);
  },
  ...middlewares,
];
