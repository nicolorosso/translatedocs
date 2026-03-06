import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await new Promise((r) => setTimeout(r, 300));

  const body = await req.json().catch(() => ({}));
  const { fileId, sourceLang, targetLang, model, style } = body;

  const totalChunks = Math.floor(Math.random() * 40) + 8;
  const estimatedTime = totalChunks * 3 + Math.floor(Math.random() * 30);

  const costPerChunk: Record<string, number> = {
    'claude-sonnet': 0.003,
    'claude-opus': 0.015,
    'gpt-4o': 0.005,
    'byok': 0,
  };
  const rate = costPerChunk[model as string] ?? 0.003;
  const estimatedCost = parseFloat((totalChunks * rate).toFixed(3));

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return NextResponse.json({
    jobId,
    estimatedTime,
    estimatedCost,
    totalChunks,
    fileId: fileId ?? null,
    sourceLang: sourceLang ?? 'auto',
    targetLang: targetLang ?? 'en',
    model: model ?? 'claude-sonnet',
    style: style ?? 'general',
  });
}
