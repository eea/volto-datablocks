import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ViewEmbedBlock from './View.jsx';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@eeacms/volto-embed', () => {
  return {
    PrivacyProtection: jest.fn(({ children }) => <div>{children}</div>),
  };
});

jest.mock('@plone/volto/helpers', () => ({
  getBaseUrl: jest.fn(),
  flattenToAppURL: jest.fn(),
}));

const mockStore = configureStore();

describe('ViewEmbedBlock', () => {
  it('renders the component', () => {
    const store = mockStore({
      connected_data_parameters: {},
      router: {
        location: {
          pathname: '/',
        },
      },
    });

    const data = {
      url: 'https://example.com/embed',
      height: 400,
      align: 'center',
    };

    const { getByTitle } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ViewEmbedBlock data={data} />
        </IntlProvider>
      </Provider>,
    );

    expect(getByTitle('Embeded Google Maps')).toBeInTheDocument();
  });
});
