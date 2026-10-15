'use client';

import React, { useState } from 'react';
import { Lock, Download, RefreshCw, X, ShieldAlert, CheckCircle, BarChart3, Users } from 'lucide-react';
import { ResearchSessionRecord } from '@/types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [sessions, setSessions] = useState<ResearchSessionRecord[]>([]);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/research?passcode=${encodeURIComponent(passcode)}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setSessions(data.sessions || []);
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Invalid passcode. Default is convolab2025');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open(`/api/research?format=csv&passcode=${encodeURIComponent(passcode)}`, '_blank');
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ metrics, sessions }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'convolab_research_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={18} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Researcher & Experimentation Dashboard</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Protected view for academic evaluation & participant metrics</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <label className="input-label" htmlFor="admin-passcode">Enter Researcher Access Passcode:</label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (Default: convolab2025)"
                className="textarea-field"
                style={{ minHeight: 'unset', height: '44px', marginBottom: '0.5rem' }}
                autoFocus
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Configured via <code>RESEARCH_PASSCODE</code> in environment variables.
              </p>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading || !passcode}>
              <Lock size={16} />
              <span>{loading ? 'Authenticating...' : 'Unlock Dashboard'}</span>
            </button>
          </form>
        ) : (
          <div>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }} onClick={handleDownloadCsv}>
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }} onClick={handleDownloadJson}>
                  <Download size={14} />
                  <span>Export JSON</span>
                </button>
                <button type="button" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }} onClick={() => handleLogin()}>
                  <RefreshCw size={14} />
                  <span>Refresh</span>
                </button>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                onClick={() => {
                  setIsAuthenticated(false);
                  setPasscode('');
                }}
              >
                Lock Session
              </button>
            </div>

            {/* Metrics Cards */}
            {metrics && (
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-label">Total Participants</div>
                  <div className="metric-value">{metrics.totalParticipants}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{metrics.consentedCount} consented</span>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Assessments Done</div>
                  <div className="metric-value">{metrics.totalAssessments}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Baseline completed</span>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Practice Drills</div>
                  <div className="metric-value">{metrics.totalPractices}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{metrics.totalRetries} retries</span>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Retry Rate</div>
                  <div className="metric-value" style={{ color: 'var(--accent-emerald)' }}>
                    {metrics.retryRatePercent}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Engagement signal</span>
                </div>
              </div>
            )}

            {/* Participant Table */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
              Participant Sessions ({sessions.length})
            </h4>

            {sessions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No participant sessions recorded yet. Start an onboarding or practice session to see live telemetry!
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Participant ID</th>
                      <th>Consented</th>
                      <th>Onboarded</th>
                      <th>Assessment</th>
                      <th>Practices</th>
                      <th>Retries</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.participantId}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{s.participantId}</td>
                        <td>
                          <span style={{ color: s.consented ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                            {s.consented ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>{s.onboardingCompleted ? 'Completed' : 'Skipped/Pending'}</td>
                        <td>{s.assessmentCompleted ? 'Completed' : 'Pending'}</td>
                        <td>{s.practiceAttempts?.length || 0}</td>
                        <td>{s.retryCount || 0}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
