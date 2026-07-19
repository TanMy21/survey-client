/**
 * Utility to generate and persist a stable deviceId per browser.
 * - Survives reloads and tab closures (localStorage + cookie fallback)
 * - Unique per browser profile
 * - Used to identify a participant device for public surveys
 */

export const LS_DID_KEY = "ff_cid";

/** Read cookie by name */
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="))
    ?.split("=")[1];
}

function setCookie(name: string, value: string, days = 180) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${value}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
}

/**
 * Returns a stable deviceId for this browser.
 * If none exists, a new one is generated and saved.
 */
export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(LS_DID_KEY) || getCookie(LS_DID_KEY);

  // generate if missing
  if (!id) {
    const browserCrypto = globalThis.crypto as Crypto & {
      randomUUID?: () => string;
    };

    if (typeof browserCrypto.randomUUID === "function") {
      id = browserCrypto.randomUUID();
    } else {
      const bytes = new Uint8Array(16);
      browserCrypto.getRandomValues(bytes);
      id = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    localStorage.setItem(LS_DID_KEY, id);
    setCookie(LS_DID_KEY, id);
  } else {
    // ensure both stores are populated (sync)
    localStorage.setItem(LS_DID_KEY, id);
    setCookie(LS_DID_KEY, id);
  }

  return id;
}
