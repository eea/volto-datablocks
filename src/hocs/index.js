import React from 'react';

import connectToProviderData from './connectToProviderData';
import connectToProviderDataUnfiltered from './connectToProviderDataUnfiltered';
import connectToMultipleProviders from './connectToMultipleProviders';
import connectToMultipleProvidersUnfiltered from './connectToMultipleProvidersUnfiltered';
import connectToPopupProviderData from './connectToPopupProviderData';
import withBlockData from './withBlockData';
import withEditBlockData from './withEditBlockData';

export {
  connectToProviderData,
  connectToMultipleProviders,
  connectToProviderDataUnfiltered,
  connectToMultipleProvidersUnfiltered,
  withBlockData,
  withEditBlockData,
  connectToPopupProviderData,
};

export const ConnectorContext = new React.createContext();
