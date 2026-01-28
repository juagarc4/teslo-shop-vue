import path from 'path';
import fs from 'fs';

import { tesloApi } from '@/api/tesloApi';
import { loginAction } from '@/modules/auth/actions';
import { createUpdateProductAction } from '@/modules/products/actions';
import type { Product } from '@/modules/products/interfaces/product.interface';

describe('createUpdateProductAction', () => {
  beforeAll(async () => {
    const resp = await loginAction('test1@google.com', 'Abc123');
    if (!resp.ok) {
      throw new Error('Failed to login');
    }

    localStorage.setItem('token', resp.token);
  });
  test('Should create a new product', async () => {
    const product: Product = {
      id: '',
      title: 'New Product2',
      price: 1,
      description: 'New Product Test2',
      slug: 'new-product-2',
      stock: 10,
      sizes: [],
      gender: 'kid',
      tags: [],
      images: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: {} as any,
    };

    const resp = await createUpdateProductAction(product);
    await tesloApi.delete(`/products/${resp.id}`);
    expect(resp).toEqual({
      title: 'New Product2',
      price: 1,
      description: 'New Product Test2',
      slug: 'new-product-2',
      stock: 10,
      sizes: [],
      gender: 'kid',
      tags: [],
      images: [],
      user: {
        id: expect.any(String),
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: ['admin'],
      },
      id: expect.any(String),
    });
  });
  test('Should update a product', async () => {
    const products = await tesloApi.get<Product[]>('/products');
    const product = products.data[0]!;
    const productId = product.id;

    const updatedProduct = {
      ...product,
      title: 'Updated title',
      description: 'Updated description',
      stock: 10,
    };

    const resp = await createUpdateProductAction(updatedProduct);
    expect(resp).toEqual(
      expect.objectContaining({
        ...product,
        id: productId,
        title: 'Updated title',
        description: 'Updated description',
        stock: 10,
      }),
    );
  });
  test('Should upload product image', async () => {
    const imagePath = path.join(__dirname, '../../../fake', 't-shirt.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageFile = new File([imageBuffer], 't-shirt.jpg', { type: 'image/jpeg' });
    const product: Product = {
      id: '',
      title: 'New Product2',
      price: 1,
      description: 'New Product Test2',
      slug: 'new-product-2',
      stock: 10,
      sizes: [],
      gender: 'kid',
      tags: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      images: [imageFile] as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: {} as any,
    };

    const { images, id } = await createUpdateProductAction(product);
    const [image] = images;
    expect(typeof image).toBe('string');

    await tesloApi.delete(`/products/${id}`);
  });
});
