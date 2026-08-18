import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import DataConnectedValue from './DataConnectedValue';

jest.mock('@eeacms/volto-datablocks/hocs', () => ({
  connectToProviderData: () => (Component) => Component,
}));

jest.mock('@plone/volto/helpers/Loadable/Loadable', () => ({
  useLazyLibs: () => ({
    d3: { format: () => (value) => value },
    sanitizeHtml: { default: (value) => value },
  }),
  injectLazyLibs: () => (Component) => Component,
}));

describe('DataConnectedValue parameter waiting state', () => {
  it('shows a skeleton when configured while waiting for parameters', () => {
    const { container } = render(
      <DataConnectedValue
        column="value"
        provider_data={undefined}
        loadingProviderData={false}
        waitingForProviderParams
        skeleton
        skeletonWidth="12rem"
      />,
    );

    expect(container.querySelector('.dcv-skeleton')).toHaveStyle({
      width: '12rem',
    });
  });

  it('shows the configured placeholder when skeletons are disabled', () => {
    render(
      <DataConnectedValue
        column="value"
        provider_data={undefined}
        loadingProviderData={false}
        waitingForProviderParams
        placeholder="Waiting for filters"
        skeleton={false}
      />,
    );

    expect(screen.getByText('Waiting for filters')).toBeInTheDocument();
  });
});
