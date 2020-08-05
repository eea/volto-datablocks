import { GET_DISCODATA_RESOURCE } from '../constants';

const initialState = {
  error: null,
  data: {},
  loaded: false,
  loading: false,
  pendingRequests: {},
};

export default function pages(state = initialState, action = {}) {
  const pendingRequests = { ...state.pendingRequests };
  const data = {
    ...state.data,
  };
  const id = `${action.resourceKey}_${action.key}_${
    action.search?.[action.key]
  }`;
  switch (action.type) {
    case `${GET_DISCODATA_RESOURCE}_PENDING`:
      pendingRequests[id] = true;
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        pendingRequests,
      };
    case `${GET_DISCODATA_RESOURCE}_SUCCESS`:
      const results =
        action.result?.results &&
        action.result.results.filter((item, index) => {
          const str = JSON.stringify(item);
          return (
            index ===
            action.result.results.findIndex(duplicate => {
              return JSON.stringify(duplicate) === str;
            })
          );
        });
      const resourceKey = action.resourceKey;
      const entity = action.search?.[action.key];
      const groupBy = action.groupBy || [];
      if (resourceKey && !data[resourceKey]) data[resourceKey] = {};
      if (resourceKey && entity && !data[resourceKey][entity])
        data[resourceKey][entity] = {
          results,
          ...(results?.[0] || {}),
        };
      groupBy?.length > 0 &&
        groupBy.forEach(group => {
          if (group?.key && !data[resourceKey][entity][group.key])
            data[resourceKey][entity][group.key] = {};
          results.forEach(item => {
            if (group && group.key && group.discodataKey) {
              if (
                !data[resourceKey][entity][group.key][item[group.discodataKey]]
              ) {
                data[resourceKey][entity][group.key][
                  item[group.discodataKey]
                ] = [];
              }
              data[resourceKey][entity][group.key][
                item[group.discodataKey]
              ].push(item);
            }
          });
        });
      delete pendingRequests[id];
      return {
        ...state,
        error: null,
        data,
        loaded: true,
        loading: false,
      };
    case `${GET_DISCODATA_RESOURCE}_FAIL`:
      delete pendingRequests[id];
      return {
        ...state,
        error: action.error,
        data: {},
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
