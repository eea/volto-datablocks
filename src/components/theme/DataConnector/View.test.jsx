import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import View from './View';

const mockStore = configureStore();

const location = {
  pathname: '/path/to/dataconnector',
};

jest.mock('react-router', () => ({
  __esModule: true,
  withRouter: (Component) => (props) => {
    return <Component {...props} location={location} />;
  },
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useParams: () => {
    return {};
  },
}));

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  Icon: () => {
    return <p>This is an icon</p>;
  },
}));

test('renders DataConnector view', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
    content: {
      data: {
        title: 'Data connector',
        sql_query: 'SELECT * FROM [FISE].[latest].[v_cnct_forest_per_capita]',
      },
    },
    connected_data_parameters: {},
    data_providers: {
      data: {
        [location.pathname]: {
          a91a94e369df59971e2e97fc57c6a4a2c661b0fb: {
            col_1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            col_2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            col_3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            col_4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
      },
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <View location={location} content={store.content} pagination={{}} />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
