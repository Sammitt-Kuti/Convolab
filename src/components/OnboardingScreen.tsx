'use client';

import React, { useState } from 'react';
import { OnboardingAnswers, DifficultyLevel } from '@/types';
import { SITUATION_OPTIONS, ONBOARDING_GOAL_OPTIONS } from '@/data/scenarios';
import { ArrowRight, ArrowLeft, FastForward, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  initialAnswers: OnboardingAnswers;
  onComplete: (answers: OnboardingAnswers) => void;
  onBack: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  initialAnswers,
  onComplete,
  onBack
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers);

  const totalSteps = 4;

  const toggleSituation = (id: string) => {
    const list = answers.difficultSituations || [];
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    setAnswers({ ...answers, difficultSituations: updated });
  };

  const handleDifficultySelect = (
    field: keyof OnboardingAnswers,
    val: DifficultyLevel
  ) => {
    setAnswers({ ...answers, [field]: val });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleSkipAll = () => {
    onComplete(answers);
  };

  return (
    <div className="card" style={{ maxWidth: '820px', margin: '1rem auto' }}>
      {/* Friendly Non-judgmental Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <HeartHandshake size={20} color="var(--primary-500)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>
          <strong>No Judgment Promise:</strong> These questions help personalize your scenario difficulty. There are no &ldquo;wrong&rdquo; answers, and you can skip anything optional.
        </span>
      </div>

      {/* Progress header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Step {step} of {totalSteps}
        </span>
        <button
          type="button"
          onClick={handleSkipAll}
          className="btn btn-outline"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
        >
          <FastForward size={13} />
          <span>Skip to Baseline Assessment</span>
        </button>
      </div>

      <div className="stepper-track" style={{ marginBottom: '1.75rem' }}>
        <div className="stepper-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      {/* STEP 1: Situations */}
      {step === 1 && (
        <div>
          <h2 className="title-section">Which communication situations feel most challenging or draining?</h2>
          <p className="subtitle">Select all that apply to you. This tailors the kinds of scenarios you will encounter.</p>

          <div className="options-grid">
            {SITUATION_OPTIONS.map((item) => {
              const selected = answers.difficultSituations.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`option-card ${selected ? 'selected' : ''}`}
                  onClick={() => toggleSituation(item.id)}
                >
                  <div className="radio-indicator" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Specific Dimensions */}
      {step === 2 && (
        <div>
          <h2 className="title-section">How often do you encounter these specific communication friction points?</h2>
          <p className="subtitle">Rate your day-to-day experience across these key dimensions:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
            {/* Dimension 1: Context & Social Cues */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                Interpreting ambiguous subtext, tone, or social cues
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Wondering what someone &ldquo;really meant&rdquo; in a short text or email.
              </p>
              <RatingButtons
                value={answers.contextCuesDifficulty}
                onChange={(val) => handleDifficultySelect('contextCuesDifficulty', val)}
              />
            </div>

            {/* Dimension 2: Responding Relevantly */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                Responding relevantly to what others just said
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Feeling unsure how to connect your thoughts seamlessly to their topic.
              </p>
              <RatingButtons
                value={answers.respondingRelevantlyDifficulty}
                onChange={(val) => handleDifficultySelect('respondingRelevantlyDifficulty', val)}
              />
            </div>

            {/* Dimension 3: Clarity & Conciseness */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                Expressing thoughts clearly and concisely (avoiding overexplaining)
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Rambling, giving too much backstory, or losing the listener&apos;s attention.
              </p>
              <RatingButtons
                value={answers.clarityConcisenessDifficulty}
                onChange={(val) => handleDifficultySelect('clarityConcisenessDifficulty', val)}
              />
            </div>

            {/* Dimension 4: Initiating & Confidence */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                Initiating conversations and speaking up in groups
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Hesitating to jump into fast-paced calls or unmute to share an idea.
              </p>
              <RatingButtons
                value={answers.initiatingSpeakingDifficulty}
                onChange={(val) => handleDifficultySelect('initiatingSpeakingDifficulty', val)}
              />
            </div>

            {/* Dimension 5: Boundaries */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                Setting boundaries or saying &ldquo;no&rdquo; comfortably
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Over-apologizing or agreeing to unreasonable requests to avoid conflict.
              </p>
              <RatingButtons
                value={answers.boundarySettingDifficulty}
                onChange={(val) => handleDifficultySelect('boundarySettingDifficulty', val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Overall Frequency */}
      {step === 3 && (
        <div>
          <h2 className="title-section">Overall, how frequently do these communication challenges cause you stress?</h2>
          <p className="subtitle">This helps benchmark your self-reported baseline before the behavioral scenarios.</p>

          <div className="options-grid" style={{ marginTop: '1.5rem' }}>
            {[
              { id: 'rarely', label: 'Rarely', desc: 'Only in extreme high-stakes meetings or interviews.' },
              { id: 'sometimes', label: 'Sometimes', desc: 'A few times a month, mostly in group or ambiguous settings.' },
              { id: 'often', label: 'Often', desc: 'Multiple times a week in classes, group chats, or work.' },
              { id: 'frequently', label: 'Frequently', desc: 'Almost daily — I often second-guess messages and interactions.' }
            ].map((freq) => {
              const selected = answers.frequencyOfDifficulties === freq.id;
              return (
                <div
                  key={freq.id}
                  className={`option-card ${selected ? 'selected' : ''}`}
                  onClick={() => setAnswers({ ...answers, frequencyOfDifficulties: freq.id as DifficultyLevel })}
                >
                  <div className="radio-indicator" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{freq.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{freq.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Primary Goal */}
      {step === 4 && (
        <div>
          <h2 className="title-section">What is your main improvement goal right now?</h2>
          <p className="subtitle">Choose the focus area that would make the biggest difference in your daily life:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.5rem 0' }}>
            {ONBOARDING_GOAL_OPTIONS.map((goal) => {
              const selected = answers.mainImprovementGoal === goal;
              return (
                <div
                  key={goal}
                  className={`option-card ${selected ? 'selected' : ''}`}
                  onClick={() => setAnswers({ ...answers, mainImprovementGoal: goal })}
                >
                  <div className="radio-indicator" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{goal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => (step > 1 ? setStep(step - 1) : onBack())}
        >
          <ArrowLeft size={16} />
          <span>{step === 1 ? 'Back' : 'Previous'}</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
        >
          <span>{step === totalSteps ? 'Proceed to Behavioral Assessment' : 'Continue'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

interface RatingButtonsProps {
  value: DifficultyLevel | '';
  onChange: (val: DifficultyLevel) => void;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({ value, onChange }) => {
  const options: { id: DifficultyLevel; label: string }[] = [
    { id: 'rarely', label: 'Rarely' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'often', label: 'Often' },
    { id: 'frequently', label: 'Frequently' }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-sm)'
            }}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
