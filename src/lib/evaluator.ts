import { PracticeScenario, EvaluationFeedback, DimensionScore } from '@/types';

export async function evaluatePracticeResponse(
  scenario: PracticeScenario,
  userResponse: string,
  contextChoice: string
): Promise<EvaluationFeedback> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

  if (apiKey) {
    try {
      return await callGeminiAI(apiKey, modelName, scenario, userResponse, contextChoice);
    } catch (err) {
      console.error('Gemini API evaluation failed, falling back to Demo Engine:', err);
      const fallback = runHeuristicEvaluation(scenario, userResponse, contextChoice);
      fallback.ambiguityNotice += ' (Note: Live AI request encountered an issue; evaluated with ConvoLab local demo engine).';
      return fallback;
    }
  }

  // Pure, transparent Demo Mode
  return runHeuristicEvaluation(scenario, userResponse, contextChoice);
}

async function callGeminiAI(
  apiKey: string,
  modelName: string,
  scenario: PracticeScenario,
  userResponse: string,
  contextChoice: string
): Promise<EvaluationFeedback> {
  const prompt = `
You are the expert communication evaluator for ConvoLab, a research-backed communication coaching platform.
You are evaluating a user's practice response to a realistic scenario.

CRITICAL GUIDELINES:
1. Be constructive, nuanced, and non-judgmental. Do NOT act like an English grammar checker or a clinical psychologist.
2. NEVER claim certainty about another person's hidden intentions or mental state when the situation is ambiguous.
3. Focus on practical interpersonal dynamics: context comprehension, relevance, clarity, brevity (avoiding overexplaining), tone, and healthy boundaries.
4. Provide ONE single, high-leverage actionable improvement.
5. Provide ONE realistic, natural-sounding alternative response that a thoughtful person would actually say.

SCENARIO DETAILS:
- Title: ${scenario.title}
- Context: ${scenario.context}
- Incoming Message/Prompt: "${scenario.messageSnippet}"
- User's context choice/interpretation: "${contextChoice}"
- User's actual written response: "${userResponse}"

Return a VALID JSON object with EXACTLY this structure (no markdown fences, just pure JSON):
{
  "summaryFeedback": "2-3 sentences summarizing how the response landed interpersonally.",
  "contextUnderstanding": {
    "score": 4,
    "rating": "Effective",
    "feedback": "Specific feedback on how accurately the user grasped the social stakes."
  },
  "relevance": {
    "score": 4,
    "rating": "Effective",
    "feedback": "Feedback on whether the answer directly addressed the core issue without derailment."
  },
  "clarityAndConciseness": {
    "score": 3,
    "rating": "Developing",
    "feedback": "Feedback on brevity, structure, and avoiding overexplaining or filler."
  },
  "toneAndEmpathy": {
    "score": 4,
    "rating": "Effective",
    "feedback": "Feedback on interpersonal warmth, respectfulness, and emotional calibration."
  },
  "boundarySetting": {
    "score": 4,
    "rating": "Effective",
    "feedback": "Feedback on asserting boundaries without guilt or aggression (or N/A if not applicable)."
  },
  "keyStrengths": [
    "Specific strength observed in their wording",
    "Another positive aspect of their approach"
  ],
  "actionableImprovement": "The single most impactful change they can make on their next attempt.",
  "alternativeExampleResponse": "A polished, conversational alternative sentence or two they can learn from.",
  "ambiguityNotice": "A reminder regarding how to navigate uncertain motives respectfully."
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API returned ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(rawText);

  return {
    isDemoMode: false,
    modelUsed: modelName,
    summaryFeedback: parsed.summaryFeedback || 'Your response was evaluated by the live AI model.',
    contextUnderstanding: parseDimension(parsed.contextUnderstanding, 'Context Understanding'),
    relevance: parseDimension(parsed.relevance, 'Relevance'),
    clarityAndConciseness: parseDimension(parsed.clarityAndConciseness, 'Clarity & Conciseness'),
    toneAndEmpathy: parseDimension(parsed.toneAndEmpathy, 'Tone & Empathy'),
    boundarySetting: scenario.category === 'firm_boundaries' ? parseDimension(parsed.boundarySetting, 'Boundary Setting') : undefined,
    keyStrengths: Array.isArray(parsed.keyStrengths) && parsed.keyStrengths.length > 0 ? parsed.keyStrengths : ['Direct engagement with the scenario'],
    actionableImprovement: parsed.actionableImprovement || 'Focus on stating your main request or boundary in the opening sentence.',
    alternativeExampleResponse: parsed.alternativeExampleResponse || 'Thanks for checking in. I can deliver this by 4:00 PM today.',
    ambiguityNotice: parsed.ambiguityNotice || 'Remember that in ambiguous situations, clarifying directly is more reliable than assuming intent.'
  };
}

function parseDimension(dim: any, fallbackName: string): DimensionScore {
  if (!dim || typeof dim !== 'object') {
    return {
      score: 3,
      rating: 'Developing',
      feedback: `${fallbackName} showed foundational effort.`
    };
  }
  const score = typeof dim.score === 'number' ? Math.max(1, Math.min(5, dim.score)) : 3;
  let rating: DimensionScore['rating'] = 'Developing';
  if (score >= 5) rating = 'Masterful';
  else if (score >= 4) rating = 'Effective';
  else if (score >= 3) rating = 'Developing';
  else rating = 'Emerging';

  return {
    score,
    rating,
    feedback: dim.feedback || `${fallbackName} is developing well.`
  };
}

export function runHeuristicEvaluation(
  scenario: PracticeScenario,
  userResponse: string,
  contextChoice: string
): EvaluationFeedback {
  const text = (userResponse || '').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;

  const hasApology = /sorry|apologize|pardon|excuse me|my bad/i.test(text);
  const apologyCount = (text.match(/sorry|apologize|pardon/gi) || []).length;
  const hasGratitude = /thanks|thank you|appreciate|great to hear/i.test(text);
  const hasDirectSolution = /can do|will deliver|by \d|at \d|let’s|how about|instead|scheduled/i.test(text);
  const hasDefensiveMarkers = /it was because|fault|glitch|crashed|couldn't help|so tired|so busy/i.test(text);

  let clarityScore = 3;
  let clarityFeedback = 'Your message was understandable, though sentence structure can be tightened.';
  if (wordCount >= 8 && wordCount <= 35) {
    clarityScore = 5;
    clarityFeedback = `Excellent brevity (${wordCount} words). You communicated your point without unnecessary padding or cognitive load on the reader.`;
  } else if (wordCount > 35 && wordCount <= 60) {
    clarityScore = 4;
    clarityFeedback = `Good clarity (${wordCount} words), though the opening could state the key deliverable slightly faster.`;
  } else if (wordCount > 60) {
    clarityScore = 2;
    clarityFeedback = `At ${wordCount} words, this response is leaning towards overexplaining. In quick workplace interactions, lengthy explanations can distract from the actionable conclusion.`;
  } else {
    clarityScore = 2;
    clarityFeedback = 'The response was very brief and may leave the recipient wanting more clarity.';
  }

  let toneScore = 4;
  let toneFeedback = 'Courteous and professional tone.';
  if (hasApology && apologyCount > 1) {
    toneScore = 3;
    toneFeedback = `You apologized multiple times (${apologyCount} times). While polite, repeated apologies can project unnecessary guilt or undermine your credibility.`;
  } else if (hasGratitude || hasDirectSolution) {
    toneScore = 5;
    toneFeedback = 'Warm, solution-oriented, and poised.';
  }

  let relevanceScore = text.length > 15 ? 4 : 2;
  let relevanceFeedback = 'Directly addresses the situation prompted by the speaker.';

  let contextScore = 4;
  let contextFeedback = 'Acknowledged the core situational dynamics accurately.';
  if (contextChoice.toLowerCase().includes('guessing') || contextChoice.toLowerCase().includes('drop what you are doing')) {
    contextScore = 2;
    contextFeedback = 'The selected context choice leaned towards people-pleasing or avoiding clarification.';
  }

  let boundaryScore: DimensionScore | undefined = undefined;
  if (scenario.category === 'firm_boundaries') {
    const isFirm = text.length > 10 && !/yes of course|i will do it|no problem/i.test(text);
    boundaryScore = {
      score: isFirm ? (apologyCount > 1 ? 3 : 5) : 2,
      rating: isFirm ? (apologyCount > 1 ? 'Developing' : 'Masterful') : 'Emerging',
      feedback: isFirm
        ? 'Successfully protected your focus time while offering a polite transition.'
        : 'Struggled to hold an explicit boundary without caving into the request.'
    };
  }

  const keyStrengths: string[] = [];
  if (hasGratitude || toneScore >= 4) keyStrengths.push('Interpersonal warmth and respectful register');
  if (clarityScore >= 4) keyStrengths.push('Brevity that respects the recipient’s reading time');
  if (hasDirectSolution) keyStrengths.push('Proactive offer of a concrete next step or alternative timeline');
  if (keyStrengths.length === 0) keyStrengths.push('Prompt, direct engagement with the question');

  let actionableImprovement = 'Lead with the headline: put the main conclusion or timeline in the very first sentence before any backstory.';
  let alternativeExample = '';

  switch (scenario.id) {
    case 'practice-clarify-brief':
      actionableImprovement = 'Offer 2 specific options in your question so your manager can answer with a single word.';
      alternativeExample = '“Happy to pull that. Did you need the Project Alpha Q3 spreadsheet, or the new Beta pilot figures? I can have it ready within 20 minutes.”';
      break;
    case 'practice-concise-overexplain':
      actionableImprovement = 'Omit the technical glitch backstory completely and provide the revised delivery time upfront.';
      alternativeExample = '“It’s undergoing final polishing now — I’ll share the completed draft with you by 2:30 PM today.”';
      break;
    case 'practice-firm-boundary':
      actionableImprovement = 'Decline the immediate interruption without guilt, while pointing to an upcoming available window.';
      alternativeExample = '“In the middle of a focused deadline right now, but I would love to help! Can we catch up at 3:30 PM today?”';
      break;
    case 'practice-stepping-into-group':
      actionableImprovement = 'Bridge the existing topic to the neglected priority rather than abruptly cutting people off.';
      alternativeExample = '“Both styling points are really helpful. Before we run out of time today, could we spend 10 minutes locking in the data model so the backend team isn’t blocked?”';
      break;
    default:
      actionableImprovement = 'Keep your response focused on one clear action item and maintain an empathetic, collaborative tone.';
      alternativeExample = '“Thanks for bringing this up. I see where you’re coming from, and I’d propose we test this on a smaller sample first.”';
  }

  return {
    isDemoMode: true,
    modelUsed: 'Demo Mode (Heuristic Rule-Engine)',
    summaryFeedback: `[Demo Mode] Your response demonstrated ${clarityScore >= 4 ? 'strong brevity and structure' : 'a good foundation with room for tighter framing'}. Note how phrasing choices influence how your message is received.`,
    contextUnderstanding: {
      score: contextScore,
      rating: contextScore >= 4 ? 'Effective' : 'Developing',
      feedback: contextFeedback
    },
    relevance: {
      score: relevanceScore,
      rating: relevanceScore >= 4 ? 'Effective' : 'Developing',
      feedback: relevanceFeedback
    },
    clarityAndConciseness: {
      score: clarityScore,
      rating: clarityScore >= 4 ? 'Effective' : 'Developing',
      feedback: clarityFeedback
    },
    toneAndEmpathy: {
      score: toneScore,
      rating: toneScore >= 4 ? 'Masterful' : 'Developing',
      feedback: toneFeedback
    },
    boundarySetting: boundaryScore,
    keyStrengths,
    actionableImprovement,
    alternativeExampleResponse: alternativeExample,
    ambiguityNotice: 'In interpersonal ambiguity, verify meaning with calm inquiry rather than trying to guess unstated feelings.'
  };
}
