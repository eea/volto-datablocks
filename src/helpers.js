import { settings } from '~/config';

// export function getConnectedDataParameters(state, props) {
//   let path = props?.url || '';
//
//   // if (!path) return;
//
//   path = path
//     .replace(settings.apiPath, '')
//     .replace(settings.internalApiPath, '');
//
//   console.log('data parameters path', path);
//   console.log('data state', state.connected_data_parameters.byPath);
//
//   return state.connected_data_parameters.byPath?.[path] || null;
// }

export function getConnectedDataParameters(state, props) {
  let path = props?.url || '';

  path = path
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');

  // NOTE: we fetch first the general parameter. This is temporary, it should
  // be handled for more cases. Doing it this way means that there's no way to
  // have multiple data selectors on the page, because the first one overrides
  // the second. There's multiple things that need to be improved here.
  // The whole volto-datablocks, volto-plotlycharts need to be updated if this
  // code and cases change.
  const res =
    state.connected_data_parameters.byPath?.[''] ||
    state.connected_data_parameters.byPath?.[path] ||
    null;
  return res;
}
