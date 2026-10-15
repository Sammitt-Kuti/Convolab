'use client';

import React from 'react';
import { UserCommunicationProfile } from '@/types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Target,
  Compass,
  Layers,
  Repeat
} from 'lucide-react';
import { PRACTICE_SCENARIOS } from '@/data/scenarios';

interface ProfileScreenProps {
  profile: UserCommunicationProfile;
  onStartPractice: (scenarioId?: string) => void;
  onRetakeAssessment: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onStartPractice,
  onRetakeAssessment
}) => {
  const recommendedScenario =
    PRACTICE_SCENARIOS.find((s) => s.id === profile.recommendedScenarioId) ||
    PRACTICE_SCENARIOS[0];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner Card */}
      <div className="card card-highlight">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={13} />
              <span>Initial Communication Calibration</span>
            </div>
            <h1 className="title-section" style={{ fontSize: '2rem' }}>
              Your Personalized Communication Profile
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Synthesized from your onboarding goals and behavioral scenario responses.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Confidence Calibration</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
              {profile.confidenceCalibration.level}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {profile.totalCompletedPractices} practices completed
            </div>
          </div>
        </div>

        {/* Calibration Note (Anti-Diagnostic / Anti-Personality disclaimer) */}
        <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.15rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <HelpCircle size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <strong>Evidence-Based Working Baseline:</strong> {profile.confidenceCalibration.note} We avoid rigid personality typing; your profile updates continuously as you complete targeted practice exercises.
          </p>
        </div>
      </div>

      {/* Recommended Next Practice Callout Box */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.12) 60%, rgba(16, 185, 129, 0.08) 100%)', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Target size={18} color="var(--accent-emerald)" />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: '#6ee7b7' }}>
                First Recommended Practice Exercise
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>
              {recommendedScenario.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '600px' }}>
              Focus: <strong>{recommendedScenario.categoryLabel}</strong> • {recommendedScenario.context}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-emerald"
            style={{ padding: '0.85rem 1.85rem', fontSize: '1rem', fontWeight: 700 }}
            onClick={() => onStartPractice(recommendedScenario.id)}
          >
            <span>Start Practice Challenge</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid: Observed Strengths vs Areas to Practise */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Strengths Column */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Observed Strengths</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.observedStrengths.map((strength, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#a7f3d0', marginBottom: '0.3rem' }}>
                  {strength.name}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.65rem' }}>
                  {strength.description}
                </p>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.78rem', color: '#6ee7b7' }}>
                  <strong>Specific Evidence:</strong> {strength.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Areas Column */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Areas to Practise</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.areasToPractise.map((area, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fde68a' }}>
                    {area.name}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: area.priority === 'high' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: area.priority === 'high' ? '#fda4af' : '#fbbf24',
                      border: `1px solid ${area.priority === 'high' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}
                  >
                    {area.priority} Priority
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.65rem' }}>
                  {area.description}
                </p>
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.78rem', color: '#fde047' }}>
                  <strong>Observed Evidence:</strong> {area.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Self-Reported vs Observed Calibration Card */}
      <div className="card" style={{ background: 'rgba(10, 14, 24, 0.75)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="var(--primary-500)" />
          <span>Self-Reported Intent vs Observed Execution</span>
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.86rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Your Stated Focus Goal
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              &ldquo;{profile.selfReportedGoals[0] || 'Improve conversational confidence'}&rdquo;
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Self-Reported Challenges
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {profile.selfReportedChallenges.length > 0
                ? profile.selfReportedChallenges.join(' • ')
                : 'Broad communication polish'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={onRetakeAssessment}
          >
            <Repeat size={13} />
            <span>Retake Baseline Scenarios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
