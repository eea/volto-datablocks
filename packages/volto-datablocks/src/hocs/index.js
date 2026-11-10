import React from 'react';

import connectToProviderData from './connectToProviderData';
import connectToProviderDataUnfiltered from './connectToProviderDataUnfiltered';
import connectToMultipleProviders from './connectToMultipleProviders';
import connectToMultipleProvidersUnfiltered from './connectToMultipleProvidersUnfiltered';
import withBlockData from './withBlockData';
import withEditBlockData from './withEditBlockData';

export {
  connectToProviderData,
  connectToMultipleProviders,
  connectToProviderDataUnfiltered,
  connectToMultipleProvidersUnfiltered,
  withBlockData,
  withEditBlockData,
};

export const ConnectorContext = new React.createContext();
