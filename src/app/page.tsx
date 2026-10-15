'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { AssessmentScreen } from '@/components/AssessmentScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { PracticeScreen } from '@/components/PracticeScreen';
import { PrivacyModal } from '@/components/PrivacyModal';
import { AdminModal } from '@/components/AdminModal';
import {
  OnboardingAnswers,
  AssessmentSubmission,
  UserCommunicationProfile,
  PracticeAttempt,
  ResearchSessionRecord
} from '@/types';
import { ASSESSMENT_SCENARIOS } from '@/data/scenarios';
import { generateCommunicationProfile, updateProfileWithPracticeAttempt } from '@/lib/profileEngine';

type ActiveStep = 'welcome' | 'onboarding' | 'assessment' | 'profile' | 'practice';

const DEFAULT_ONBOARDING: OnboardingAnswers = {
  difficultSituations: [],
  contextCuesDifficulty: '',
  respondingRelevantlyDifficulty: '',
  clarityConcisenessDifficulty: '',
  initiatingSpeakingDifficulty: '',
  boundarySettingDifficulty: '',
  frequencyOfDifficulties: '',
  mainImprovementGoal: ''
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [consented, setConsented] = useState(false);
  const [activeStep, setActiveStep] = useState<ActiveStep>('welcome');

  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>(DEFAULT_ONBOARDING);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessments, setAssessments] = useState<AssessmentSubmission[]>([]);
  const [profile, setProfile] = useState<UserCommunicationProfile | null>(null);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([]);
  const [targetPracticeScenarioId, setTargetPracticeScenarioId] = useState<string | undefined>(undefined);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<{
    aiConfigured: boolean;
    model: string;
    mode: 'live_ai' | 'demo';
  }>({
    aiConfigured: false,
    model: 'Demo Mode (Offline Heuristics)',
    mode: 'demo'
  });

  // Client Initialization
  useEffect(() => {
    setMounted(true);

    // Fetch AI Status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus(data);
      })
      .catch((err) => console.warn('Status check warning:', err));

    // Load or generate participant ID
    const storedId = localStorage.getItem('convolab_participant_id');
    const id = storedId || `cvl_${Math.random().toString(36).substring(2, 8)}`;
    if (!storedId) {
      localStorage.setItem('convolab_participant_id', id);
    }
    setParticipantId(id);

    // Load saved consent
    const storedConsent = localStorage.getItem('convolab_consented');
    if (storedConsent === 'true') {
      setConsented(true);
    }

    // Load saved state if any
    const savedStep = localStorage.getItem('convolab_step') as ActiveStep;
    if (savedStep) setActiveStep(savedStep);

    try {
      const savedOnboarding = localStorage.getItem('convolab_onboarding');
      if (savedOnboarding) setOnboardingAnswers(JSON.parse(savedOnboarding));

      const savedAssessments = localStorage.getItem('convolab_assessments');
      if (savedAssessments) setAssessments(JSON.parse(savedAssessments));

      const savedProfile = localStorage.getItem('convolab_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedPractices = localStorage.getItem('convolab_practices');
      if (savedPractices) setPracticeAttempts(JSON.parse(savedPractices));
    } catch (e) {
      console.warn('Error hydrating local storage:', e);
    }
  }, []);

  // Save session to backend research telemetry
  const syncResearchSession = (
    updatedProfile?: UserCommunicationProfile | null,
    updatedPractices?: PracticeAttempt[]
  ) => {
    if (!consented || !participantId) return;

    const currentPractices = updatedPractices || practiceAttempts;
    const retryCount = currentPractices.filter((p) => p.retried).length;

    const record: ResearchSessionRecord = {
      participantId,
      consented: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: Boolean(onboardingAnswers.mainImprovementGoal || onboardingAnswers.difficultSituations.length > 0),
      onboarding: onboardingAnswers,
      assessmentCompleted: assessments.length >= ASSESSMENT_SCENARIOS.length,
      assessments,
      profile: updatedProfile !== undefined ? (updatedProfile || undefined) : (profile || undefined),
      practiceAttempts: currentPractices,
      retryCount
    };

    fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch((err) => console.warn('Could not sync research event:', err));
  };

  const handleConsentChange = (newConsent: boolean) => {
    setConsented(newConsent);
    localStorage.setItem('convolab_consented', newConsent ? 'true' : 'false');
  };

  const handleStartOnboarding = () => {
    setActiveStep('onboarding');
    localStorage.setItem('convolab_step', 'onboarding');
  };

  const handleCompleteOnboarding = (answers: OnboardingAnswers) => {
    setOnboardingAnswers(answers);
    localStorage.setItem('convolab_onboarding', JSON.stringify(answers));
    setActiveStep('assessment');
    setAssessmentIndex(0);
    localStorage.setItem('convolab_step', 'assessment');
    syncResearchSession();
  };

  const handleSaveAssessmentSubmission = (submission: AssessmentSubmission, isFinal: boolean) => {
    const updated = assessments.filter((a) => a.scenarioId !== submission.scenarioId);
    updated.push(submission);
    setAssessments(updated);
    localStorage.setItem('convolab_assessments', JSON.stringify(updated));

    if (isFinal) {
      // Generate initial communication profile
      const generatedProfile = generateCommunicationProfile(participantId, onboardingAnswers, updated);
      setProfile(generatedProfile);
      localStorage.setItem('convolab_profile', JSON.stringify(generatedProfile));
      setActiveStep('profile');
      localStorage.setItem('convolab_step', 'profile');
      syncResearchSession(generatedProfile);
    } else {
      setAssessmentIndex((prev) => Math.min(prev + 1, ASSESSMENT_SCENARIOS.length - 1));
    }
  };

  const handleStartPractice = (scenarioId?: string) => {
    setTargetPracticeScenarioId(scenarioId);
    setActiveStep('practice');
    localStorage.setItem('convolab_step', 'practice');
  };

  const handlePracticeAttemptCompleted = (attempt: PracticeAttempt) => {
    const updatedPractices = [...practiceAttempts, attempt];
    setPracticeAttempts(updatedPractices);
    localStorage.setItem('convolab_practices', JSON.stringify(updatedPractices));

    // Update communication profile with this attempt
    if (profile) {
      const updatedProfile = updateProfileWithPracticeAttempt(profile, attempt);
      setProfile(updatedProfile);
      localStorage.setItem('convolab_profile', JSON.stringify(updatedProfile));
      syncResearchSession(updatedProfile, updatedPractices);
    } else {
      syncResearchSession(undefined, updatedPractices);
    }
  };

  const handleResetSession = () => {
    if (confirm('Start a fresh session? This resets your local assessment and profile.')) {
      const newId = `cvl_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.removeItem('convolab_step');
      localStorage.removeItem('convolab_onboarding');
      localStorage.removeItem('convolab_assessments');
      localStorage.removeItem('convolab_profile');
      localStorage.removeItem('convolab_practices');
      localStorage.setItem('convolab_participant_id', newId);

      setParticipantId(newId);
      setOnboardingAnswers(DEFAULT_ONBOARDING);
      setAssessments([]);
      setProfile(null);
      setPracticeAttempts([]);
      setAssessmentIndex(0);
      setActiveStep('welcome');
    }
  };

  const handleDataDeleted = () => {
    localStorage.clear();
    const newId = `cvl_${Math.random().toString(36).substring(2, 8)}`;
    setParticipantId(newId);
    setOnboardingAnswers(DEFAULT_ONBOARDING);
    setAssessments([]);
    setProfile(null);
    setPracticeAttempts([]);
    setActiveStep('welcome');
  };

  if (!mounted) {
    return null; // Prevents SSR hydration mismatch
  }

  return (
    <div>
      <Navbar
        participantId={participantId}
        aiStatus={aiStatus}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onResetSession={handleResetSession}
        onBrandClick={() => setActiveStep('welcome')}
      />

      <main className="app-container" style={{ paddingTop: '2rem' }}>
        {activeStep === 'welcome' && (
          <WelcomeScreen
            participantId={participantId}
            consented={consented}
            onConsentChange={handleConsentChange}
            onStart={handleStartOnboarding}
          />
        )}

        {activeStep === 'onboarding' && (
          <OnboardingScreen
            initialAnswers={onboardingAnswers}
            onComplete={handleCompleteOnboarding}
            onBack={() => setActiveStep('welcome')}
          />
        )}

        {activeStep === 'assessment' && (
          <AssessmentScreen
            scenarios={ASSESSMENT_SCENARIOS}
            currentIndex={assessmentIndex}
            existingSubmissions={assessments}
            onSaveSubmission={handleSaveAssessmentSubmission}
            onPrevious={() => {
              if (assessmentIndex > 0) {
                setAssessmentIndex(assessmentIndex - 1);
              } else {
                setActiveStep('onboarding');
              }
            }}
          />
        )}

        {activeStep === 'profile' && profile && (
          <ProfileScreen
            profile={profile}
            onStartPractice={handleStartPractice}
            onRetakeAssessment={() => {
              setAssessmentIndex(0);
              setActiveStep('assessment');
            }}
          />
        )}

        {activeStep === 'practice' && (
          <PracticeScreen
            initialScenarioId={targetPracticeScenarioId}
            onAttemptCompleted={handlePracticeAttemptCompleted}
            onViewProfile={() => {
              if (profile) setActiveStep('profile');
              else setActiveStep('welcome');
            }}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>ConvoLab</strong> — Personalised Communication Practice & Research Platform
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => setIsPrivacyOpen(true)}>
              Privacy Policy & Consent
            </button>
            <button type="button" onClick={() => setIsAdminOpen(true)}>
              Research Admin Dashboard
            </button>
            <button type="button" onClick={handleResetSession}>
              Reset Session
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        participantId={participantId}
        onDataDeleted={handleDataDeleted}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
