export function getConnectedDataParameters(state, props) {
  let path = props?.url || null;

  if (!path) return;

  return state.connected_data_parameters.byUrl?.[path] || null;
}
