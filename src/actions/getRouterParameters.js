import {
  SET_ROUTER_PARAMETER,
  DELETE_ROUTER_PARAMETER,
} from 'volto-datablocks/constants';

export const setRouterParameter = (parameter, value) => {
  return {
    type: SET_ROUTER_PARAMETER,
    parameter,
    value,
  };
};

export const deleteRouterParameter = (parameter) => {
  return {
    type: DELETE_ROUTER_PARAMETER,
    parameter,
  };
};
