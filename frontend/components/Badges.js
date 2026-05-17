'use client';

export function StatusBadge({ status }) {
  const cls =
    status === 'Open'
      ? 'badge badge-open'
      : status === 'In Progress'
      ? 'badge badge-progress'
      : 'badge badge-closed';

  const dot = status === 'Open' ? '●' : status === 'In Progress' ? '◑' : '○';

  return (
    <span className={cls}>
      {dot} {status}
    </span>
  );
}

export function CategoryBadge({ category }) {
  if (!category) return null;
  return <span className="badge badge-category">{category}</span>;
}
