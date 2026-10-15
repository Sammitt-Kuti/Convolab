export type DifficultyLevel = 'rarely' | 'sometimes' | 'often' | 'frequently';

export interface OnboardingAnswers {
  difficultSituations: string[];
  contextCuesDifficulty: DifficultyLevel | '';
  respondingRelevantlyDifficulty: DifficultyLevel | '';
  clarityConcisenessDifficulty: DifficultyLevel | '';
  initiatingSpeakingDifficulty: DifficultyLevel | '';
  boundarySettingDifficulty: DifficultyLevel | '';
  frequencyOfDifficulties: DifficultyLevel | '';
  mainImprovementGoal: string;
}

export interface AssessmentScenario {
  id: string;
  title: string;
  category: 'ambiguous_message' | 'group_discussion' | 'boundary_setting';
  context: string;
  speaker: string;
  speakerRole: string;
  dialogueSnippet: string;
  interpretationQuestion: string;
  interpretationOptions: {
    id: string;
    text: string;
    diagnosticNote: string;
  }[];
  responsePrompt: string;
  expectedSkills: string[];
}

export interface AssessmentSubmission {
  scenarioId: string;
  selectedInterpretationId: string;
  interpretationExplanation?: string;
  writtenResponse: string;
  confidenceRating: number; // 1 to 5
}

export interface ProfileStrength {
  name: string;
  description: string;
  evidence: string;
}

export interface ProfileGrowthArea {
  name: string;
  description: string;
  evidence: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UserCommunicationProfile {
  participantId: string;
  generatedAt: string;
  lastUpdatedAt: string;
  selfReportedGoals: string[];
  selfReportedChallenges: string[];
  observedStrengths: ProfileStrength[];
  areasToPractise: ProfileGrowthArea[];
  confidenceCalibration: {
    level: 'Initial (2-3 observations)' | 'Moderate (4-6 practices)' | 'Established';
    note: string;
  };
  recommendedFirstTopic: string;
  recommendedScenarioId: string;
  totalCompletedPractices: number;
}

export interface PracticeScenario {
  id: string;
  title: string;
  category: 'clarifying_ambiguity' | 'group_dynamics' | 'firm_boundaries' | 'concise_delivery' | 'constructive_disagreement';
  categoryLabel: string;
  difficultyTag: 'Beginner' | 'Intermediate' | 'Nuanced';
  context: string;
  situationRole: string;
  messageSnippet: string;
  contextCheckQuestion: string;
  contextCheckOptions: string[];
  responsePrompt: string;
  guidanceTip: string;
}

export interface DimensionScore {
  score: number; // 1-5 or 1-10
  rating: 'Emerging' | 'Developing' | 'Effective' | 'Masterful';
  feedback: string;
}

export interface EvaluationFeedback {
  isDemoMode: boolean;
  modelUsed: string;
  summaryFeedback: string;
  contextUnderstanding: DimensionScore;
  relevance: DimensionScore;
  clarityAndConciseness: DimensionScore;
  toneAndEmpathy: DimensionScore;
  boundarySetting?: DimensionScore;
  keyStrengths: string[];
  actionableImprovement: string;
  alternativeExampleResponse: string;
  ambiguityNotice: string;
}

export interface PracticeAttempt {
  attemptId: string;
  scenarioId: string;
  scenarioTitle: string;
  contextAnswer: string;
  userResponse: string;
  feedback: EvaluationFeedback;
  retried: boolean;
  timestamp: string;
}

export interface ResearchConsent {
  consented: boolean;
  participantId: string;
  agreedAt: string;
}

export interface ResearchSessionRecord {
  participantId: string;
  consented: boolean;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted: boolean;
  onboarding?: OnboardingAnswers;
  assessmentCompleted: boolean;
  assessments: AssessmentSubmission[];
  profile?: UserCommunicationProfile;
  practiceAttempts: PracticeAttempt[];
  retryCount: number;
}
