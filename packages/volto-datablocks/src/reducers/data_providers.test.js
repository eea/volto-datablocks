import { GET_DATA_FROM_PROVIDER } from '@eeacms/volto-datablocks/constants';
import dataProviders from './data_providers';

const providerSuccess = ({ hashValue, results, metadata }) => ({
  type: `${GET_DATA_FROM_PROVIDER}_SUCCESS`,
  path: '/provider',
  hashValue,
  result: {
    data: {
      results,
      metadata,
    },
  },
});

describe('data providers reducer', () => {
  it('preserves metadata for previously cached requests', () => {
    const firstState = dataProviders(
      undefined,
      providerSuccess({
        hashValue: 'first',
        results: { values: ['first result'] },
        metadata: { unit: 'first unit' },
      }),
    );

    const secondState = dataProviders(
      firstState,
      providerSuccess({
        hashValue: 'second',
        results: { values: ['second result'] },
        metadata: { unit: 'second unit' },
      }),
    );

    expect(secondState.metadata['/provider']).toEqual({
      first: { unit: 'first unit' },
      second: { unit: 'second unit' },
    });
  });
});
