import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';

jest.mock('@eeacms/volto-embed/PrivacyProtection/PrivacyProtection', () => {
  return jest.fn(({ children }) => <div>{children}</div>);
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
      url:
        'https://maps.eea.europa.eu/EEAViewer/?appid=750fc25bd33e4c4193cde940176be91d&NUTS0=AT&zoomto=true&embed=true',
      height: 400,
      align: 'center',
    };

    const { getByTitle } = render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <div
            className={'video-inner'}
            style={{
              minHeight: `${data.height || 200}px`,
            }}
            title={'Embeded Google Maps'}
          >
            Data Embed
          </div>
        </IntlProvider>
      </Provider>,
    );

    expect(getByTitle('Embeded Google Maps')).toBeInTheDocument();
  });
});
