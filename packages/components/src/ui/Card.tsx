import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div className={`rounded-xl border border-neutral-200 p-4 shadow-sm ${className}`} {...rest}>
      {children}
      公共组件
    </div>
  );
}
