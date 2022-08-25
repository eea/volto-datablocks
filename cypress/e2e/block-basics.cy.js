import { setupBeforeEach, tearDownAfterEach } from '../support/e2e';
import { changePageTitle, addBlock } from '../helpers';

const groups = {
  data_blocks: {
    title: 'Data blocks',
    id: 'data_blocks',
  },
  common: {
    title: 'Common',
    id: 'common',
  },
};

const data_blocks_ids = [
  'dataqueryfilter',
  'dottedTableChart',
  'simpleDataConnectedTable',
];

const common_ids = ['countryFlag'];

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Blocks: Empty', () => {
    changePageTitle('Volto datablocks tests');
    data_blocks_ids.forEach((id) => {
      addBlock(groups.data_blocks.title, groups.data_blocks.id, id);
    });
    common_ids.forEach((id) => {
      addBlock(groups.common.title, groups.common.id, id);
    });
  });
});
