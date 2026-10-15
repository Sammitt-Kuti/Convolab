'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles, MessageSquare, Compass, Sliders } from 'lucide-react';

interface WelcomeScreenProps {
  participantId: string;
  consented: boolean;
  onConsentChange: (consented: boolean) => void;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  participantId,
  consented,
  onConsentChange,
  onStart
}) => {
  const [localConsent, setLocalConsent] = useState(consented);

  const handleToggleConsent = () => {
    const updated = !localConsent;
    setLocalConsent(updated);
    onConsentChange(updated);
  };

  const handleStart = () => {
    if (!localConsent) {
      alert('Please agree to the research consent before starting.');
      return;
    }
    onStart();
  };

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '1rem auto' }}>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
        <Sparkles size={14} />
        <span>Personalised Communication Simulator</span>
      </div>

      <h1 className="title-hero">
        Master Nuanced Communication <span>Through Safe Simulation</span>
      </h1>

      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Practice high-stakes social interactions: deciphering ambiguous Slack messages, setting firm boundaries without guilt, staying concise without rambling, and stepping into fast-paced group discussions.
      </p>

      {/* 3 Pillars differentiating from generic apps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Compass size={22} color="var(--primary-500)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Not a Grammar Checker</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            We do not correct commas. We analyze social subtext, contextual calibration, and conversational impact.
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Sliders size={22} color="var(--accent-emerald)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>No Permanent Labels</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            You will not be assigned a rigid personality type or psychiatric score. Every profile is an evolving working hypothesis.
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <MessageSquare size={22} color="var(--accent-cyan)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Constructive & Safe</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            A judgment-free sandbox to experiment with bold, concise, and boundary-affirming responses before real life.
          </p>
        </div>
      </div>

      {/* Sequence Roadmap */}
      <div style={{ background: 'rgba(13, 18, 30, 0.85)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>
          Your 5-Step Practice Journey
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span>1. Brief Goals</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>2. Three Baseline Scenarios</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>3. Working Profile</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>4. Targeted Drills</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>5. Instant Feedback & Retry</span>
        </div>
      </div>

      {/* Informed Consent Checkbox */}
      <div
        onClick={handleToggleConsent}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          padding: '1.15rem',
          borderRadius: 'var(--radius-md)',
          background: localConsent ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${localConsent ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
          cursor: 'pointer',
          marginBottom: '1.75rem',
          transition: 'all 200ms ease'
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `2px solid ${localConsent ? 'var(--primary-500)' : 'var(--border-medium)'}`,
            background: localConsent ? 'var(--primary-500)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2
          }}
        >
          {localConsent && <Check size={16} color="white" />}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Informed Research Participation Consent
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            I agree to participate in this communication improvement study. I understand my responses are evaluated to test learning efficacy and stored under the anonymous identifier <code>{participantId}</code> without my name, email, or sensitive data. I can delete my data at any time.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
          onClick={handleStart}
          disabled={!localConsent}
        >
          <span>Begin Onboarding & Baseline</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
