import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { Router } from 'react-router-dom';

import { getDataProviderHash } from '../helpers';
import { connectToProviderDataUnfiltered } from './connectToProviderDataUnfiltered';

const providerUrl = '/provider';

const Probe = ({
  provider_data,
  provider_metadata,
  loadingProviderData,
  hasProviderUrl,
}) => (
  <div
    data-testid="probe"
    data-provider={provider_data?.value?.[0] || ''}
    data-metadata={provider_metadata?.label || ''}
    data-loading={String(loadingProviderData)}
    data-url={String(hasProviderUrl)}
  />
);

const ConnectedProbe = connectToProviderDataUnfiltered(() => ({
  provider_url: providerUrl,
}))(Probe);

const emptyState = () => ({
  content: { data: {} },
  connected_data_parameters: {},
  data_providers: {
    data: {},
    metadata: {},
    pendingConnectors: {},
    failedConnectors: {},
  },
});

const renderProbe = (state) => {
  const actions = [];
  const observer = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };
  const store = createStore((s = state) => s, state, applyMiddleware(observer));
  const history = createMemoryHistory({ initialEntries: ['/'] });

  return {
    actions,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProbe />
        </Router>
      </Provider>,
    ),
  };
};

describe('connectToProviderDataUnfiltered', () => {
  it('passes the unfiltered data to the wrapped component', async () => {
    const hash = getDataProviderHash();
    const state = emptyState();
    state.data_providers.data[providerUrl] = {
      [hash]: { value: ['unfiltered data'] },
    };
    state.data_providers.metadata[providerUrl] = {
      [hash]: { label: 'metadata' },
    };

    const { actions } = renderProbe(state);

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-provider',
        'unfiltered data',
      );
    });
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-metadata',
      'metadata',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-loading',
      'false',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute('data-url', 'true');
    expect(actions).toHaveLength(0);
  });

  it('requests the data when the store has none', async () => {
    const { actions } = renderProbe(emptyState());

    expect(screen.getByTestId('probe')).toHaveAttribute('data-loading', 'true');

    await waitFor(() => {
      expect(
        actions.find((action) => action.type === 'GET_DATA_FROM_PROVIDER'),
      ).toBeTruthy();
    });
    expect(screen.getByTestId('probe')).toHaveAttribute('data-provider', '');
  });
});
