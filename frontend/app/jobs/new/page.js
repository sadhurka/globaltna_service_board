'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewJobPage() {
  const router = useRouter();
  const [fields, setFields] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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
      const res = await api.createJob(fields);
      router.push(`/jobs/${res.data._id}`);
    } catch (err) {
      setServerError(err.message || 'Failed to create service request. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <Link href="/" className="back-link">
        ← Back to listings
      </Link>

      <div className="page-header">
        <h1 className="page-title">Post a Service Request</h1>
        <p className="page-sub">Describe what you need and tradespeople will get in touch</p>
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
              <label className="form-label">Your Name</label>
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
              {submitting ? 'Posting…' : 'Post Request'}
            </button>
            <Link href="/" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
