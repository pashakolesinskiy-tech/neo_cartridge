/**
 * Заглушка next/navigation для автономной сборки.
 * API совместим с тем, что реально используется в компонентах игры.
 */

export function useParams(): Record<string, string> {
  const seg = window.location.pathname.split("/").filter(Boolean);
  return { code: decodeURIComponent(seg[1] ?? "") };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function usePathname(): string {
  return window.location.pathname;
}

export function useRouter() {
  // Полная навигация: сервер отдаёт index.html на любой путь,
  // точка входа сама разбирает /ship/CODE и /play/CODE.
  return {
    push(href: string) {
      window.location.assign(href);
    },
    replace(href: string) {
      window.location.replace(href);
    },
    back() {
      window.history.back();
    },
    forward() {
      window.history.forward();
    },
    refresh() {
      window.location.reload();
    },
    prefetch() {
      /* no-op */
    },
  };
}

export function redirect(href: string) {
  window.location.assign(href);
}
