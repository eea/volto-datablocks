import applyConfig, { getNestedTocEntries } from './index';

vi.mock('@plone/volto/icons/image-wide.svg', () => ({
  default: 'image-wide.svg',
}));
vi.mock('./View', () => ({ default: () => null }));
vi.mock('./Edit', () => ({ default: () => null }));

// Volto's Blocks helper requires `uuid`, which is not resolvable in the
// addon's test environment. Provide a minimal `getBlocks` that preserves the
// layout-order semantics this test relies on.
vi.mock('@plone/volto/helpers/Blocks/Blocks', () => ({
  getBlocks: ({ blocks = {}, blocks_layout: { items = [] } = {} } = {}) =>
    items.map((id) => [id, blocks[id]]).filter(([, block]) => block != null),
}));

describe('ConditionalDataBlock tocEntries', () => {
  const slateConfig = {
    tocEntry: (block, tocData) =>
      tocData.levels?.includes(block.value?.[0]?.type)
        ? [parseInt(block.value[0].type.slice(1)), block.plaintext]
        : null,
  };

  const blocksConfig = {
    slate: slateConfig,
    columnsBlock: {
      tocEntries: () => [
        [2, 'from columns'],
        [3, 'from columns 2'],
      ],
    },
  };

  const makeBlock = () => ({
    '@type': 'conditionalDataBlock',
    data: {
      blocks: {
        b1: {
          '@type': 'slate',
          plaintext: 'Heading one',
          value: [{ type: 'h2' }],
        },
        b2: {
          '@type': 'columnsBlock',
        },
        b3: {
          '@type': 'unknownBlock',
        },
      },
      blocks_layout: {
        items: ['b1', 'b2', 'b3'],
      },
    },
  });

  it('collects entries from the nested blocks, in layout order', () => {
    const entries = getNestedTocEntries(
      makeBlock(),
      { levels: ['h1', 'h2'] },
      blocksConfig,
    );

    expect(entries).toEqual([
      [2, 'Heading one'],
      [2, 'from columns'],
      [3, 'from columns 2'],
    ]);
  });

  it('does not throw when the block has no nested content', () => {
    expect(
      getNestedTocEntries(
        { '@type': 'conditionalDataBlock' },
        {},
        blocksConfig,
      ),
    ).toEqual([]);
  });

  it('returns an empty list when no blocks config is provided', () => {
    expect(getNestedTocEntries(makeBlock(), {}, undefined)).toEqual([]);
  });

  describe('runtime visibility gating', () => {
    const getTocEntries = () => {
      const applied = applyConfig({
        blocks: { blocksConfig: { ...blocksConfig } },
        settings: {},
      });
      return applied.blocks.blocksConfig.conditionalDataBlock.tocEntries;
    };

    it('drops the nested entries when the block is reported hidden', () => {
      const tocEntries = getTocEntries();

      expect(
        tocEntries(
          makeBlock(),
          { levels: ['h1', 'h2'] },
          {
            id: 'block-1',
            contentUid: 'uid-1',
            blockTocVisibility: { 'uid-1::block-1': false },
          },
        ),
      ).toEqual([]);
    });

    it('keeps the nested entries when the block is reported visible', () => {
      const tocEntries = getTocEntries();

      expect(
        tocEntries(
          makeBlock(),
          { levels: ['h1', 'h2'] },
          {
            id: 'block-1',
            contentUid: 'uid-1',
            blockTocVisibility: { 'uid-1::block-1': true },
          },
        ),
      ).toEqual([
        [2, 'Heading one'],
        [2, 'from columns'],
        [3, 'from columns 2'],
      ]);
    });

    it('optimistically keeps entries while visibility is unknown', () => {
      const tocEntries = getTocEntries();

      expect(
        tocEntries(
          makeBlock(),
          { levels: ['h1', 'h2'] },
          {
            id: 'block-1',
            contentUid: 'uid-1',
            blockTocVisibility: {},
          },
        ),
      ).toHaveLength(3);
    });
  });
});
