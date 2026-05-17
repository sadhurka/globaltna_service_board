'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, CategoryBadge } from '@/components/Badges';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Roofing', 'Flooring', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Closed'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (search.trim()) params.search = search.trim();
      const data = await api.getJobs(params);
      setJobs(data.data);
    } catch (e) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Service requests</h1>
        <p className="page-sub">Browse open jobs from homeowners across the UK</p>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <svg className="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="input search-input"
            type="text"
            placeholder="Search jobs…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <span className="toolbar-label">Category</span>
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="toolbar-label">Status</span>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div className="empty">
          <div className="empty-icon">⚠️</div>
          <h3>Could not load jobs</h3>
          <p>{error}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '12px', color: 'var(--ink-3)' }}>
            Make sure the backend is running on port 5000.
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your filters or <Link href="/jobs/new" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>post a new request</Link>.</p>
        </div>
      ) : (
        <div className="cards">
          {jobs.map((job) => (
            <Link key={job._id} href={`/jobs/${job._id}`} className="card">
              <div className="card-meta">
                <StatusBadge status={job.status} />
                <CategoryBadge category={job.category} />
              </div>
              <div className="card-title">{job.title}</div>
              <div className="card-desc">{job.description}</div>
              <div className="card-footer">
                <span className="card-location">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {job.location || 'Location not specified'}
                </span>
                <span className="card-date">{formatDate(job.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}