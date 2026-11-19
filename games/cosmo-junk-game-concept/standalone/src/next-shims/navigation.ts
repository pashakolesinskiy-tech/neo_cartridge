/**
 * Заглушка next/navigation для автономной сборки.
 * API совместим с тем, что реально используется в компонентах игры.
 */

function isHashMode(): boolean {
  return (
    Boolean((window as any).__COSMO_HASH_ROUTER__) ||
    window.location.hash.startsWith("#/") ||
    window.location.pathname.endsWith(".html") ||
    window.location.protocol === "file:"
  );
}

function getEffectivePath(): string {
  const hash = window.location.hash;
  if (hash.startsWith("#/")) {
    return hash.slice(1).split("?")[0];
  }
  return window.location.pathname;
}

function toHashTarget(href: string): string {
  const clean = href.startsWith("#") ? href.slice(1) : href;
  return "#" + (clean.startsWith("/") ? clean : "/" + clean);
}

export function useParams(): Record<string, string> {
  const seg = getEffectivePath().split("/").filter(Boolean);
  return { code: decodeURIComponent(seg[1] ?? "") };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function usePathname(): string {
  return getEffectivePath();
}

export function useRouter() {
  return {
    push(href: string) {
      if (isHashMode()) {
        window.location.hash = toHashTarget(href);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        return;
      }
      window.location.assign(href);
    },
    replace(href: string) {
      if (isHashMode()) {
        const nextHash = toHashTarget(href);
        history.replaceState(null, "", window.location.pathname + window.location.search + nextHash);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        return;
      }
      window.location.replace(href);
    },
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    },
    refresh() {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    },
    prefetch() {
      /* no-op */
    },
  };
}

export function redirect(href: string) {
  if (isHashMode()) {
    window.location.hash = toHashTarget(href);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.assign(href);
}
