import { ConnectedDataConnectorTable } from './View';
import { useLocation } from 'react-router';

export default function DataConnectorTableViewWidget(props) {
  const location = useLocation();
  return (
    <ConnectedDataConnectorTable
      location={location}
      {...props}
      content={props.value}
    />
  );
}
