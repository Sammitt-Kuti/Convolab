import { ResearchSessionRecord } from '@/types';
import fs from 'fs';
import path from 'path';

// In-memory cache for fast access and serverless compatibility
const memoryStore = new Map<string, ResearchSessionRecord>();

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'research_sessions.json');

// Helper to safely load persisted sessions on server start
function loadPersistedSessions(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const records: ResearchSessionRecord[] = JSON.parse(raw);
      if (Array.isArray(records)) {
        records.forEach((r) => {
          if (r.participantId) memoryStore.set(r.participantId, r);
        });
      }
    }
  } catch (err) {
    // Disk write might be disabled on read-only serverless lambdas
    console.warn('Could not read local research storage file (using memory store):', err);
  }
}

// Helper to safely persist to disk if environment allows
function persistSessionsToDisk(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const all = Array.from(memoryStore.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
  } catch (err) {
    // Graceful on serverless environments
  }
}

// Initialize on module load
loadPersistedSessions();

export async function saveResearchSession(session: ResearchSessionRecord): Promise<void> {
  if (!session.participantId) return;

  const existing = memoryStore.get(session.participantId);
  const updated: ResearchSessionRecord = {
    ...existing,
    ...session,
    updatedAt: new Date().toISOString()
  };

  memoryStore.set(session.participantId, updated);
  persistSessionsToDisk();
}

export async function getResearchSession(participantId: string): Promise<ResearchSessionRecord | null> {
  return memoryStore.get(participantId) || null;
}

export async function getAllResearchSessions(): Promise<ResearchSessionRecord[]> {
  return Array.from(memoryStore.values());
}

export async function deleteResearchSession(participantId: string): Promise<boolean> {
  const existed = memoryStore.delete(participantId);
  if (existed) {
    persistSessionsToDisk();
  }
  return existed;
}

export async function getAggregatedMetrics() {
  const all = Array.from(memoryStore.values());
  const totalParticipants = all.length;
  const consentedCount = all.filter((s) => s.consented).length;
  const totalOnboarded = all.filter((s) => s.onboardingCompleted).length;
  const totalAssessments = all.filter((s) => s.assessmentCompleted).length;

  let totalPractices = 0;
  let totalRetries = 0;
  let confidenceSum = 0;
  let confidenceCount = 0;

  all.forEach((s) => {
    if (s.practiceAttempts) {
      totalPractices += s.practiceAttempts.length;
      totalRetries += s.practiceAttempts.filter((p) => p.retried).length;
    }
    if (s.assessments) {
      s.assessments.forEach((a) => {
        if (typeof a.confidenceRating === 'number') {
          confidenceSum += a.confidenceRating;
          confidenceCount++;
        }
      });
    }
  });

  const retryRatePercent = totalPractices > 0 ? Math.round((totalRetries / totalPractices) * 100) : 0;
  const averageConfidence = confidenceCount > 0 ? Number((confidenceSum / confidenceCount).toFixed(1)) : 0;

  return {
    totalParticipants,
    consentedCount,
    totalOnboarded,
    totalAssessments,
    totalPractices,
    totalRetries,
    retryRatePercent,
    averageConfidence
  };
}
