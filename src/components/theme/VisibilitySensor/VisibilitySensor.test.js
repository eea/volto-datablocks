import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import VisibilitySensor from './VisibilitySensor';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  UniversalLink: ({ children, href }) => {
    return <a href={href}>{children}</a>;
  },
}));

test('renders a VisibilitySensor', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
    content: {
      create: {},
    },
    connected_data_parameters: {},
  });
  const component = renderer.create(
    <Provider store={store}>
      <VisibilitySensor useVisibilitySensor={false}>
        <div>
          <p>Some content</p>
        </div>
      </VisibilitySensor>
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
