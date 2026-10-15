import {
  OnboardingAnswers,
  AssessmentSubmission,
  UserCommunicationProfile,
  ProfileStrength,
  ProfileGrowthArea,
  PracticeAttempt
} from '@/types';
import { ASSESSMENT_SCENARIOS, PRACTICE_SCENARIOS } from '@/data/scenarios';

export function generateCommunicationProfile(
  participantId: string,
  onboarding: OnboardingAnswers,
  assessments: AssessmentSubmission[]
): UserCommunicationProfile {
  const observedStrengths: ProfileStrength[] = [];
  const areasToPractise: ProfileGrowthArea[] = [];

  // Extract self-reported goals & challenges
  const selfReportedGoals = onboarding.mainImprovementGoal ? [onboarding.mainImprovementGoal] : ['Enhance conversational clarity and confidence'];
  const selfReportedChallenges: string[] = [];

  if (onboarding.clarityConcisenessDifficulty === 'often' || onboarding.clarityConcisenessDifficulty === 'frequently') {
    selfReportedChallenges.push('Conciseness & overexplaining');
  }
  if (onboarding.contextCuesDifficulty === 'often' || onboarding.contextCuesDifficulty === 'frequently') {
    selfReportedChallenges.push('Interpreting ambiguous cues & subtext');
  }
  if (onboarding.boundarySettingDifficulty === 'often' || onboarding.boundarySettingDifficulty === 'frequently') {
    selfReportedChallenges.push('Setting boundaries without guilt');
  }
  if (onboarding.initiatingSpeakingDifficulty === 'often' || onboarding.initiatingSpeakingDifficulty === 'frequently') {
    selfReportedChallenges.push('Initiating and speaking up in groups');
  }
  if (selfReportedChallenges.length === 0 && onboarding.difficultSituations.length > 0) {
    selfReportedChallenges.push(...onboarding.difficultSituations.slice(0, 2));
  }

  // 1. Analyze Assessment 1: Ambiguous Message (Jordan)
  const assess1 = assessments.find((a) => a.scenarioId === 'assess-1-ambiguous-slack');
  if (assess1) {
    const text = assess1.writtenResponse.trim();
    const isCatastrophic = assess1.selectedInterpretationId === 'opt-catastrophize';
    const isObjective = assess1.selectedInterpretationId === 'opt-objective';
    const isLongDefensive = text.length > 180 || /sorry|apologize|my fault|mistake|redo/i.test(text);

    if (isObjective && !isCatastrophic) {
      observedStrengths.push({
        name: 'Objective Context Calibration',
        description: 'You resisted jumping to alarming conclusions when receiving vague feedback.',
        evidence: `Selected measured interpretation and replied: "${truncateText(text, 65)}"`
      });
    } else {
      areasToPractise.push({
        name: 'Navigating Ambiguous Communication',
        description: 'Tendency to assume critical judgment before clarifying what the sender actually means.',
        evidence: `Interpretation selected was apprehensive, with initial reply: "${truncateText(text, 65)}"`,
        priority: 'high'
      });
    }

    if (!isLongDefensive && text.length > 20) {
      observedStrengths.push({
        name: 'Composed Written Demeanor',
        description: 'Kept the initial response measured without preemptive over-apologizing.',
        evidence: `Clean reply: "${truncateText(text, 60)}"`
      });
    }
  }

  // 2. Analyze Assessment 2: Fast-Moving Group (Alex)
  const assess2 = assessments.find((a) => a.scenarioId === 'assess-2-fast-group-chat');
  if (assess2) {
    const text = assess2.writtenResponse.trim();
    const isBalanced = assess2.selectedInterpretationId === 'opt-group-validate-pivot';
    const isConcise = text.split(/\s+/).length <= 45;

    if (isBalanced) {
      observedStrengths.push({
        name: 'Diplomatic Group Alignment',
        description: 'Understood how to validate team enthusiasm while grounding focus in constraints.',
        evidence: `Balanced response to Alex's pitch: "${truncateText(text, 65)}"`
      });
    } else {
      areasToPractise.push({
        name: 'Constructive Disagreement in Groups',
        description: 'Balancing interpersonal warmth with firm alignment on project scope under time pressure.',
        evidence: `Observed group message approach: "${truncateText(text, 65)}"`,
        priority: 'medium'
      });
    }

    if (isConcise && text.length > 25) {
      observedStrengths.push({
        name: 'Concise Group Messaging',
        description: 'Delivered your point without creating message fatigue in a fast-paced chat.',
        evidence: `Contained in ${text.split(/\s+/).length} words.`
      });
    } else if (text.split(/\s+/).length > 55) {
      areasToPractise.push({
        name: 'Avoiding Message Overload in Group Chats',
        description: 'In quick group channels, very long blocks can cause teammates to skim or lose the core point.',
        evidence: `Wrote ${text.split(/\s+/).length} words in a rapid group brainstorm.`,
        priority: 'medium'
      });
    }
  }

  // 3. Analyze Assessment 3: Late Boundary (Samira)
  const assess3 = assessments.find((a) => a.scenarioId === 'assess-3-late-boundary');
  if (assess3) {
    const text = assess3.writtenResponse.trim();
    const isGuiltAgree = assess3.selectedInterpretationId === 'opt-boundary-guilt-agree';
    const isFirmKind = assess3.selectedInterpretationId === 'opt-boundary-firm-kind';
    const apologyCount = (text.match(/sorry|apologies|forgive|excuse/gi) || []).length;

    if (isFirmKind && apologyCount <= 1) {
      observedStrengths.push({
        name: 'Clear, Respectful Boundary Setting',
        description: 'Communicated availability boundaries clearly without excess self-diminishment.',
        evidence: `Direct reply with healthy self-advocacy: "${truncateText(text, 65)}"`
      });
    } else {
      areasToPractise.push({
        name: 'Asserting Boundaries Without Over-Apologizing',
        description: 'Difficulty stating a firm "no" without taking on unwarranted responsibility or extensive justification.',
        evidence: `Observed response (${apologyCount > 1 ? `${apologyCount} apologies` : 'conciliatory tone'}): "${truncateText(text, 65)}"`,
        priority: isGuiltAgree ? 'high' : 'medium'
      });
    }
  }

  // Ensure at least 1 strength and 1 growth area exist
  if (observedStrengths.length === 0) {
    observedStrengths.push({
      name: 'Willingness to Engage & Reflect',
      description: 'You completed realistic communication simulations and articulated your reasoning thoughtfully.',
      evidence: 'Active participation in all baseline scenarios.'
    });
  }

  if (areasToPractise.length === 0) {
    areasToPractise.push({
      name: 'Refining Direct & Concise Synthesis',
      description: 'Continuing to hone brevity, clarity, and impactful delivery under high-pressure scenarios.',
      evidence: 'Baseline established with strong foundational instincts.',
      priority: 'medium'
    });
  }

  // Determine first recommended practice exercise based on highest priority area or self-reported goal
  let recommendedScenarioId = 'practice-clarify-brief';
  let recommendedFirstTopic = 'Clarifying Ambiguous Expectations';

  const highPriority = areasToPractise.find((a) => a.priority === 'high');
  if (highPriority) {
    if (highPriority.name.includes('Ambiguous')) {
      recommendedScenarioId = 'practice-clarify-brief';
      recommendedFirstTopic = 'Clarifying Ambiguous Expectations';
    } else if (highPriority.name.includes('Boundar')) {
      recommendedScenarioId = 'practice-firm-boundary';
      recommendedFirstTopic = 'Setting Clear, Firm Boundaries';
    } else if (highPriority.name.includes('Overload') || highPriority.name.includes('Concise')) {
      recommendedScenarioId = 'practice-concise-overexplain';
      recommendedFirstTopic = 'Direct & Concise Updates (Avoiding Overexplaining)';
    } else {
      recommendedScenarioId = 'practice-stepping-into-group';
      recommendedFirstTopic = 'Speaking Up & Intervening in Group Discussions';
    }
  } else if (onboarding.mainImprovementGoal) {
    if (onboarding.mainImprovementGoal.toLowerCase().includes('concise')) {
      recommendedScenarioId = 'practice-concise-overexplain';
      recommendedFirstTopic = 'Direct & Concise Updates';
    } else if (onboarding.mainImprovementGoal.toLowerCase().includes('boundar')) {
      recommendedScenarioId = 'practice-firm-boundary';
      recommendedFirstTopic = 'Setting Clear, Firm Boundaries';
    }
  }

  const now = new Date().toISOString();

  return {
    participantId,
    generatedAt: now,
    lastUpdatedAt: now,
    selfReportedGoals,
    selfReportedChallenges,
    observedStrengths,
    areasToPractise,
    confidenceCalibration: {
      level: 'Initial (2-3 observations)',
      note: 'This profile is an early working estimate based on 3 simulated interactions and self-reflections. It avoids rigid personality labeling and will adapt as you complete more scenarios.'
    },
    recommendedFirstTopic,
    recommendedScenarioId,
    totalCompletedPractices: 0
  };
}

export function updateProfileWithPracticeAttempt(
  currentProfile: UserCommunicationProfile,
  attempt: PracticeAttempt
): UserCommunicationProfile {
  const updated = { ...currentProfile };
  updated.totalCompletedPractices = (updated.totalCompletedPractices || 0) + 1;
  updated.lastUpdatedAt = new Date().toISOString();

  if (updated.totalCompletedPractices >= 5) {
    updated.confidenceCalibration = {
      level: 'Established',
      note: `Synthesized across ${updated.totalCompletedPractices} completed practice exercises. Demonstrates consistent behavioral trends.`
    };
  } else if (updated.totalCompletedPractices >= 2) {
    updated.confidenceCalibration = {
      level: 'Moderate (4-6 practices)',
      note: `Updated with ${updated.totalCompletedPractices} additional practice trials. Profile accuracy increases with varied challenges.`
    };
  }

  // If the user performed well on this attempt, add a strength evidence note
  if (attempt.feedback.clarityAndConciseness.score >= 4) {
    const existing = updated.observedStrengths.find((s) => s.name.includes('Clarity') || s.name.includes('Concise'));
    if (!existing) {
      updated.observedStrengths.push({
        name: 'Demonstrated Clarity Under Practice',
        description: 'Successfully drafted concise, well-structured communication in targeted drills.',
        evidence: `Demonstrated in "${attempt.scenarioTitle}" with high rating.`
      });
    }
  }

  // Next recommended scenario rotation
  const nextScenario = PRACTICE_SCENARIOS.find((s) => s.id !== attempt.scenarioId) || PRACTICE_SCENARIOS[0];
  updated.recommendedScenarioId = nextScenario.id;
  updated.recommendedFirstTopic = nextScenario.categoryLabel;

  return updated;
}

function truncateText(str: string, maxLen: number): string {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}
