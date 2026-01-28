import { shallowMount } from '@vue/test-utils';
import ProductsView from '@/modules/admin/views/ProductsView.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import type { Mock } from 'vitest';
import { fakeProducts } from '../../../fake/products.fake';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: ProductsView,
    },
  ],
});
vi.mock('@tanstack/vue-query', () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({
      prefetchQuery: vi.fn(),
    }),
    useQuery: vi.fn(),
  };
});

describe('<ProductsView />', () => {
  (useQuery as Mock).mockReturnValue({
    data: fakeProducts,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).scrollTo = vi.fn();
  const wrapper = shallowMount(ProductsView, {
    global: {
      plugins: [router],
    },
  });
  test('Should render with default values', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('Should prefetch query on mounted', async () => {
    const page = 2;
    await router.replace(`/?page=${page}`);

    expect(useQueryClient().prefetchQuery).toHaveBeenCalledWith({
      queryKey: ['products', { page: page + 1 }],
      queryFn: expect.any(Function),
    });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
