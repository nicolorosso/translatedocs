import { NextResponse } from 'next/server';

// In-memory job progress tracker
const jobProgress = new Map<string, { completed: number; total: number; startTime: number }>();

const CHUNK_PREVIEWS = [
  'The parties agree to the following terms and conditions...',
  'Article 1: Definitions and Interpretations apply herein...',
  'Subject to the provisions of this Agreement, the Licensor grants...',
  'All intellectual property rights shall remain with the originator...',
  'This section governs the liability and indemnification clauses...',
  'Force majeure events include acts of God, war, and natural disasters...',
  'Confidential information must not be disclosed to third parties...',
  'Dispute resolution shall proceed through binding arbitration...',
  'The effective date of this agreement is as stated above...',
  'Governing law shall be that of the jurisdiction agreed upon...',
  'Payment terms are net-30 from the date of invoice issuance...',
  'Termination clauses apply with 30 days written notice...',
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobProgress.has(jobId)) {
    const total = Math.floor(Math.random() * 40) + 8;
    jobProgress.set(jobId, { completed: 0, total, startTime: Date.now() });
  }

  const job = jobProgress.get(jobId)!;
  const elapsed = (Date.now() - job.startTime) / 1000; // seconds

  // Advance by ~1.5 chunks per second
  const newCompleted = Math.min(job.total, Math.floor(elapsed * 1.5));
  job.completed = newCompleted;

  const isComplete = job.completed >= job.total;
  const remaining = Math.max(0, Math.ceil((job.total - job.completed) / 1.5));

  const previewIndex = Math.floor(Math.random() * CHUNK_PREVIEWS.length);

  return NextResponse.json({
    jobId,
    status: isComplete ? 'completed' : 'processing',
    completedChunks: job.completed,
    totalChunks: job.total,
    currentChunkPreview: isComplete ? null : CHUNK_PREVIEWS[previewIndex],
    estimatedSecondsRemaining: remaining,
  });
}
