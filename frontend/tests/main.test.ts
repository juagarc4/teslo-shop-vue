describe('main.ts', () => {
  test('Should return proper env values', () => {
    expect(import.meta.env.VITE_TESLO_API_URL).toBe('http://localhost:3000/api');
  });
});
