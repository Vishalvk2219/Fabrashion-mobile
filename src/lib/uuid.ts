/** RFC-4122 v4 id for idempotency keys (offline sync events) — not for security. */
export function uuidv4(): string {
  const native = (globalThis as { crypto?: Crypto }).crypto;
  if (native?.randomUUID) return native.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
