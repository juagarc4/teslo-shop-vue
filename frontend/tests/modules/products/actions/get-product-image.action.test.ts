import { getProductImageAction } from '@/modules/products/actions';

describe('getProductImageAction', () => {
  test('Should return the full URL to the image', () => {
    const imageName = 'test.jpg';
    const url = getProductImageAction(imageName);
    const expectedUrl = `${import.meta.env.VITE_TESLO_API_URL}/files/product/${imageName}`;
    expect(url).toBe(expectedUrl);
  });
});
