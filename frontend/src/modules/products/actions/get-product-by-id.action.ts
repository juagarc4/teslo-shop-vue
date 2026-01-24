import { tesloApi } from '@/api/tesloApi';
import type { Product } from '@/modules/products/interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductByIdAction = async (productId: string) => {
  // TODO: Action to create a new product.

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
  } catch (error) {
    console.log(error);
    throw new Error(`Error getting product by id ${productId}`);
  }
};
