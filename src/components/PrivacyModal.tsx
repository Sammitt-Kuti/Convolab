'use client';

import React, { useState } from 'react';
import { ShieldCheck, Trash2, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
  onDataDeleted: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  participantId,
  onDataDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to permanently delete all data associated with your participant ID?')) {
      return;
    }

    setIsDeleting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/research?participantId=${encodeURIComponent(participantId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeleteSuccess(true);
        setTimeout(() => {
          onDataDeleted();
          onClose();
        }, 1200);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to delete data');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-emerald)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Research Ethics & Privacy Notice</h2>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.6rem' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.65', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>
            <strong>ConvoLab</strong> is an early-stage academic and product research experiment designed to test whether personalized practice scenarios help students and job seekers develop nuanced communication skills.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>What We Collect (With Consent):</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>A randomized anonymous participant identifier (e.g., <code>{participantId}</code>).</li>
              <li>Your self-reported onboarding responses (communication goals & frequencies).</li>
              <li>Your written responses to assessment and practice scenarios.</li>
              <li>Whether you choose to retry an exercise and your completion timestamps.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>What We NEVER Collect:</h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Your real name, email, student ID, or contact information.</li>
              <li>IP addresses, browser fingerprinting, or tracking ad pixels.</li>
              <li>Payment details or sensitive biometric data.</li>
            </ul>
          </div>

          <p>
            <strong>Right to Deletion:</strong> You have full control over your data. You can delete all responses associated with your session ID at any time below.
          </p>

          {errorMsg && (
            <div style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {deleteSuccess ? (
            <div style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              <span>All participant data successfully purged. Resetting session...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Active ID: <code>{participantId}</code>
              </span>
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                onClick={handleDeleteData}
                disabled={isDeleting}
              >
                <Trash2 size={15} />
                <span>{isDeleting ? 'Deleting...' : 'Delete My Data'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
