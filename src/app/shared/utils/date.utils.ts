export function nowSGT(): string {
  const now = new Date();
  const offsetMs = 8 * 60 * 60 * 1000;
  const sgt = new Date(now.getTime() + offsetMs - now.getTimezoneOffset() * 60000);
  return sgt.toISOString().replace('Z', '+08:00');
}
