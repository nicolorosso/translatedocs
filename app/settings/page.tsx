'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';
import { LANGUAGES, MODELS, STYLES } from '@/lib/mock-data';

function MaskedInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium" style={{ color: 'var(--td-text-secondary)' }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all duration-150"
        style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      >
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--td-text-primary)' }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 transition-colors duration-150"
          style={{ color: 'var(--td-text-tertiary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-text-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-text-tertiary)'; }}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function SettingsSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium" style={{ color: 'var(--td-text-secondary)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none appearance-none cursor-pointer transition-all duration-150"
        style={{
          borderColor: 'var(--td-border)',
          background: 'var(--td-surface)',
          color: 'var(--td-text-primary)',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
    >
      <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--td-border)' }}>
        <div className="text-sm font-medium" style={{ color: 'var(--td-text-primary)' }}>{title}</div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const {
    anthropicKey, setAnthropicKey,
    openaiKey, setOpenaiKey,
    defaultTargetLanguage, setDefaultTargetLanguage,
    defaultModel, setDefaultModel,
    defaultStyle, setDefaultStyle,
  } = useStore();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const langOptions = LANGUAGES.filter(l => l.code !== 'auto').map(l => ({
    value: l.code,
    label: `${l.flag} ${l.name}`,
  }));

  const modelOptions = MODELS.map(m => ({ value: m.id, label: m.name }));
  const styleOptions = STYLES.map(s => ({ value: s.id, label: s.name }));

  // Mock billing data
  const usagePercent = 34;
  const creditsRemaining = 8.66;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--td-text-primary)' }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--td-text-secondary)' }}>
          Manage your API keys, preferences, and billing
        </p>
      </div>

      <div className="space-y-4">
        {/* API Keys */}
        <SectionCard title="API Keys">
          <MaskedInput
            label="Anthropic API Key"
            value={anthropicKey}
            onChange={setAnthropicKey}
            placeholder="sk-ant-..."
          />
          <MaskedInput
            label="OpenAI API Key"
            value={openaiKey}
            onChange={setOpenaiKey}
            placeholder="sk-..."
          />
          <div
            className="px-3 py-2.5 rounded-lg text-xs"
            style={{ background: 'var(--td-accent-subtle)', color: 'var(--td-text-tertiary)' }}
          >
            Keys are stored locally in your browser and never sent to our servers.
          </div>
        </SectionCard>

        {/* Default preferences */}
        <SectionCard title="Default Preferences">
          <SettingsSelect
            label="Default Target Language"
            value={defaultTargetLanguage}
            options={langOptions}
            onChange={setDefaultTargetLanguage}
          />
          <SettingsSelect
            label="Default Model"
            value={defaultModel}
            options={modelOptions}
            onChange={(v) => setDefaultModel(v as Parameters<typeof setDefaultModel>[0])}
          />
          <SettingsSelect
            label="Default Style"
            value={defaultStyle}
            options={styleOptions}
            onChange={(v) => setDefaultStyle(v as Parameters<typeof setDefaultStyle>[0])}
          />
        </SectionCard>

        {/* Billing */}
        <SectionCard title="Billing">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--td-text-secondary)' }}>Credit Balance</span>
              <span className="text-sm font-medium" style={{ color: 'var(--td-text-primary)' }}>
                ${creditsRemaining.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>Monthly usage</span>
                <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>{usagePercent}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--td-accent-subtle)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%`, background: 'var(--td-progress)' }}
                />
              </div>
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg text-sm font-medium border transition-all duration-150"
              style={{ borderColor: 'var(--td-border)', color: 'var(--td-text-secondary)', background: 'transparent' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--td-border-hover)';
                el.style.color = 'var(--td-text-primary)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--td-border)';
                el.style.color = 'var(--td-text-secondary)';
              }}
            >
              Add credits
            </button>
          </div>
        </SectionCard>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.02]"
          style={{ background: 'var(--td-accent)', color: 'var(--td-surface)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent)'; }}
        >
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </motion.div>
  );
}
