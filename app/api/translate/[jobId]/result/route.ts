import { NextResponse } from 'next/server';
import { MOCK_TRANSLATION_CHUNKS } from '@/lib/mock-data';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  await new Promise((r) => setTimeout(r, 200));

  return NextResponse.json({
    jobId,
    chunks: MOCK_TRANSLATION_CHUNKS,
    wordCount: 1847,
    processingTime: 142,
    model: 'claude-sonnet',
    cost: 0.14,
  });
}
