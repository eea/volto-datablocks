import React from 'react';
import { render } from '@testing-library/react';
import View from './View';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('@eeacms/volto-datablocks/hocs', () => ({
  connectToProviderData: () => (WrappedComponent) => WrappedComponent,
}));

jest.mock('@eeacms/volto-datablocks/actions', () => ({
  setBlockTocVisibility: (id, visible) => ({
    type: 'SET_BLOCK_TOC_VISIBILITY',
    id,
    visible,
  }),
}));

jest.mock('@plone/volto/components/theme/View/RenderBlocks', () => () => null);

describe('ConditionalDataBlock View toC visibility', () => {
  const baseProps = {
    id: 'block-1',
    data: {
      title: 'Block',
      column_data: 'country',
      operator: '=',
      condition: 'IT',
    },
    metadata: { UID: 'uid-1' },
  };

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('reports the block as visible when the condition matches', () => {
    render(<View {...baseProps} provider_data={{ country: ['IT'] }} />);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_BLOCK_TOC_VISIBILITY',
      id: 'uid-1::block-1',
      visible: true,
    });
  });

  it('reports the block as hidden when the condition does not match', () => {
    render(<View {...baseProps} provider_data={{ country: ['FR'] }} />);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_BLOCK_TOC_VISIBILITY',
      id: 'uid-1::block-1',
      visible: false,
    });
  });

  it('does not report while the provider data is still loading', () => {
    render(
      <View
        {...baseProps}
        provider_data={undefined}
        loadingProviderData={true}
      />,
    );

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
