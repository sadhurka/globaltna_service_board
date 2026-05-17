'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Roofing', 'Flooring', 'Other'];

function validate(fields) {
  const errors = {};
  if (!fields.title.trim()) errors.title = 'Title is required';
  if (!fields.description.trim()) errors.description = 'Description is required';
  if (fields.contactEmail && !/^\S+@\S+\.\S+$/.test(fields.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }
  return errors;
}

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [fields, setFields] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      try {
        const data = await api.getJob(id);
        const job = data.data;
        setFields({
          title: job.title || '',
          description: job.description || '',
          category: job.category || 'Plumbing',
          location: job.location || '',
          contactName: job.contactName || '',
          contactEmail: job.contactEmail || '',
        });
      } catch (e) {
        setServerError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError('');
    try {
      await api.updateJob(id, fields);
      router.push(`/jobs/${id}`);
    } catch (err) {
      setServerError(err.message || 'Failed to update service request. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) return <main className="page"><div className="spinner" /></main>;

  return (
    <main className="page">
      <Link href={`/jobs/${id}`} className="back-link">
        ← Back to service details
      </Link>

      <div className="page-header">
        <h1 className="page-title">Edit Service Request</h1>
        <p className="page-sub">Update the details of this service request</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">

            <div className="form-group full">
              <label className="form-label">Title <span className="req">*</span></label>
              <input
                className={`input${errors.title ? ' error' : ''}`}
                name="title"
                value={fields.title}
                onChange={handleChange}
                placeholder="e.g. Leaking kitchen tap needs urgent repair"
                maxLength={120}
              />
              {errors.title && <span className="err-msg">{errors.title}</span>}
            </div>

            <div className="form-group full">
              <label className="form-label">Description <span className="req">*</span></label>
              <textarea
                className={`textarea${errors.description ? ' error' : ''}`}
                name="description"
                value={fields.description}
                onChange={handleChange}
                placeholder="Describe the service in detail — what needs doing, any access issues, materials you have, etc."
                rows={4}
              />
              {errors.description && <span className="err-msg">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" name="category" value={fields.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="input"
                name="location"
                value={fields.location}
                onChange={handleChange}
                placeholder="e.g. Glasgow"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Name</label>
              <input
                className="input"
                name="contactName"
                value={fields.contactName}
                onChange={handleChange}
                placeholder="e.g. Sandra McLean"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`input${errors.contactEmail ? ' error' : ''}`}
                name="contactEmail"
                type="email"
                value={fields.contactEmail}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.contactEmail && <span className="err-msg">{errors.contactEmail}</span>}
            </div>
          </div>

          {serverError && (
            <p className="err-msg" style={{ marginTop: '1rem' }}>⚠ {serverError}</p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href={`/jobs/${id}`} className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
