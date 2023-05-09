import { createTest, destroyVM } from '../util';
import SugarButton from 'packages/sugar-button';

describe('SugarButton', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(SugarButton, true);
    expect(vm.$el).to.exist;
  });
});

