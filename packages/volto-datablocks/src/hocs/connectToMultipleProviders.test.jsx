import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { Router } from 'react-router-dom';

import { getDataProviderHash } from '../helpers';
import { connectToMultipleProviders } from './connectToMultipleProviders';

const providerUrl = '/provider';
const providerName = 'Provider';

const Probe = ({
  providers_data,
  providers_metadata,
  providers_waiting_for_params,
}) => (
  <div
    data-testid="probe"
    data-provider={providers_data?.[providerName]?.value?.[0] || ''}
    data-metadata={providers_metadata?.[providerName]?.label || ''}
    data-waiting={String(providers_waiting_for_params?.[providerName])}
  />
);

const ConnectedProbe = connectToMultipleProviders(() => ({
  providers: [
    {
      provider_url: providerUrl,
      name: providerName,
      data: {
        allowedParams: ['filter'],
        waitForParams: true,
      },
    },
  ],
}))(Probe);

const defaultHash = getDataProviderHash();
const filteredHash = getDataProviderHash({ filter: 'A' });

const initialState = {
  content: { data: {} },
  connected_data_parameters: {},
  data_providers: {
    data: {
      [providerUrl]: {
        [defaultHash]: { value: ['unfiltered'] },
        [filteredHash]: { value: ['filtered A'] },
      },
    },
    metadata: {
      [providerUrl]: {
        [defaultHash]: { label: 'unfiltered metadata' },
        [filteredHash]: { label: 'filtered metadata' },
      },
    },
    pendingConnectors: {},
    failedConnectors: {},
  },
};

const renderProbe = (path) => {
  const actions = [];
  const observer = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };
  const history = createMemoryHistory({ initialEntries: [path] });
  const store = createStore(
    (state = initialState) => state,
    initialState,
    applyMiddleware(observer),
  );

  return {
    actions,
    history,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProbe />
        </Router>
      </Provider>,
    ),
  };
};

describe('connectToMultipleProviders waitForParams', () => {
  it('suppresses cached data and metadata while required parameters are missing', async () => {
    const { actions } = renderProbe('/');

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-waiting',
        'true',
      );
    });

    expect(screen.getByTestId('probe')).toHaveAttribute('data-provider', '');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-metadata', '');
    expect(actions).toHaveLength(0);
  });

  it('suppresses valid cached data immediately when a required parameter is removed', async () => {
    const { history } = renderProbe('/?filter=A');

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-provider',
        'filtered A',
      );
    });

    act(() => history.push('/'));

    expect(screen.getByTestId('probe')).toHaveAttribute('data-provider', '');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-metadata', '');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-waiting', 'true');
  });

  it('exposes data and metadata when all required parameters are present', async () => {
    renderProbe('/?filter=A');

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-provider',
        'filtered A',
      );
    });

    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-metadata',
      'filtered metadata',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-waiting',
      'false',
    );
  });
});
