import { SET_ROUTE_PARAMETER, DELETE_ROUTE_PARAMETER } from '../constants';

export const setRouteParameter = (data_query) => {
  return {
    type: SET_ROUTE_PARAMETER,
    data_query,
  };
};

export const deleteRouteParameter = (parameterKey) => {
  return {
    type: DELETE_ROUTE_PARAMETER,
    parameterKey,
  };
};
