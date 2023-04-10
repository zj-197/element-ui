import { createTest, destroyVM } from '../util';
import WpForm from 'packages/wp-form';

describe('WpForm', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(WpForm, true);
    expect(vm.$el).to.exist;
  });
});

