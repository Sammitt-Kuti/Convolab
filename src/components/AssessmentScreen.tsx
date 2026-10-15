'use client';

import React, { useState } from 'react';
import { AssessmentScenario, AssessmentSubmission } from '@/types';
import { ArrowRight, ArrowLeft, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface AssessmentScreenProps {
  scenarios: AssessmentScenario[];
  currentIndex: number;
  existingSubmissions: AssessmentSubmission[];
  onSaveSubmission: (submission: AssessmentSubmission, isFinal: boolean) => void;
  onPrevious: () => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  scenarios,
  currentIndex,
  existingSubmissions,
  onSaveSubmission,
  onPrevious
}) => {
  const scenario = scenarios[currentIndex];
  const existing = existingSubmissions.find((s) => s.scenarioId === scenario.id);

  const [selectedInterpretationId, setSelectedInterpretationId] = useState(existing?.selectedInterpretationId || '');
  const [writtenResponse, setWrittenResponse] = useState(existing?.writtenResponse || '');
  const [confidenceRating, setConfidenceRating] = useState<number>(existing?.confidenceRating || 3);
  const [validationError, setValidationError] = useState('');

  const isFinalScenario = currentIndex === scenarios.length - 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInterpretationId) {
      setValidationError('Please select how you interpret this situation first.');
      return;
    }

    if (!writtenResponse.trim() || writtenResponse.trim().length < 5) {
      setValidationError('Please write what you would say or text in this situation.');
      return;
    }

    setValidationError('');

    const submission: AssessmentSubmission = {
      scenarioId: scenario.id,
      selectedInterpretationId,
      writtenResponse: writtenResponse.trim(),
      confidenceRating
    };

    onSaveSubmission(submission, isFinalScenario);
  };

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '1rem auto' }}>
      {/* Step Indicator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Behavioral Assessment {currentIndex + 1} of {scenarios.length}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• Objective Evidence Gathering</span>
        </div>
      </div>

      <div className="stepper-track" style={{ marginBottom: '1.75rem' }}>
        <div className="stepper-fill" style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }} />
      </div>

      {/* Scenario Title & Context */}
      <h2 className="title-section">{scenario.title}</h2>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
        {scenario.context}
      </p>

      {/* Dialogue Simulation Box */}
      <div className="dialogue-box">
        <div className="dialogue-speaker">
          <MessageSquare size={13} />
          <span>{scenario.speaker} ({scenario.speakerRole})</span>
        </div>
        <div className="dialogue-text">
          &ldquo;{scenario.dialogueSnippet}&rdquo;
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Part 1: Interpretation */}
        <div>
          <label className="input-label" style={{ fontSize: '0.95rem' }}>
            Part 1: {scenario.interpretationQuestion}
          </label>
          <p className="input-helper">
            Choose the option closest to how you naturally perceive this situation:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scenario.interpretationOptions.map((opt) => {
              const isSelected = selectedInterpretationId === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedInterpretationId(opt.id);
                    setValidationError('');
                  }}
                >
                  <div className="radio-indicator" />
                  <span style={{ fontSize: '0.92rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Actual Written Response */}
        <div>
          <label className="input-label" style={{ fontSize: '0.95rem' }} htmlFor="written-response">
            Part 2: {scenario.responsePrompt}
          </label>
          <p className="input-helper">
            Write naturally as if you were typing this in Slack, group chat, or text right now:
          </p>

          <textarea
            id="written-response"
            value={writtenResponse}
            onChange={(e) => {
              setWrittenResponse(e.target.value);
              setValidationError('');
            }}
            placeholder="Type your response here..."
            className="textarea-field"
            rows={4}
          />
          <div className="char-counter">
            <span>{writtenResponse.length} characters • {writtenResponse.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {/* Part 3: Confidence Rating */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <label className="input-label" style={{ fontSize: '0.88rem', marginBottom: '0.25rem' }}>
            Part 3: How confident do you feel that your reply achieves what you want without unintended friction?
          </label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { val: 1, label: '1 - Highly hesitant / anxious' },
              { val: 2, label: '2 - Second-guessing' },
              { val: 3, label: '3 - Moderately sure' },
              { val: 4, label: '4 - Confident' },
              { val: 5, label: '5 - Completely assured' }
            ].map((rating) => {
              const isSelected = confidenceRating === rating.val;
              return (
                <button
                  key={rating.val}
                  type="button"
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => setConfidenceRating(rating.val)}
                >
                  {rating.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 500 }}>
            {validationError}
          </div>
        )}

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onPrevious}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.6rem' }}
          >
            <span>{isFinalScenario ? 'Generate Personalised Profile' : 'Next Scenario'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
