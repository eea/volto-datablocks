import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import VisibilitySensor from './VisibilitySensor';

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  UniversalLink: ({ children, href }) => {
    return <a href={href}>{children}</a>;
  },
}));

jest.mock('react-visibility-sensor', () => (props) => {
  const { children, onChange, active } = props;
  return (
    <div
      data-testid="visibility-sensor"
      data-active={active}
      onClick={() => onChange(true)}
      role="presentation"
    >
      {children({ isVisible: false })}
    </div>
  );
});

const mockStore = configureStore();

const renderVisibilitySensor = ({ id, isPrint = false, route = '/' } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Provider
        store={mockStore({
          intl: {
            locale: 'en',
            messages: {},
          },
          content: {
            create: {},
          },
          connected_data_parameters: {},
          print: { isPrint },
        })}
      >
        <VisibilitySensor
          id={id}
          useVisibilitySensor
          Placeholder={() => <div data-testid="placeholder">Loading</div>}
        >
          <div data-testid="content">Some content</div>
        </VisibilitySensor>
      </Provider>
    </MemoryRouter>,
  );

describe('VisibilitySensor', () => {
  it('replaces the placeholder after becoming visible', () => {
    renderVisibilitySensor();

    expect(screen.getByTestId('visibility-sensor')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('visibility-sensor'));

    expect(screen.getByTestId('visibility-sensor')).toHaveAttribute(
      'data-active',
      'false',
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
  });

  it('is inactive in print mode', () => {
    renderVisibilitySensor({ isPrint: true });

    expect(screen.getByTestId('visibility-sensor')).toHaveAttribute(
      'data-active',
      'false',
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('is inactive when disabled through the query string', () => {
    renderVisibilitySensor({ route: '/?visibility_sensor=off' });

    expect(screen.getByTestId('visibility-sensor')).toHaveAttribute(
      'data-active',
      'false',
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('does not observe an id again after it has been visible', () => {
    const firstRender = renderVisibilitySensor({ id: 'seen-test' });
    fireEvent.click(screen.getByTestId('visibility-sensor'));
    firstRender.unmount();

    renderVisibilitySensor({ id: 'seen-test' });

    expect(screen.getByTestId('visibility-sensor')).toHaveAttribute(
      'data-active',
      'false',
    );
  });
});
