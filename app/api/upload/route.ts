import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  let fileName = 'document.pdf';
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (file) fileName = file.name;
  } catch {
    // Body may not be form data in demos
  }

  const pageCount = Math.floor(Math.random() * 80) + 5;
  const wordCount = pageCount * (250 + Math.floor(Math.random() * 100));
  const languages = ['Arabic', 'Chinese', 'Spanish', 'French', 'German', 'Italian', 'Japanese'];
  const detectedLanguage = languages[Math.floor(Math.random() * languages.length)];

  return NextResponse.json({
    fileId: `file_${Date.now()}`,
    fileName,
    pageCount,
    detectedLanguage,
    wordCount,
    size: Math.floor(Math.random() * 5000000) + 50000,
  });
}
