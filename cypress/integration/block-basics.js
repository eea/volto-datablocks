import { setupBeforeEach, tearDownAfterEach } from '../support';
import { changePageTitle, addBlock } from '../helpers';
import { openSidebarTab } from '../helpers';

const group = {
  title: 'Data blocks',
  id: 'data_blocks',
};

const blocksIds = [
  'data_connected_block',
  'auto_select_parameter',
  'discodata_connector_block',
  'discodata_sql_builder',
  'discodata_table_block',
  'discodata_components_block',
];

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Blocks: Empty', () => {
    changePageTitle('Volto datablocks tests');
    blocksIds.forEach((id) => {
      addBlock(group.title, group.id, id);
    });
  });
});

// describe('Discodata sql builder tests', () => {
//   beforeEach(setupBeforeEach);
//   afterEach(tearDownAfterEach);

//   it('Add Block: Empty', () => {
//     changePageTitle('Volto datablocks tests');
//     addBlock(group.title, group.id, 'discodata_sql_builder');
//     openSidebarTab('Block');
//     cy.get('input#field-field-widget-provider_url').should(
//       'have.value',
//       'https://discodata.eea.europa.eu/sql',
//     );
//   });
// });
