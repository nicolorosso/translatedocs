'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import type { UploadedFile } from '@/lib/types';

interface DropZoneProps {
  files: UploadedFile[];
  onFilesAdded: (files: UploadedFile[]) => void;
  onFileRemoved: (fileId: string) => void;
}

async function simulateUpload(file: File): Promise<UploadedFile> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
  const pageCount = Math.floor(Math.random() * 80) + 5;
  const wordCount = pageCount * (250 + Math.floor(Math.random() * 100));
  const languages = ['Arabic', 'Chinese', 'Spanish', 'French', 'German', 'Italian', 'Japanese'];
  const detectedLanguage = languages[Math.floor(Math.random() * languages.length)];
  return {
    fileId: `file_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    fileName: file.name,
    pageCount,
    detectedLanguage,
    wordCount,
    size: file.size,
  };
}

export function DropZone({ files, onFilesAdded, onFileRemoved }: DropZoneProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const results = await Promise.all(acceptedFiles.map(simulateUpload));
      onFilesAdded(results);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: true,
  });

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.fileId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--td-border)', background: 'var(--td-accent-subtle)' }}
          >
            <FileText className="w-4 h-4 shrink-0" style={{ color: 'var(--td-text-secondary)' }} />
            <span className="flex-1 font-medium truncate" style={{ color: 'var(--td-text-primary)' }}>
              {file.fileName}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--td-text-tertiary)' }}>
              {file.pageCount} pages · {file.detectedLanguage} detected
            </span>
            <button
              type="button"
              onClick={() => onFileRemoved(file.fileId)}
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
              style={{ color: 'var(--td-text-tertiary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-error)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-text-tertiary)'; }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragActive ? 'scale-[1.01]' : 'hover:scale-[1.005]'
        } ${hasFiles ? 'py-4' : 'py-10'}`}
        style={{
          borderColor: isDragActive ? 'var(--td-border-hover)' : 'var(--td-border)',
          background: isDragActive ? 'var(--td-accent-subtle)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isDragActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--td-border-hover)';
        }}
        onMouseLeave={(e) => {
          if (!isDragActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--td-border)';
        }}
      >
        <input {...getInputProps()} />
        <Upload
          className={`mb-3 transition-all duration-200 ${isDragActive ? 'scale-110' : ''}`}
          style={{
            width: hasFiles ? 20 : 32,
            height: hasFiles ? 20 : 32,
            color: isDragActive ? 'var(--td-text-secondary)' : 'var(--td-text-tertiary)',
          }}
        />
        <p className="font-medium" style={{ color: isDragActive ? 'var(--td-text-primary)' : 'var(--td-text-secondary)', fontSize: 14 }}>
          {isDragActive ? 'Drop to upload' : hasFiles ? 'Drop more files' : 'Drop files here or click to upload'}
        </p>
        {!hasFiles && (
          <p className="mt-1 text-xs" style={{ color: 'var(--td-text-tertiary)' }}>
            PDF, DOCX, TXT, XLSX — up to 500 pages
          </p>
        )}
      </div>
    </div>
  );
}
