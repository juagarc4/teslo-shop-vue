import { tesloApi } from '@/api/tesloApi';

/* Using axios-mock-adapter
import MockAdapter from 'axios-mock-adapter';
const mockTesloApi = new MockAdapter(tesloApi);
mockTesloApi.onGet('/test').reply(200, { data: 'test' });
*/

describe('tesloApi axios instance', () => {
  test('Should have baseURL set to VITE_TESLO_API_URL', () => {
    expect(tesloApi.defaults.baseURL).toEqual(import.meta.env.VITE_TESLO_API_URL);
  });
  test('Should set Auth header with token from localhost', async () => {
    const token = 'myAuthToken';
    localStorage.setItem('token', token);
    /* using axios-mock-adapater: if we don't want to use the real api call,
    we can use the package axios-mock-adapter
    const resp = await tesloApi.get('/test'); */
    const resp = await tesloApi.get('/api');
    expect(resp.config.headers.Authorization).toEqual(`Bearer ${token}`);
  });

  test('Should not set Auth header if token does not exist in localStorage', async () => {
    localStorage.clear();
    /* using axios-mock-adapater: if we don't want to use the real api call,
    we can use the package axios-mock-adapter
    const resp = await tesloApi.get('/test'); */
    const resp = await tesloApi.get('/api');
    expect(resp.config.headers.Authorization).toBeUndefined();
  });
});
