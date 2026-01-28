import { getProductByIdAction, getProductsAction } from '@/modules/products/actions';
import { Product } from '../../../../../backend/src/products/entities/product.entity';

describe('getProductByIdAction', async () => {
  test('Should return empty prodcut on create argument', async () => {
    const product = await getProductByIdAction('create');
    expect(product).toEqual({
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
    });
  });
  test('Should return a product if ID is found', async () => {
    const products = await getProductsAction(1, 10);
    const product = await getProductByIdAction(products[0]!.id);
    product.images.sort((a, b) => a.localeCompare(b));
    products[0]!.images.sort((a, b) => a.localeCompare(b));
    expect(product).toEqual(products[0]);
  });
  test('Should return a product if ID is NOT found', async () => {
    try {
      await getProductByIdAction('XXXXXX');
      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe('Error getting product by id XXXXXX');
    }
  });
});
