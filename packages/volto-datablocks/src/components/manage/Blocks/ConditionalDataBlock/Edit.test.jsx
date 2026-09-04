import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom';
import Edit from './Edit';

const mockBlocksForm = vi.fn(() => <div data-testid="blocks-form" />);
const mockSidebarPortal = vi.fn(({ children }) => (
  <div data-testid="sidebar-portal">{children}</div>
));

vi.mock('@plone/volto/components/manage/Blocks/Block/BlocksForm', () => {
  return { default: (props) => mockBlocksForm(props) };
});

vi.mock('@plone/volto/components/manage/Form/InlineForm', () => {
  return { default: () => <div data-testid="inline-form" /> };
});
vi.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  default: (props) => mockSidebarPortal(props),
}));

vi.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  emptyBlocksForm: vi.fn(() => ({
    blocks: {
      empty: {
        '@type': 'empty',
      },
    },
    blocks_layout: {
      items: ['empty'],
    },
  })),
}));

vi.mock('@eeacms/volto-datablocks/hocs', () => ({
  connectToProviderData: () => (Component) => Component,
}));

vi.mock('./schema', () => ({
  ConditionalDataBlockSchema: vi.fn(() => ({
    title: 'Conditional data block',
    properties: {
      column_data: {},
    },
  })),
}));

describe('ConditionalDataBlock Edit', () => {
  const props = {
    block: 'conditional-block',
    data: {
      title: 'Conditional data block',
      allowedBlocks: ['slate'],
      data: {
        blocks: {
          block1: {
            '@type': 'slate',
          },
        },
        blocks_layout: {
          items: ['block1'],
        },
      },
    },
    onChangeBlock: vi.fn(),
    onChangeField: vi.fn(),
    pathname: '/',
    selected: true,
    manage: true,
    properties: {},
    metadata: {},
    provider_data: {
      2: {},
      1: {},
    },
    setSidebarTab: vi.fn(),
    intl: {
      formatMessage: ({ defaultMessage }) => defaultMessage,
    },
  };

  beforeEach(() => {
    mockBlocksForm.mockClear();
    mockSidebarPortal.mockClear();
  });

  it('uses the default Volto BlocksForm wrapper flow for nested blocks', () => {
    const { container, getByText, getByTestId } = render(
      <IntlProvider locale="en">
        <Edit {...props} />
      </IntlProvider>,
    );

    const blocksFormProps = mockBlocksForm.mock.calls.at(-1)[0];

    expect(getByText('Conditional data block')).toBeInTheDocument();
    expect(getByTestId('blocks-form')).toBeInTheDocument();
    expect(getByTestId('sidebar-portal')).toBeInTheDocument();
    expect(blocksFormProps.isMainForm).toBe(false);
    expect(blocksFormProps.stopPropagation).toBe('block1');
    expect(blocksFormProps.children).toBeUndefined();
    expect(
      container.querySelector('fieldset.section-block'),
    ).toBeInTheDocument();
  });

  it('adds the disable-inner-buttons modifier when configured', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <Edit
          {...props}
          data={{
            ...props.data,
            disableInnerButtons: true,
          }}
        />
      </IntlProvider>,
    );

    expect(container.querySelector('fieldset.section-block')).toHaveClass(
      'disable-inner-buttons',
    );
  });
});
