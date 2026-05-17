'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, CategoryBadge } from '@/components/Badges';

const STATUSES = ['Open', 'In Progress', 'Closed'];

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);

  function addToast(msg, type = 'success') {
    const t = { id: Date.now(), msg, type };
    setToasts((ts) => [...ts, t]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), 3500);
  }

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      try {
        const data = await api.getJob(id);
        setJob(data.data);
        setNewStatus(data.data.status);
      } catch (e) {
        if (e.message?.includes('not found') || e.message?.includes('404')) setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleStatusUpdate() {
    if (newStatus === job.status) return;
    setUpdating(true);
    try {
      const data = await api.updateStatus(id, newStatus);
      setJob(data.data);
      addToast(`Status updated to "${newStatus}"`, 'success');
    } catch (e) {
      addToast(e.message || 'Failed to update status', 'error');
      setNewStatus(job.status);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.deleteJob(id);
      router.push('/?deleted=1');
    } catch (e) {
      addToast(e.message || 'Failed to delete job', 'error');
      setDeleting(false);
    }
  }

  if (loading) return <main className="page"><div className="spinner" /></main>;

  if (notFound) return (
    <main className="page">
      <div className="empty">
        <div className="empty-icon">🔎</div>
        <h3>Job not found</h3>
        <p>It may have been deleted. <Link href="/" className="text-link">Back to listings →</Link></p>
      </div>
    </main>
  );

  return (
    <main className="page">
      <Toast toasts={toasts} />

      <Link href="/" className="back-link">
        ← Back to listings
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-meta" style={{ marginBottom: '0.75rem' }}>
            <StatusBadge status={job.status} />
            <CategoryBadge category={job.category} />
          </div>
          <h1 className="detail-title">{job.title}</h1>
          <div className="detail-meta">
            {job.location && (
              <span className="detail-location-span">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {job.location}
              </span>
            )}
            <span className="detail-date-span">
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <div className="detail-section-label">Description</div>
            <div className="detail-section-value" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          <div className="detail-row">
            {job.contactName && (
              <div className="detail-section">
                <div className="detail-section-label">Contact Name</div>
                <div className="detail-section-value">{job.contactName}</div>
              </div>
            )}
            {job.contactEmail && (
              <div className="detail-section">
                <div className="detail-section-label">Contact Email</div>
                <div className="detail-section-value">
                  <a href={`mailto:${job.contactEmail}`} className="text-link">
                    {job.contactEmail}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-actions">
          <div className="status-update-wrap">
            <label className="status-update-label">
              Update Status:
            </label>
            <select
              className="select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={updating}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === job.status}
            >
              {updating ? 'Saving…' : 'Save'}
            </button>
          </div>

          <div className="action-buttons-wrap">
            <Link href={`/jobs/${job._id}/edit`} className="btn btn-ghost">
              Edit Service
            </Link>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete Request'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
