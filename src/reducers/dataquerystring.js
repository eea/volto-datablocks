// import { GET_DATA_QUERYSTRING } from '../constants';
//
// const initialState = {
//   error: null,
//   indexes: {},
//   sortable_indexes: {},
//   loaded: false,
//   loading: false,
// };
//
// /**
//  * Querystring reducer.
//  * @function querystring
//  * @param {Object} state Current state.
//  * @param {Object} action Action to be handled.
//  * @returns {Object} New state.
//  */
// export default function dataquerystring(state = initialState, action = {}) {
//   switch (action.type) {
//     case `${GET_DATA_QUERYSTRING}_PENDING`:
//       return {
//         ...state,
//         error: null,
//         loaded: false,
//         loading: true,
//       };
//     case `${GET_DATA_QUERYSTRING}_SUCCESS`:
//       return {
//         ...state,
//         error: null,
//         indexes: action.result.indexes,
//         sortable_indexes: action.result.sortable_indexes,
//         loaded: true,
//         loading: false,
//       };
//     case `${GET_DATA_QUERYSTRING}_FAIL`:
//       return {
//         ...state,
//         error: action.error,
//         indexes: {},
//         sortable_indexes: {},
//         loaded: false,
//         loading: false,
//       };
//     default:
//       return state;
//   }
// }
