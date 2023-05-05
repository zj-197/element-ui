import { createTest, destroyVM } from '../util';
import LoadList from 'packages/load-list';

describe('LoadList', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(LoadList, true);
    expect(vm.$el).to.exist;
  });
});

