import { setupBeforeEach, tearDownAfterEach } from '../support';
import { changePageTitle, addBlock } from '../helpers';
//import { openSidebarTab } from '../helpers';

const groups = {
  data_blocks: {
    title: 'Data blocks',
    id: 'data_blocks',
  },
  custom_addons: {
    title: 'Custom addons',
    id: 'custom_addons',
  },
};

const data_blocks_ids = [
  'bubbleChart',
  'dataqueryfilter',
  'dottedTableChart',
  'routeParameter',
  'simpleDataConnectedTable',
];

const custom_addons_ids = ['countryFlag'];

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Blocks: Empty', () => {
    changePageTitle('Volto datablocks tests');
    data_blocks_ids.forEach((id) => {
      addBlock(groups.data_blocks.title, groups.data_blocks.id, id);
    });
    custom_addons_ids.forEach((id) => {
      addBlock(groups.custom_addons.title, groups.custom_addons.id, id);
    });
  });
});
