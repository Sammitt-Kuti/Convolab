'use client';

import React from 'react';
import { MessageSquareCode, ShieldCheck, Sparkles, Lock, RefreshCw } from 'lucide-react';

interface NavbarProps {
  participantId: string;
  aiStatus: {
    aiConfigured: boolean;
    model: string;
    mode: 'live_ai' | 'demo';
  };
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  onResetSession: () => void;
  onBrandClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  participantId,
  aiStatus,
  onOpenPrivacy,
  onOpenAdmin,
  onResetSession,
  onBrandClick
}) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={onBrandClick} role="button" tabIndex={0}>
          <div className="brand-icon">
            <MessageSquareCode size={20} />
          </div>
          <span>ConvoLab</span>
        </div>

        <div className="nav-badges">
          {/* AI vs Demo Mode Status Indicator */}
          <div
            className="status-pill"
            title={
              aiStatus.aiConfigured
                ? `Active Gemini Model: ${aiStatus.model}`
                : 'Demo mode active. Add GEMINI_API_KEY in .env.local to activate live AI.'
            }
          >
            <span className={`status-dot ${aiStatus.aiConfigured ? 'live' : 'demo'}`} />
            <span>
              {aiStatus.aiConfigured ? (
                <>
                  <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {aiStatus.model}
                </>
              ) : (
                'Demo Mode (Offline Heuristics)'
              )}
            </span>
          </div>

          {/* Participant ID Badge */}
          {participantId && (
            <div className="participant-pill" title="Your anonymous research participant ID">
              ID: {participantId}
            </div>
          )}

          {/* Privacy Button */}
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={onOpenPrivacy}
            title="View research consent and data privacy"
          >
            <ShieldCheck size={14} />
            <span>Privacy & Rights</span>
          </button>

          {/* Researcher Admin Dashboard Button */}
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={onOpenAdmin}
            title="Open Researcher Admin Dashboard (Passcode protected)"
          >
            <Lock size={14} />
            <span>Research Admin</span>
          </button>

          {/* Reset Session Button */}
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            onClick={onResetSession}
            title="Reset and start a new session"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
