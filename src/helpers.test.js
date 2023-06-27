import { renderHook, act } from '@testing-library/react-hooks';
import {
  getBasePath,
  getConnectorPath,
  getProviderUrl,
  getForm,
  getDataQuery,
  updateChartDataFromProvider,
  mixProviderData,
  getConnectedDataParametersForContext,
  getConnectedDataParametersForProvider,
  useOnScreen,
  getFilteredURL,
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
  it('returns correct query when no context path data', () => {
    const params = {
      connected_data_parameters: {},
      content: { '@id': 'http://example.com/path' },
      data: {},
      location: { pathname: '/edit' },
      params: {},
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });

  it('returns correct query when context path data present', () => {
    const params = {
      connected_data_parameters: {
        byContextPath: {
          'http://example.com/path': [{ i: 'param1', v: 'value1' }],
        },
      },
      content: { '@id': 'http://example.com/path' },
      data: {},
      location: { pathname: '/edit' },
      params: {},
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [{ i: 'param1', v: 'value1' }];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });

  it('handles the presence of route parameters', () => {
    const params = {
      connected_data_parameters: {
        byContextPath: {
          'http://example.com/path': [{ i: 'param1', v: 'value1' }],
        },
      },
      content: { '@id': 'http://example.com/path' },
      data: undefined,
      location: { pathname: '/edit' },
      params: { param1: 'routeValue1' },
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [{ i: 'param1', v: ['routeValue1'] }];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });

  it('combines data query from data object with context path data', () => {
    const params = {
      connected_data_parameters: {
        byContextPath: {
          'http://example.com/path': [{ i: 'param1', v: 'value1' }],
        },
      },
      content: { '@id': 'http://example.com/path' },
      data: { data_query: [{ i: 'param2', v: 'value2' }] },
      location: { pathname: '/edit' },
      params: {},
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [
      { i: 'param2', v: 'value2' },
      { i: 'param1', v: 'value1' },
    ];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });

  it('filters context path data when has_data_query_by_context is false', () => {
    const params = {
      connected_data_parameters: {
        byContextPath: {
          'http://example.com/path': [{ i: 'param1', v: 'value1' }],
        },
        byProviderPath: {
          'http://example.com/provider': [{ i: 'param3', v: 'value3' }],
        },
      },
      content: { '@id': 'http://example.com/path' },
      data: {
        has_data_query_by_provider: true,
        has_data_query_by_context: false,
      },
      location: { pathname: '/edit' },
      params: {},
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [{ i: 'param3', v: 'value3' }];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });

  it('filters context path data when has_data_query_by_context is false', () => {
    const params = {
      connected_data_parameters: {
        byContextPath: {
          'http://example.com/path': [{ i: 'param1', v: 'value1' }],
        },
      },
      content: undefined,
      data: { has_data_query_by_provider: false },
      location: { pathname: '/edit' },
      params: {},
      provider_url: 'http://example.com/provider',
    };
    const expectedResult = [];

    expect(getDataQuery(params)).toEqual(expectedResult);
  });
});

describe('updateChartDataFromProvider function', () => {
  it('returns original chartData when providerData is null', () => {
    const chartData = [{ x: [1, 2, 3], y: [4, 5, 6] }];
    const providerData = null;
    const expectedResult = [{ x: [1, 2, 3], y: [4, 5, 6] }];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });

  it('returns original chartData when providerData is undefined', () => {
    const chartData = [{ x: [1, 2, 3], y: [4, 5, 6] }];
    const providerData = undefined;
    const expectedResult = [{ x: [1, 2, 3], y: [4, 5, 6] }];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });

  it('returns updated chartData with providerData values', () => {
    const chartData = [
      {
        xsrc: 'x_values',
        ysrc: 'y_values',
        transforms: [{ targetsrc: 'y_values' }],
      },
      { xsrc: 'x_values', ysrc: 'z_values', transforms: [] },
    ];
    const providerData = {
      x_values: [1, 2, 3],
      y_values: [4, 5, 6],
      z_values: [7, 8, 9],
    };
    const expectedResult = [
      {
        xsrc: 'x_values',
        ysrc: 'y_values',
        transforms: [{ targetsrc: 'y_values', target: [4, 5, 6] }],
      },
      { xsrc: 'x_values', ysrc: 'z_values', transforms: [] },
    ];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });

  it('returns original chartData when providerData does not contain matching keys', () => {
    const chartData = [{ xsrc: 'x_values', ysrc: 'y_values' }];
    const providerData = { z_values: [7, 8, 9] };
    const expectedResult = [
      { xsrc: 'x_values', ysrc: 'y_values', transforms: [] },
    ];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });

  it('returns original chartData when trace values are not strings', () => {
    const chartData = [{ xsrc: 'x_values', ysrc: 'y_values' }];
    const providerData = { x_values: [1, 2, 3], y_values: 4 };
    const expectedResult = [
      { xsrc: 'x_values', ysrc: 'y_values', transforms: [] },
    ];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });

  it('returns updated chartData with transformed target values from providerData', () => {
    const chartData = [
      {
        xsrc: 'x_values',
        ysrc: 'y_values_src',
        y: [4, 5, 6],
        transforms: [
          {
            targetsrc: 'y_values_src',
            target: [4, 5, 6],
          },
        ],
      },
      {
        xsrc: 'x_values',
        ysrc: 'z_values_src',
        y: [7, 8, 9],
        transforms: [
          {
            targetsrc: 'z_values_src',
            target: [7, 8, 9],
          },
        ],
      },
    ];
    const providerData = {
      y_values_src: [1, 2, 3],
      z_values_src: [10, 11, 12],
    };
    const expectedResult = [
      {
        xsrc: 'x_values',
        ysrc: 'y_values_src',
        y: [1, 2, 3],
        transforms: [
          {
            targetsrc: 'y_values_src',
            target: [1, 2, 3],
          },
        ],
      },
      {
        xsrc: 'x_values',
        ysrc: 'z_values_src',
        y: [10, 11, 12],
        transforms: [
          {
            targetsrc: 'z_values_src',
            target: [10, 11, 12],
          },
        ],
      },
    ];

    expect(updateChartDataFromProvider(chartData, providerData)).toEqual(
      expectedResult,
    );
  });
});

describe('mixProviderData', () => {
  it('should handle empty input', () => {
    const result = mixProviderData(undefined, {}, [], '');

    expect(result).toEqual([]);
  });

  it('should handle the case where trace.transforms is not defined', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
    };
    const parameters = [{ i: 'providerDataKey1', v: ['value1'] }];
    const result = mixProviderData(chartData, providerData, parameters, '');

    expect(result[0].column1).toEqual(providerData.providerDataKey1);
  });

  it('should handle transformValue as an array', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
        transforms: [
          { targetsrc: 'providerDataKey1', value: ['value1', 'value2'] },
        ],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
    };
    const parameters = [{ i: 'providerDataKey1', v: ['value1'] }];
    const connectedDataTemplateString = 'value1,value2';
    const result = mixProviderData(
      chartData,
      providerData,
      parameters,
      connectedDataTemplateString,
    );

    expect(result[0].transforms[0].value).toEqual(['value1', 'value1']);
  });

  it('should return original providerData when no parameters match', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
    };
    const parameters = [{ i: 'providerDataKey2', v: ['value1'] }];
    const result = mixProviderData(chartData, providerData, parameters, '');

    expect(result[0].column1).toEqual(providerData.providerDataKey1);
  });

  it('should update trace object with providerData values', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
        column2src: 'providerDataKey2',
        column2: [],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
      providerDataKey2: ['value3', 'value4'],
    };
    const result = mixProviderData(chartData, providerData, [], '');

    expect(result[0].column1).toEqual(providerData.providerDataKey1);
    expect(result[0].column2).toEqual(providerData.providerDataKey2);
  });

  it('should use parameters to filter providerData', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
        transforms: [
          {
            targetsrc: 'providerDataKey1',
            value: 'value1',
          },
        ],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
    };
    const parameters = [{ i: 'providerDataKey1', v: ['value1'] }];
    const result = mixProviderData(chartData, providerData, parameters, '');

    expect(result[0].transforms[0].value).toEqual('value1');
    expect(result[0].transforms[0].target).toEqual(
      providerData.providerDataKey1,
    );
  });

  it('should replace transform values based on connectedDataTemplateString', () => {
    const chartData = [
      {
        column1src: 'providerDataKey1',
        column1: [],
        transforms: [
          {
            targetsrc: 'providerDataKey1',
            value: '<<value>>',
          },
        ],
      },
    ];
    const providerData = {
      providerDataKey1: ['value1', 'value2'],
    };
    const parameters = [{ i: 'providerDataKey1', v: ['value1'] }];
    const connectedDataTemplateString = '<<value>>';
    const result = mixProviderData(
      chartData,
      providerData,
      parameters,
      connectedDataTemplateString,
    );

    expect(result[0].transforms[0].value).toEqual('value1');
    expect(result[0].transforms[0].target).toEqual(
      providerData.providerDataKey1,
    );
  });
});

describe('getConnectedDataParametersForContext function', () => {
  it('returns connected data parameters for the given context path', () => {
    const connectedDataParameters = {
      byContextPath: {
        'http://example.com/path1': [{ i: 'param1', v: 'value1' }],
        'http://example.com/path2': [{ i: 'param2', v: 'value2' }],
      },
    };
    const url = 'http://example.com/path1';
    const expectedResult = [{ i: 'param1', v: 'value1' }];

    expect(
      getConnectedDataParametersForContext(connectedDataParameters, url),
    ).toEqual(expectedResult);
  });

  it('returns null when no connected data parameters for the given context path', () => {
    const connectedDataParameters = {
      byContextPath: {
        '/path1': [{ i: 'param1', v: 'value1' }],
        '/path2': [{ i: 'param2', v: 'value2' }],
      },
    };
    const url = 'http://example.com/path1';
    const expectedResult = null;

    expect(
      getConnectedDataParametersForContext(connectedDataParameters, url),
    ).toEqual(expectedResult);
  });

  it('returns null when connected data parameters are not provided', () => {
    const connectedDataParameters = {
      byContextPath: undefined,
    };
    const url = 'http://example.com/path1';
    const expectedResult = null;

    expect(
      getConnectedDataParametersForContext(connectedDataParameters, url),
    ).toEqual(expectedResult);
  });

  it('returns null when the URL is not provided', () => {
    const connectedDataParameters = {
      byContextPath: {
        '/path1': [{ i: 'param1', v: 'value1' }],
        '/path2': [{ i: 'param2', v: 'value2' }],
      },
    };
    const url = '';
    const expectedResult = null;

    expect(
      getConnectedDataParametersForContext(connectedDataParameters, url),
    ).toEqual(expectedResult);
  });
});

describe('getConnectedDataParametersForProvider function', () => {
  it('returns connected data parameters for the given provider URL', () => {
    const connectedDataParameters = {
      byProviderPath: {
        'http://example.com/provider1': {
          filter1: [{ i: 'param1', v: 'value1' }],
          filter2: [{ i: 'param2', v: 'value2' }],
        },
        'http://example.com/provider2': {
          filter3: [{ i: 'param3', v: 'value3' }],
        },
      },
    };
    const providerURL = 'http://example.com/provider1';
    const expectedResult = [
      [{ i: 'param1', v: 'value1' }],
      [{ i: 'param2', v: 'value2' }],
    ];

    expect(
      getConnectedDataParametersForProvider(
        connectedDataParameters,
        providerURL,
      ),
    ).toEqual(expectedResult);
  });

  it('returns an empty array when no connected data parameters for the given provider URL', () => {
    const connectedDataParameters = {
      byProviderPath: {
        'http://example.com/provider1': {
          filter1: [{ i: 'param1', v: 'value1' }],
          filter2: [{ i: 'param2', v: 'value2' }],
        },
        'http://example.com/provider2': {
          filter3: [{ i: 'param3', v: 'value3' }],
        },
      },
    };
    const providerURL = 'http://example.com/provider3';
    const expectedResult = [];

    expect(
      getConnectedDataParametersForProvider(
        connectedDataParameters,
        providerURL,
      ),
    ).toEqual(expectedResult);
  });

  it('returns an empty array when connected data parameters are not provided', () => {
    const connectedDataParameters = {
      byProviderPath: undefined,
    };
    const providerURL = 'http://example.com/provider1';
    const expectedResult = [];

    expect(
      getConnectedDataParametersForProvider(
        connectedDataParameters,
        providerURL,
      ),
    ).toEqual(expectedResult);
  });

  it('returns an empty array when the provider URL is not provided', () => {
    const connectedDataParameters = {
      byProviderPath: {
        'http://example.com/provider1': {
          filter1: [{ i: 'param1', v: 'value1' }],
          filter2: [{ i: 'param2', v: 'value2' }],
        },
        'http://example.com/provider2': {
          filter3: [{ i: 'param3', v: 'value3' }],
        },
      },
    };
    const providerURL = '';
    const expectedResult = [];

    expect(
      getConnectedDataParametersForProvider(
        connectedDataParameters,
        providerURL,
      ),
    ).toEqual(expectedResult);
  });
});

describe('useOnScreen', () => {
  let observe;
  let unobserve;
  let callback;

  beforeEach(() => {
    observe = jest.fn();
    unobserve = jest.fn();

    window.IntersectionObserver = jest.fn(function (cb) {
      this.observe = observe;
      this.unobserve = unobserve;
      callback = cb;
    });
  });

  it('should handle the situation where ref.current is null when unmounting', () => {
    const ref = { current: {} };
    const { unmount } = renderHook(() => useOnScreen(ref));

    act(() => {
      ref.current = null;
    });

    unmount();
  });

  it('should return isIntersecting as true when the element is visible', () => {
    const ref = {
      current: document.createElement('div'),
    };
    const { result } = renderHook(() => useOnScreen(ref));

    act(() => {
      callback([{ isIntersecting: true }]);
    });

    expect(result.current.isIntersecting).toBe(true);
  });

  it('should return isIntersecting as false when the element is not visible', () => {
    const ref = {
      current: document.createElement('div'),
    };
    const { result } = renderHook(() => useOnScreen(ref));

    act(() => {
      callback([{ isIntersecting: false }]);
    });

    expect(result.current.isIntersecting).toBe(false);
  });
});

describe('getFilteredURL', () => {
  it('should return the original URL if no connected_data_parameters are provided', () => {
    const url = 'https://test.com?query=<<param1>>&other=<<param2>>';
    expect(getFilteredURL(url)).toBe(url);
  });

  it('should return the original URL if no parameters are present in the URL', () => {
    const url = 'https://test.com?query=value&other=value';
    const connected_data_parameters = [
      { i: 'param1', v: ['value1'] },
      { i: 'param2', v: ['value2'] },
    ];
    expect(getFilteredURL(url, connected_data_parameters)).toBe(url);
  });

  it('should replace parameters in URL with connected_data_parameters values', () => {
    const url = '<<param1>>';
    const connected_data_parameters = [{ i: 'param1', v: ['value1'] }];
    const expectedUrl = 'value1';
    expect(getFilteredURL(url, connected_data_parameters)).toBe(expectedUrl);
  });
});
