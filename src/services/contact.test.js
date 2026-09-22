import { sendContact, validateContact } from './contact';
const form = { name: ' Reyhan ', email: ' hello@example.com ', message: ' Hello there ' };
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

test('blank names, blank messages and invalid addresses are rejected', () => {
  expect(validateContact({ ...form, name: '  ' })).not.toBe('');
  expect(validateContact({ ...form, message: '\n ' })).not.toBe('');
  expect(validateContact({ ...form, email: 'no-address' })).not.toBe('');
  expect(validateContact(form)).toBe('');
});

test.each([true, 'true'])('confirmed success (%s) sends trimmed content and an abort signal', async success => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success }) });
  const controller = new AbortController();
  await expect(sendContact(form, 'owner@example.com', controller.signal)).resolves.toBeUndefined();
  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe('https://formsubmit.co/ajax/owner%40example.com');
  expect(options.signal).toBe(controller.signal);
  expect(JSON.parse(options.body)).toMatchObject({ name: 'Reyhan', email: 'hello@example.com', message: 'Hello there' });
});

test.each([
  [true, { success: false }], [true, { success: 'false' }], [true, {}], [false, { success: true }],
])('HTTP/service failure is not reported as success', async (ok, body) => {
  global.fetch = jest.fn().mockResolvedValue({ ok, json: async () => body });
  await expect(sendContact(form, 'owner@example.com')).rejects.toThrow();
});

test('network and malformed responses propagate failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
  await expect(sendContact(form, 'owner@example.com')).rejects.toThrow('offline');
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => { throw new Error('invalid JSON'); } });
  await expect(sendContact(form, 'owner@example.com')).rejects.toThrow('invalid JSON');
});
