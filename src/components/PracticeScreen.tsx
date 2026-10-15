'use client';

import React, { useState } from 'react';
import { PracticeScenario, EvaluationFeedback, PracticeAttempt } from '@/types';
import { PRACTICE_SCENARIOS } from '@/data/scenarios';
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  MessageCircle,
  ShieldAlert,
  HelpCircle,
  Send,
  Sliders,
  Compass
} from 'lucide-react';

interface PracticeScreenProps {
  initialScenarioId?: string;
  onAttemptCompleted: (attempt: PracticeAttempt) => void;
  onViewProfile: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  initialScenarioId,
  onAttemptCompleted,
  onViewProfile
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    initialScenarioId || PRACTICE_SCENARIOS[0].id
  );
  const scenario =
    PRACTICE_SCENARIOS.find((s) => s.id === activeScenarioId) || PRACTICE_SCENARIOS[0];

  const [contextChoice, setContextChoice] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<EvaluationFeedback | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setContextChoice('');
    setUserResponse('');
    setEvaluationFeedback(null);
    setErrorMsg('');
    setIsRetrying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contextChoice) {
      setErrorMsg('Please select how you interpret the context first.');
      return;
    }

    if (!userResponse.trim() || userResponse.trim().length < 5) {
      setErrorMsg('Please enter your written response.');
      return;
    }

    setErrorMsg('');
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          userResponse: userResponse.trim(),
          contextChoice
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Evaluation request failed');
      }

      const data = await res.json();
      const feedback: EvaluationFeedback = data.feedback;

      setEvaluationFeedback(feedback);

      // Record telemetry
      const attempt: PracticeAttempt = {
        attemptId: `att_${Date.now()}`,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        contextAnswer: contextChoice,
        userResponse: userResponse.trim(),
        feedback,
        retried: isRetrying,
        timestamp: new Date().toISOString()
      };

      onAttemptCompleted(attempt);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with evaluation server');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setEvaluationFeedback(null);
  };

  const handleNextChallenge = () => {
    const currentIndex = PRACTICE_SCENARIOS.findIndex((s) => s.id === activeScenarioId);
    const nextIndex = (currentIndex + 1) % PRACTICE_SCENARIOS.length;
    handleSelectScenario(PRACTICE_SCENARIOS[nextIndex].id);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {PRACTICE_SCENARIOS.map((s) => {
          const isCurrent = s.id === activeScenarioId;
          return (
            <button
              key={s.id}
              type="button"
              className={`btn ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                flexShrink: 0
              }}
              onClick={() => handleSelectScenario(s.id)}
            >
              <span>{s.categoryLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Practice Card */}
      <div className="card">
        {/* Scenario Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                {scenario.categoryLabel}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)'
                }}
              >
                {scenario.difficultyTag}
              </span>
            </div>
            <h2 className="title-section" style={{ fontSize: '1.6rem' }}>
              {scenario.title}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={onViewProfile}
          >
            <Compass size={14} />
            <span>View Profile</span>
          </button>
        </div>

        {/* Situation Context */}
        <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
          {scenario.context}
        </p>

        {/* Dialogue Bubble */}
        <div className="dialogue-box">
          <div className="dialogue-speaker">
            <MessageSquare size={13} />
            <span>{scenario.situationRole}</span>
          </div>
          <div className="dialogue-text">
            &ldquo;{scenario.messageSnippet}&rdquo;
          </div>
        </div>

        {/* Strategy Coaching Tip */}
        <div style={{ background: 'rgba(99, 102, 241, 0.07)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <Lightbulb size={17} color="#a5b4fc" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.84rem', color: '#c7d2fe' }}>
            <strong>Guidance Hint:</strong> {scenario.guidanceTip}
          </div>
        </div>

        {!evaluationFeedback ? (
          /* Response Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            {/* Part 1: Context Awareness */}
            <div>
              <label className="input-label">
                Step 1: {scenario.contextCheckQuestion}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {scenario.contextCheckOptions.map((opt, i) => {
                  const isSelected = contextChoice === opt;
                  return (
                    <div
                      key={i}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setContextChoice(opt);
                        setErrorMsg('');
                      }}
                    >
                      <div className="radio-indicator" />
                      <span style={{ fontSize: '0.9rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part 2: Interactive Response Writing Box */}
            <div>
              <label className="input-label" htmlFor="practice-response">
                Step 2: {scenario.responsePrompt}
              </label>
              <textarea
                id="practice-response"
                value={userResponse}
                onChange={(e) => {
                  setUserResponse(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Type your response here..."
                className="textarea-field"
                rows={4}
              />
              <div className="char-counter">
                <span>{userResponse.length} characters • {userResponse.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.85rem' }}
                disabled={isEvaluating}
              >
                {isEvaluating ? (
                  <>
                    <div className="spinner" />
                    <span>Evaluating Communication Nuances...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{isRetrying ? 'Submit Retry for Evaluation' : 'Evaluate Response'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Live Feedback Presentation */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {/* Mode Banner: Transparently declare Demo Mode vs Live AI */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: evaluationFeedback.isDemoMode
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${
                  evaluationFeedback.isDemoMode
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(16, 185, 129, 0.3)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: evaluationFeedback.isDemoMode
                      ? 'var(--accent-amber)'
                      : 'var(--accent-emerald)'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: evaluationFeedback.isDemoMode ? '#fbbf24' : '#34d399'
                  }}
                >
                  {evaluationFeedback.isDemoMode
                    ? 'Demo Mode Evaluation (Rule-Engine Active)'
                    : `Live AI Analysis (${evaluationFeedback.modelUsed})`}
                </span>
              </div>

              {evaluationFeedback.isDemoMode && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  To activate Gemini AI, add <code>GEMINI_API_KEY</code> to <code>.env.local</code>
                </span>
              )}
            </div>

            {/* Summary Evaluation */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Communication Analysis
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {evaluationFeedback.summaryFeedback}
              </p>
            </div>

            {/* Dimension Breakdown Cards */}
            <div className="feedback-grid">
              {/* Context Understanding */}
              <div className="dimension-card">
                <div className="dimension-header">
                  <span className="dimension-title">Context Understanding</span>
                  <span className={`score-badge ${evaluationFeedback.contextUnderstanding.rating}`}>
                    {evaluationFeedback.contextUnderstanding.rating}
                  </span>
                </div>
                <p className="dimension-desc">{evaluationFeedback.contextUnderstanding.feedback}</p>
              </div>

              {/* Relevance */}
              <div className="dimension-card">
                <div className="dimension-header">
                  <span className="dimension-title">Relevance</span>
                  <span className={`score-badge ${evaluationFeedback.relevance.rating}`}>
                    {evaluationFeedback.relevance.rating}
                  </span>
                </div>
                <p className="dimension-desc">{evaluationFeedback.relevance.feedback}</p>
              </div>

              {/* Clarity & Conciseness */}
              <div className="dimension-card">
                <div className="dimension-header">
                  <span className="dimension-title">Clarity & Conciseness</span>
                  <span className={`score-badge ${evaluationFeedback.clarityAndConciseness.rating}`}>
                    {evaluationFeedback.clarityAndConciseness.rating}
                  </span>
                </div>
                <p className="dimension-desc">{evaluationFeedback.clarityAndConciseness.feedback}</p>
              </div>

              {/* Tone & Empathy */}
              <div className="dimension-card">
                <div className="dimension-header">
                  <span className="dimension-title">Tone & Empathy</span>
                  <span className={`score-badge ${evaluationFeedback.toneAndEmpathy.rating}`}>
                    {evaluationFeedback.toneAndEmpathy.rating}
                  </span>
                </div>
                <p className="dimension-desc">{evaluationFeedback.toneAndEmpathy.feedback}</p>
              </div>

              {/* Boundary Setting (if applicable) */}
              {evaluationFeedback.boundarySetting && (
                <div className="dimension-card">
                  <div className="dimension-header">
                    <span className="dimension-title">Boundary Assertion</span>
                    <span className={`score-badge ${evaluationFeedback.boundarySetting.rating}`}>
                      {evaluationFeedback.boundarySetting.rating}
                    </span>
                  </div>
                  <p className="dimension-desc">{evaluationFeedback.boundarySetting.feedback}</p>
                </div>
              )}
            </div>

            {/* High-Leverage Actionable Improvement */}
            <div className="actionable-box">
              <div className="actionable-title">
                <Lightbulb size={18} />
                <span>One Key Actionable Adjustment</span>
              </div>
              <p style={{ fontSize: '0.94rem', color: '#e0e7ff', lineHeight: '1.6', fontWeight: 500 }}>
                {evaluationFeedback.actionableImprovement}
              </p>
            </div>

            {/* Alternative Example Response */}
            <div className="alternative-response-box">
              <div className="alternative-title">
                <MessageCircle size={18} />
                <span>Alternative Realistic Phrasing</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#d1fae5', fontStyle: 'italic', lineHeight: '1.6' }}>
                {evaluationFeedback.alternativeExampleResponse}
              </p>
            </div>

            {/* Ambiguity Disclaimer Notice */}
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Notice on Ambiguity:</strong> {evaluationFeedback.ambiguityNotice}
            </div>

            {/* Interactive Actions: Retry or Next */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleRetry}
              >
                <RotateCcw size={16} />
                <span>Retry with Feedback</span>
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onViewProfile}
                >
                  <span>View Updated Profile</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextChallenge}
                >
                  <span>Try Next Scenario</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
