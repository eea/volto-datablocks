import {
  getBasePath,
  getConnectorPath,
  getProviderUrl,
  getForm,
  getDataQuery,
} from './helpers';

describe('getBasePath function', () => {
  it('getBasePath correctly processes url', () => {
    const url = 'https://example.com/login';
    expect(getBasePath(url)).toEqual('https://example.com');
  });
});

describe('getConnectorPath function', () => {
  it('getConnectorPath correctly generates connector path', () => {
    const provider_url = 'https://example.com/';
    const hashValue = 'hashValue';
    expect(getConnectorPath(provider_url, hashValue)).toEqual(
      'https://example.com/#hashValue',
    );

    expect(getConnectorPath(provider_url, '')).toEqual(
      'https://example.com/#_default',
    );
  });
});

describe('getProviderUrl function', () => {
  it('getProviderUrl correctly processes url', () => {
    const url = 'https://example.com/@@download/file';
    expect(getProviderUrl(url)).toEqual('https://example.com');
    expect(getProviderUrl('')).toEqual('');
  });
});

describe('getForm function', () => {
  it('returns form data correctly', () => {
    const data = {
      data: {
        form: {
          name: 'John',
          age: 25,
        },
        allowedParams: ['name', 'age', 'country'],
      },
      location: {
        search: '?country=USA',
      },
      pagination: {
        enabled: true,
        activePage: 2,
        itemsPerPage: 10,
      },
    };
    expect(getForm(data)).toEqual({
      name: 'John',
      age: 25,
      country: 'USA',
      p: 2,
      nrOfHits: 10,
    });
  });

  it('returns form data correctly', () => {
    const data = {
      data: undefined,
      location: undefined,
      pagination: undefined,
      extraConditions: { test: 'test condition' },
    };
    expect(getForm(data)).toEqual({
      extra_conditions: {
        test: 'test condition',
      },
    });
  });
});

describe('getDataQuery function', () => {
  it('returns correct data query', () => {
    const data = {
      connected_data_parameters: {
        byContextPath: {
          ' /path': [{ i: 'index', v: ['value'] }],
        },
      },
      content: { '@id': ' http://localhost:8080/Plone/path' },
      data: {},
      location: {},
      params: {},
      provider_url: '',
    };
    expect(getDataQuery(data)).toEqual([{ i: 'index', v: ['value'] }]);
  });
});
