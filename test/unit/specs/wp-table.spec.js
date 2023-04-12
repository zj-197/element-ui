import { createTest, destroyVM } from '../util';
import WpTable from 'packages/wp-table';

describe('WpTable', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(WpTable, true);
    expect(vm.$el).to.exist;
  });
});

