import { SET_ROUTE_PARAMETER, DELETE_ROUTE_PARAMETER } from '../constants';

export const setRouteParameter = (path, index, parameter) => {
  return {
    type: SET_ROUTE_PARAMETER,
    path,
    index,
    parameter,
  };
};

export const deleteRouteParameter = (path, index) => {
  return {
    type: DELETE_ROUTE_PARAMETER,
    path,
    index,
  };
};
