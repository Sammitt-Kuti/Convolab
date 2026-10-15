import { AssessmentScenario, PracticeScenario } from '@/types';

export const ASSESSMENT_SCENARIOS: AssessmentScenario[] = [
  {
    id: 'assess-1-ambiguous-slack',
    title: 'The Ambiguous Friday Message',
    category: 'ambiguous_message',
    context: 'You just submitted your group project slide deck or internship report an hour ago. Your project lead sends this short direct message.',
    speaker: 'Jordan (Project Lead)',
    speakerRole: 'Team Lead / Senior Colleague',
    dialogueSnippet: 'Hey, saw the slides. Can we jump on a call Monday morning? A few things didn’t quite land with me.',
    interpretationQuestion: 'What is Jordan most likely conveying, and how do you interpret this message?',
    interpretationOptions: [
      {
        id: 'opt-catastrophize',
        text: 'Jordan thinks my work is subpar, is unhappy with my performance, and wants to reprimand me on Monday.',
        diagnosticNote: 'Tends to assume worst-case hostile evaluation without concrete evidence.'
      },
      {
        id: 'opt-objective',
        text: 'Jordan has specific edits or differing perspectives on a few slides and wants to align in person rather than typing out long comments.',
        diagnosticNote: 'Balanced interpretation acknowledging ambiguity without premature alarm.'
      },
      {
        id: 'opt-dismissive',
        text: 'It is probably not important or just a casual catch-up, so I do not need to prepare anything.',
        diagnosticNote: 'May underestimate the need for thoughtful alignment.'
      }
    ],
    responsePrompt: 'Write how you would reply to Jordan right now before the weekend:',
    expectedSkills: ['Calm inquiry', 'Not overexplaining or preemptively defending', 'Professional acknowledgment']
  },
  {
    id: 'assess-2-fast-group-chat',
    title: 'The Fast-Moving Group Brainstorm',
    category: 'group_discussion',
    context: 'In your 5-person capstone group chat, two outspoken members are aggressively championing a complex 3D interactive dashboard feature that is due in 4 days. You notice that the basic requirements are still half-finished, and taking on this new idea will likely cause everyone to miss the deadline.',
    speaker: 'Alex (Group Peer)',
    speakerRole: 'Teammate in Project Group Chat',
    dialogueSnippet: 'Everyone, hear me out!! Let’s scrap the standard charts and rebuild the core UI with full Three.js 3D animations. It’ll blow the client away. I can start coding it tonight if everyone agrees!',
    interpretationQuestion: 'What is the underlying social dynamic here, and what is your priority in answering?',
    interpretationOptions: [
      {
        id: 'opt-group-silence',
        text: 'Wait and see if others object first so I don’t sound like the negative person who shoots down creative ideas.',
        diagnosticNote: 'Hesitancy in initiating assertive group intervention.'
      },
      {
        id: 'opt-group-validate-pivot',
        text: 'Acknowledge Alex’s enthusiasm while grounding the team in the non-negotiable core requirements and the 4-day timeline.',
        diagnosticNote: 'Effective balance of social validation with pragmatic goal alignment.'
      },
      {
        id: 'opt-group-blunt-refusal',
        text: 'Tell Alex that idea is totally reckless and nobody has time for unnecessary features right now.',
        diagnosticNote: 'High risk of defensive escalation in group settings.'
      }
    ],
    responsePrompt: 'Post your direct message to the group chat:',
    expectedSkills: ['Conciseness', 'Constructive disagreement', 'Validating peer excitement while holding scope']
  },
  {
    id: 'assess-3-late-boundary',
    title: 'The "Quick Favor" Late at Night',
    category: 'boundary_setting',
    context: 'It is 9:45 PM on a Thursday. You have an 8:30 AM presentation tomorrow that you still need to rehearse. A collaborative partner texts you asking you to complete their portion of an analysis because they have social plans.',
    speaker: 'Samira (Peer Collaborator)',
    speakerRole: 'Classmate / Colleague',
    dialogueSnippet: 'Hey! Super sorry to ask, but some friends surprised me for dinner tonight and I won’t get back until late. Could you please finish the last 4 data tables for section 3? You’re so fast at it and it would save my life! 🙏',
    interpretationQuestion: 'How do you view Samira’s request and what is your boundary posture?',
    interpretationOptions: [
      {
        id: 'opt-boundary-guilt-agree',
        text: 'I feel pressured and uncomfortable, but I should probably just do it to keep peace and prevent the project from suffering.',
        diagnosticNote: 'Tendency to sacrifice personal boundaries out of conflict avoidance.'
      },
      {
        id: 'opt-boundary-firm-kind',
        text: 'Samira is testing or pushing personal boundaries; I can be warm and empathetic while clearly stating my unavailability without endless apologies.',
        diagnosticNote: 'Healthy self-advocacy and boundary articulation.'
      },
      {
        id: 'opt-boundary-overexplain',
        text: 'I will say no, but explain every detail of my evening schedule, my presentation prep, and my stress levels so they don’t get mad.',
        diagnosticNote: 'Compulsion to overexplain and justify reasonable boundaries.'
      }
    ],
    responsePrompt: 'Write your reply text to Samira:',
    expectedSkills: ['Clear boundary setting', 'Avoiding over-apologizing', 'Holding peer accountability']
  }
];

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'practice-clarify-brief',
    title: 'Clarifying an Incomplete Instruction',
    category: 'clarifying_ambiguity',
    categoryLabel: 'Clarifying Ambiguity',
    difficultyTag: 'Beginner',
    context: 'Your manager or supervisor sends you a one-line email asking for "the updated figures ASAP", but you manage three different projects with varying metrics.',
    situationRole: 'Supervisor / Manager',
    messageSnippet: 'Could you pull together the updated metrics spreadsheet and send it to me right away? Thanks.',
    contextCheckQuestion: 'What is the main communication challenge in this situation?',
    contextCheckOptions: [
      'Guessing which spreadsheet they want so you appear independent',
      'Quickly clarifying the exact scope and project without sounding incompetent or slow',
      'Ignoring it until they send more details'
    ],
    responsePrompt: 'Write a brief, confident message confirming which dataset they need and your expected delivery time:',
    guidanceTip: 'Name the specific possibilities (e.g., "Are you looking for Project Alpha Q3 or the Beta pilot figures?") so they only have to say yes or no.'
  },
  {
    id: 'practice-concise-overexplain',
    title: 'The Concise Status Update (No Rambling)',
    category: 'concise_delivery',
    categoryLabel: 'Concise Delivery & Overexplaining',
    difficultyTag: 'Intermediate',
    context: 'You were delayed on delivering a draft because your laptop took 2 hours to install an unexpected system update. Your colleague asks: "Hey, is the draft ready to review?"',
    situationRole: 'Teammate waiting on your handoff',
    messageSnippet: 'Hey! Wondering if the draft is ready for review yet?',
    contextCheckQuestion: 'What does the recipient actually need to know right now?',
    contextCheckOptions: [
      'The exact technical details of your computer malfunction and how frustrated you were',
      'Current status, the adjusted completion time, and an apology if necessary — in 2 sentences or less',
      'An excuse blaming IT support'
    ],
    responsePrompt: 'Write a concise, professional reply that gives status and ETA without overexplaining the background drama:',
    guidanceTip: 'Resist the urge to tell the whole backstory. State the headline (when it will be ready) first.'
  },
  {
    id: 'practice-firm-boundary',
    title: 'Protecting Your Focus Time',
    category: 'firm_boundaries',
    categoryLabel: 'Setting Boundaries',
    difficultyTag: 'Intermediate',
    context: 'A coworker repeatedly drops by your desk or calls you on Slack while you are heads-down on a high-stakes deliverable.',
    situationRole: 'Colleague popping in with a non-urgent question',
    messageSnippet: 'Hey! Quick question on the company holiday schedule — got 10 minutes to chat right now?',
    contextCheckQuestion: 'What is the most effective approach?',
    contextCheckOptions: [
      'Drop what you are doing to be friendly',
      'Firmly acknowledge their note and offer a specific future time window when you will be free',
      'Leave them on read for 5 hours without saying anything'
    ],
    responsePrompt: 'Write a friendly but clear response protecting your immediate focus time:',
    guidanceTip: 'Acknowledge + state current focus + propose alternative time (e.g., "In the middle of a deadline right now, but I can check in at 3:30 PM!").'
  },
  {
    id: 'practice-stepping-into-group',
    title: 'Speaking Up in a Fast-Moving Meeting',
    category: 'group_dynamics',
    categoryLabel: 'Group Dynamics & Initiating',
    difficultyTag: 'Nuanced',
    context: 'During an online discussion, two participants are dominating the floor debating minor design details while a fundamental architecture question is being overlooked.',
    situationRole: 'Meeting with 6 peers/mentors',
    messageSnippet: '...(Participants debating whether the button should be teal or cyan for 7 minutes)...',
    contextCheckQuestion: 'How can you transition the conversation gracefully?',
    contextCheckOptions: [
      'Wait silently until the meeting ends',
      'Acknowledge the visual polish importance while redirecting attention to the core architecture choice',
      'Unmute and loudly say "Stop wasting time on colors"'
    ],
    responsePrompt: 'Type what you would say in the meeting chat or unmute transcript to refocus the discussion:',
    guidanceTip: 'Use a bridge phrase: "Both points on styling are great — before our time wraps, could we also align on the data flow?"'
  },
  {
    id: 'practice-disagree-gracefully',
    title: 'Disagreeing with a Senior Peer Diplomatically',
    category: 'constructive_disagreement',
    categoryLabel: 'Constructive Disagreement',
    difficultyTag: 'Nuanced',
    context: 'A senior peer proposes skipping user testing before an upcoming demo to save time. You know from previous experience that unvalidated user flows usually break during live demos.',
    situationRole: 'Senior Student / Lead Peer',
    messageSnippet: 'Let’s skip the dry-run testing with external students. It takes too much time and we already know how the app works.',
    contextCheckQuestion: 'What is the risk to avoid in your response?',
    contextCheckOptions: [
      'Agreeing against your better judgment to avoid tension',
      'Sounding accusatory or like you do not trust their judgment',
      'Both of the above'
    ],
    responsePrompt: 'Write a response that raises the valid concern while offering a low-friction alternative compromise:',
    guidanceTip: 'Validate their desire to save time, then share the specific risk and a 15-minute lightweight compromise.'
  }
];

export const ONBOARDING_GOAL_OPTIONS = [
  'Communicate concisely without rambling or overexplaining',
  'Interpret ambiguous messages without jumping to worst-case assumptions',
  'Set polite, firm boundaries without guilt or over-apologizing',
  'Speak up and initiate conversations with confidence in group settings',
  'Respond with high relevance and empathy during high-stakes discussions'
];

export const SITUATION_OPTIONS = [
  { id: 'group_meetings', label: 'Fast-moving group discussions or meetings' },
  { id: 'slack_async', label: 'Ambiguous texts, Slack, or email messages' },
  { id: 'senior_figures', label: 'Talking with authority figures (leads, professors, interviewers)' },
  { id: 'boundary_requests', label: 'Saying "no" or negotiating unreasonable requests' },
  { id: 'small_talk', label: 'Initiating small talk or casual networking' },
  { id: 'disagreement', label: 'Expressing disagreement without creating conflict' }
];
