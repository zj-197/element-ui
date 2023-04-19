import { createTest, destroyVM } from '../util';
import WpSearchTable from 'packages/wp-search-table';

describe('WpSearchTable', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(WpSearchTable, true);
    expect(vm.$el).to.exist;
  });
});

