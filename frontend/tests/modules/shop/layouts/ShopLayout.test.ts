import { shallowMount } from '@vue/test-utils';
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';

describe('<ShopLayout />', () => {
  test('Should render top menu, router view and foorter', () => {
    const wrapper = shallowMount(ShopLayout, {
      global: { stubs: ['router-view'] },
    });
    expect(wrapper.findComponent({ name: 'TopMenu' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CustomFooter' }).exists()).toBe(true);
  });
});
