import { settings } from '~/config';

export function getConnectedDataParameters(state, props) {
  let path = props?.url || null;

  if (!path) return;

  path = path
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');

  return state.connected_data_parameters.byPath?.[path] || null;
}
