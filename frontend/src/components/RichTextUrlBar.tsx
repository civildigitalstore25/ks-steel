import React from 'react';

interface RichTextUrlBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  submitLabel: string;
}

export const RichTextUrlBar: React.FC<RichTextUrlBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
}) => (
  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
    <input
      type="url"
      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onSubmit();
        }
      }}
    />
    <button
      type="button"
      onClick={onSubmit}
      className="rounded-lg bg-[#D7A94B] px-3 py-1.5 text-xs font-semibold text-[#0B1728] hover:bg-[#C5973A]"
    >
      {submitLabel}
    </button>
  </div>
);
