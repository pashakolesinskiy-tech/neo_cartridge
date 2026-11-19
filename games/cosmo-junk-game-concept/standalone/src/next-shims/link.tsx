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
  ...rest
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a href={href} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}
