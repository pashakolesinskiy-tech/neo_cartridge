import type { CSSProperties, ReactNode } from "react";

/**
 * Заглушка next/link: обычная <a>-навигация.
 * Сервер отдаёт index.html на любой путь — достаточно полной перезагрузки.
 */
export default function Link({
  href,
  children,
  className,
  style,
  onClick,
  ...rest
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const isHashMode =
    typeof window !== "undefined" &&
    (Boolean((window as any).__COSMO_HASH_ROUTER__) ||
      window.location.hash.startsWith("#/") ||
      window.location.pathname.endsWith(".html") ||
      window.location.protocol === "file:");
  const resolvedHref =
    isHashMode && href.startsWith("/") ? `#${href}` : href;

  return (
    <a
      href={resolvedHref}
      className={className}
      style={style}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && isHashMode && href.startsWith("/")) {
          e.preventDefault();
          window.location.hash = `#${href}`;
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
