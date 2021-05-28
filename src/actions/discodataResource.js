import {
  GET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE_PENDING,
} from '../constants';

export function getDiscodataResource({
  url,
  search,
  isCollection,
  resourceKey,
  key,
  groupBy,
  requestsMetadata,
}) {
  return {
    type: GET_DISCODATA_RESOURCE,
    search,
    isCollection,
    resourceKey,
    key,
    groupBy,
    requestsMetadata,
    request: {
      op: 'get',
      path: url,
    },
  };
}

export function setDiscodataResource({ collection, resourceKey, key }) {
  return {
    type: SET_DISCODATA_RESOURCE,
    collection,
    resourceKey,
    key,
  };
}

export function setDiscodataResourcePending({ key }) {
  return {
    type: SET_DISCODATA_RESOURCE_PENDING,
    key,
  };
}
