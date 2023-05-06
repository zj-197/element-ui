import { createTest, destroyVM } from '../util';
import RenderEmptyCpn from 'packages/render-empty-cpn';

describe('RenderEmptyCpn', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(RenderEmptyCpn, true);
    expect(vm.$el).to.exist;
  });
});

