import { SET_ROUTE_PARAMETER, DELETE_ROUTE_PARAMETER } from '../constants';

export const setRouteParameter = (parameter, value) => {
  return {
    type: SET_ROUTE_PARAMETER,
    parameter,
    value,
  };
};

export const deleteRouteParameter = (parameter) => {
  return {
    type: DELETE_ROUTE_PARAMETER,
    parameter,
  };
};
