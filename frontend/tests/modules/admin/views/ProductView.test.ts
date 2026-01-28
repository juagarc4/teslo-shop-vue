import { ref } from 'vue';
import type { Mock } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory, useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { fakeProducts } from '../../../fake/products.fake';
import ProductView from '@/modules/admin/views/ProductView.vue';

vi.mock('@tanstack/vue-query');
vi.mock('vue-router', async (original) => {
  const originalImp = await original();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(originalImp as any),
    useRouter: vi.fn(),
  };
});
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: ProductView,
    },
  ],
});

describe('<ProductView />', () => {
  const fakeProduct = fakeProducts[0]!;
  const mutateSpy = vi.fn();
  const replaceSpy = vi.fn();
  (useMutation as Mock).mockReturnValue({
    mutate: mutateSpy,
    isPending: ref(false),
    isSuccess: ref(false),
    data: ref(fakeProduct),
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('Should redirect to products if id not found', () => {
    (useQuery as Mock).mockReturnValue({
      data: ref({}),
      isError: ref(true),
      isLoading: ref(false),
      refetch: vi.fn(),
    });
    (useRouter as Mock).mockReturnValue({
      replace: replaceSpy,
    });

    shallowMount(ProductView, {
      props: {
        productId: 'XXXXX',
      },
      global: {
        plugins: [router],
      },
    });
    expect(replaceSpy).toHaveBeenCalledWith('/admin/products');
  });

  test('Should render the product page', () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });

    const wrapper = shallowMount(ProductView, {
      props: {
        productId: 'Abc123',
      },
      global: {
        plugins: [router],
      },
    });

    const customInputs = wrapper.findAllComponents({ name: 'CustomInput' });
    const customTextAreas = wrapper.findAllComponents({ name: 'CustomTextArea' });
    const productValues = Object.values(fakeProduct);
    const sizeButtons = wrapper.findAll('button.flex-1');

    expect(customInputs.length).toBe(4);
    expect(customTextAreas.length).toBe(1);
    expect(sizeButtons.length).toBe(6);

    customInputs.forEach((input) => {
      const modelvalue = input.props('modelValue');
      expect(productValues).toContain(modelvalue);
    });
    customTextAreas.forEach((textArea) => {
      const modelvalue = textArea.props('modelValue');
      expect(productValues).toContain(modelvalue);
    });

    sizeButtons.forEach((button) => {
      if (fakeProduct.sizes.includes(button.text())) {
        expect(button.classes()).toContain('bg-blue-500');
      } else {
        expect(button.classes()).toContain('bg-blue-100');
      }
    });
  });
  test('Should submit the form if the data is valid', async () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });

    const wrapper = shallowMount(ProductView, {
      props: {
        productId: 'Abc123',
      },
      global: {
        plugins: [router],
      },
    });

    const form = wrapper.find('form');

    await form.trigger('submit');
    await new Promise((r) => setTimeout(r, 100));
    expect(mutateSpy).toHaveBeenCalled();
    expect(mutateSpy).toHaveBeenCalledWith(fakeProduct);
  });

  test('Should NOT submit the form if the data is invalid', async () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });

    const wrapper = shallowMount(ProductView, {
      props: {
        productId: 'Abc123',
      },
      global: {
        plugins: [router],
      },
    });
    const titleInput = wrapper.findComponent({ name: 'CustomInput' });
    titleInput.vm.$emit('update:modelValue', '');

    const form = wrapper.find('form');
    await form.trigger('submit');

    await new Promise((r) => setTimeout(r, 100));

    expect(mutateSpy).not.toHaveBeenCalled();
  });
});
