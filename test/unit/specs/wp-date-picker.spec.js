import { createTest, destroyVM } from '../util';
import WpDatePicker from 'packages/wp-date-picker';

describe('WpDatePicker', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(WpDatePicker, true);
    expect(vm.$el).to.exist;
  });
});

