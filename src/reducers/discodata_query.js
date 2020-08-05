import {
  SET_DISCODATA_QUERY,
  SET_QUERY_PARAM,
  DELETE_QUERY_PARAM,
} from '../constants';

const initialState = {
  data: {
    search: {
      siteName: 'Novartis AG - Werk Basel St. Johann',
    },
    key: 'siteName',
    resourceKey: 'sites',
    where: ['siteName'],
    groupBy: [
      {
        discodataKey: 'facilityEprtrReportingYear',
        key: 'facilityReportingYears',
      },
      {
        discodataKey: 'FacilityName',
        key: 'facilities',
      },
    ],
  },
  deletedQueryParams: {},
};

export default function pages(state = initialState, action = {}) {
  let data = {
    ...state.data,
  };
  let deletedQueryParams = { ...state.deletedQueryParams };
  switch (action.type) {
    case `${SET_DISCODATA_QUERY}`:
      data = { ...action.query };
      return {
        ...state,
        data,
      };
    case `${SET_QUERY_PARAM}`:
      data.search[action.queryParam] = action.value;
      delete deletedQueryParams[action.queryParam];
      console.log(data);
      return {
        ...state,
        data,
        deletedQueryParams,
      };
    case `${DELETE_QUERY_PARAM}`:
      delete data.search?.[action.queryParam];
      deletedQueryParams[action.queryParam] = true;
      return {
        ...state,
        data,
        deletedQueryParams,
      };
    default:
      return state;
  }
}
