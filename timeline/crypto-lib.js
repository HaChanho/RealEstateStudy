// WebCrypto AES-GCM-256 + PBKDF2-SHA256(600k). 공유: 브라우저(window.CryptoLib) + Node≥20(require).
// 순수 알고리즘 — 데이터 없음·외부 의존 없음·CSP 안전. 평문/비밀을 어디에도 저장하지 않음.
(function (factory) {
  const lib = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  if (typeof window !== 'undefined') window.CryptoLib = lib;
})(function () {
  const g = (typeof globalThis !== 'undefined') ? globalThis : this;
  const subtle = g.crypto && g.crypto.subtle;
  const ITER = 600000, HASH = 'SHA-256';
  function rand(n) { const a = new Uint8Array(n); g.crypto.getRandomValues(a); return a; }
  function b64e(bytes) { const a = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); let s = ''; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return g.btoa(s); }
  function b64d(str) { const s = g.atob(str); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  async function deriveKey(password, salt, iterations) {
    const base = await subtle.importKey('raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
    return subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iterations, hash: HASH }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function encryptJSON(obj, password) {
    const salt = rand(16), iv = rand(12);
    const key = await deriveKey(password, salt, ITER);
    const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(JSON.stringify(obj))));
    return { v: 1, kdf: { name: 'PBKDF2', hash: HASH, iterations: ITER, salt: b64e(salt) }, iv: b64e(iv), ct: b64e(ct) };
  }
  async function decryptToJSON(blob, password) {
    const key = await deriveKey(password, b64d(blob.kdf.salt), blob.kdf.iterations);
    const pt = await subtle.decrypt({ name: 'AES-GCM', iv: b64d(blob.iv) }, key, b64d(blob.ct)); // 틀린 키/변조 시 throw
    return JSON.parse(new TextDecoder().decode(pt));
  }
  return { ITER: ITER, deriveKey: deriveKey, encryptJSON: encryptJSON, decryptToJSON: decryptToJSON };
});
