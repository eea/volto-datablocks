import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { Router } from 'react-router-dom';

import { getDataProviderHash } from '../helpers';
import { connectToProviderData } from './connectToProviderData';

const providerUrl = '/provider';
const filteredData = { value: ['filtered A'] };
const unfilteredData = { value: ['unfiltered'] };

const Probe = ({
  provider_data,
  prev_provider_data,
  provider_metadata,
  prev_provider_metadata,
  loadingProviderData,
  waitingForProviderParams,
}) => (
  <div
    data-testid="probe"
    data-provider={provider_data?.value?.[0] || ''}
    data-previous={prev_provider_data?.value?.[0] || ''}
    data-metadata={provider_metadata?.label || ''}
    data-previous-metadata={prev_provider_metadata?.label || ''}
    data-loading={String(loadingProviderData)}
    data-waiting={String(waitingForProviderParams)}
  />
);

const ConnectedProbe = connectToProviderData(() => ({
  provider_url: providerUrl,
}))(Probe);

const makeState = () => ({
  content: { data: {} },
  connected_data_parameters: {},
  data_providers: {
    data: {
      [providerUrl]: {
        [getDataProviderHash({ filter: 'A' })]: filteredData,
        [getDataProviderHash()]: unfilteredData,
      },
    },
    metadata: {
      [providerUrl]: {
        [getDataProviderHash({ filter: 'A' })]: { label: 'filtered metadata' },
        [getDataProviderHash()]: { label: 'unfiltered metadata' },
      },
    },
    pendingConnectors: {},
    failedConnectors: {},
  },
});

const renderProbe = (history) => {
  const actions = [];
  const observer = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };
  const store = createStore(
    (state = makeState()) => state,
    makeState(),
    applyMiddleware(observer),
  );

  return {
    actions,
    ...render(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedProbe
            data={{
              allowedParams: ['filter'],
              waitForParams: true,
            }}
          />
        </Router>
      </Provider>,
    ),
  };
};

describe('connectToProviderData waitForParams', () => {
  it('does not expose cached default data while required parameters are missing', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { actions } = renderProbe(history);

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-waiting',
        'true',
      );
    });

    expect(screen.getByTestId('probe')).toHaveAttribute('data-provider', '');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-previous', '');
    expect(screen.getByTestId('probe')).toHaveAttribute('data-metadata', '');
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-previous-metadata',
      '',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-loading',
      'false',
    );
    expect(actions).toHaveLength(0);
  });

  it('does not remember cached default data as the previous valid result', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/?filter=A'],
    });
    const { actions } = renderProbe(history);

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-provider',
        'filtered A',
      );
    });

    act(() => history.push('/'));

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-waiting',
        'true',
      );
    });
    expect(screen.getByTestId('probe')).toHaveAttribute('data-provider', '');

    act(() => history.push('/?filter=B'));

    await waitFor(() => {
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-waiting',
        'false',
      );
    });
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-provider',
      'filtered A',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute(
      'data-previous',
      'filtered A',
    );
    expect(screen.getByTestId('probe')).toHaveAttribute('data-loading', 'true');
    expect(actions).toHaveLength(1);
  });
});
