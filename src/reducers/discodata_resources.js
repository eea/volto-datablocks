import { GET_DISCODATA_RESOURCE } from '../constants';

const initialState = {
  error: null,
  data: {},
  loaded: false,
  loading: false,
  pendingRequests: {},
  requestsMetadata: {},
};

export default function pages(state = initialState, action = {}) {
  let requestsMetadata = { ...state.requestsMetadata };
  const pendingRequests = { ...state.pendingRequests };
  const data = {
    ...state.data,
  };
  const id = action.isCollection
    ? action.resourceKey
    : `${action.resourceKey}_${action.key}`;
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
      if (resourceKey && !data[resourceKey]) data[resourceKey] = {};
      if (!action.isCollection) {
        const groupBy = action.groupBy || [];
        const search = action.search || {};
        const key = action.key || '';
        const entity = search[key];
        if (entity && !data[resourceKey][entity]) {
          data[resourceKey][entity] = { ...(results?.[0] || {}), results };
        }
        groupBy?.length > 0 &&
          groupBy.forEach(group => {
            if (
              group?.key &&
              data[resourceKey][entity] &&
              !data[resourceKey][entity][group.key]
            )
              data[resourceKey][entity][group.key] = {};
            results &&
              results.forEach(item => {
                if (group && group.key && group.discodataKey) {
                  if (
                    !data[resourceKey][entity][group.key][
                      item[group.discodataKey]
                    ]
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
      } else {
        data[resourceKey] = results;
      }
      delete pendingRequests[id];
      requestsMetadata[id] = { ...action.requestsMetadata };
      return {
        ...state,
        error: null,
        data,
        loaded: Object.keys(pendingRequests).length > 0 ? false : true,
        loading: Object.keys(pendingRequests).length > 0 ? true : false,
        pendingRequests,
        requestsMetadata,
      };
    case `${GET_DISCODATA_RESOURCE}_FAIL`:
      delete pendingRequests[id];
      return {
        ...state,
        error: action.error,
        data: {},
        loaded: false,
        loading: false,
        pendingRequests,
      };
    default:
      return state;
  }
}
