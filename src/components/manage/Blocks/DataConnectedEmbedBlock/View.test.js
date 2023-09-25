import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ViewEmbedBlock from './View.jsx';

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
        <ViewEmbedBlock data={data} />
      </Provider>,
    );

    expect(getByTitle('Embeded Google Maps')).toBeInTheDocument();
  });
});
