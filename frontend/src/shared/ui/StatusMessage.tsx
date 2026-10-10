import type { ReactNode } from 'react';
import './StatusMessage.css';

type StatusMessageProps = {
  tone?: 'info' | 'problem';
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

/** A plain notice for loading failures and empty results. */
export function StatusMessage({ tone = 'info', title, children, action }: StatusMessageProps) {
  return (
    <div
      className={`status-message status-message--${tone}`}
      role={tone === 'problem' ? 'alert' : 'status'}
    >
      <h2 className="status-message__title">{title}</h2>
      {children ? <p>{children}</p> : null}
      {action ? <div className="status-message__action">{action}</div> : null}
    </div>
  );
}

export function LoadingNotice({ label }: { label: string }) {
  return (
    <p className="loading-notice" role="status">
      {label}
    </p>
  );
}
