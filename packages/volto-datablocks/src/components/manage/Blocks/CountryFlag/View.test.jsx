import React from 'react';
import { render } from '@testing-library/react';
// import renderer from 'react-test-renderer';
import { CountryFlagView } from './View';
import { Router } from 'react-router-dom';
// import { Provider } from 'react-intl-redux';
// import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';

vi.mock('./withQuerystringResults', () => (Component) => Component);

// vi.mock('react-router-dom', () => ({
//   useLocation: vi.fn().mockReturnValue({
//     pathname: '/marine/belgium',
//     search: '',
//     hash: '',
//     state: null,
//     key: '5nvxpbdafa',
//   }),
// }));

describe('CountryFlagView', () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  const mockData = {
    country_name: null,
    show_name: false,
    show_flag: false,
    show_dropdown: false,
  };

  const mockMetadata = {
    title: 'Belgium',
    '@id': '/marine/belgium',
  };

  it('renders corectly', () => {
    const { container } = render(
      <Router history={history}>
        <CountryFlagView data={mockData} metadata={mockMetadata} />,
      </Router>,
    );

    expect(container.querySelector('.country-flag')).toBeInTheDocument();
  });
});
