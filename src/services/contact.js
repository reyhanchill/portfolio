export function validateContact(form) {
  if (!form.name.trim() || !form.message.trim()) return 'Please enter your name and a message.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
  return '';
}

export async function sendContact(form, recipient, signal) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(), email: form.email.trim(), message: form.message.trim(),
      _subject: `Portfolio message from ${form.name.trim()}`,
    }),
  });
  const result = await response.json();
  if (!response.ok || (result.success !== true && result.success !== 'true')) throw new Error('Message was not accepted.');
}
