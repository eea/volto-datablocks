import React from 'react';
import { render, screen, act } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom/extend-expect';

import VisibilitySensor from './VisibilitySensor';

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  UniversalLink: ({ children, href }) => {
    return <a href={href}>{children}</a>;
  },
}));

jest.mock('react-visibility-sensor', () => (props) => {
  const { children, onChange, active, ...rest } = props;
  return (
    <div data-testid="visibility-sensor" {...rest}>
      {children({ isVisible: active })}
    </div>
  );
});

const mockStore = configureStore();

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

describe('VisibilitySensor', () => {
  it('should render the children when visible', () => {
    render(
      <Provider store={{ ...store, print: { isPrint: false } }}>
        <VisibilitySensor useVisibilitySensor>
          <div data-testid="content">Some content</div>
        </VisibilitySensor>
      </Provider>,
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should set active to false when the component becomes visible', () => {
    render(
      <Provider store={{ ...store, print: { isPrint: false } }}>
        <VisibilitySensor useVisibilitySensor>
          <div data-testid="content">Some content</div>
        </VisibilitySensor>
      </Provider>,
    );

    const visibilitySensor = screen.getByTestId('visibility-sensor');
    act(() => {
      visibilitySensor.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should set active to false when the component is in print mode', () => {
    render(
      <Provider store={{ ...store, print: { isPrint: true } }}>
        <VisibilitySensor useVisibilitySensor>
          <div data-testid="content">Some content</div>
        </VisibilitySensor>
      </Provider>,
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
