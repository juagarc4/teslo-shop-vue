import { tesloApi } from '@/api/tesloApi';
import type { Product } from '@/modules/products/interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductByIdAction = async (productId: string) => {
  if (productId === 'create') {
    return {
      id: '',
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: '' as unknown,
      tags: [],
      images: [],
      user: {} as unknown,
    };
  }
  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);
    return {
      ...data,
      images: data.images.map(getProductImageAction),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.log(error); Commentyed to avoid noide in the tests
    throw new Error(`Error getting product by id ${productId}`);
  }
};
