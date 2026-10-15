import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  PlayCircle,
  Quote,
  RemoveFormatting,
  Trash2,
  Underline as UnderlineIcon,
} from 'lucide-react';

const COLORS = [
  { label: 'Default', value: '' },
  { label: 'Navy', value: '#14263D' },
  { label: 'Gold', value: '#D7A94B' },
  { label: 'Slate', value: '#64748B' },
  { label: 'Red', value: '#b91c1c' },
];

interface RichTextToolbarProps {
  editor: Editor;
  showImageInput: boolean;
  showYoutubeInput: boolean;
  showLinkInput: boolean;
  showColorMenu: boolean;
  imageSelected: boolean;
  onRemoveImage: () => void;
  onToggleImage: () => void;
  onToggleYoutube: () => void;
  onToggleLink: () => void;
  onToggleColor: () => void;
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded-lg text-[#14263D] hover:bg-white ${active ? 'bg-[#D7A94B]/30' : ''}`}
    >
      {children}
    </button>
  );
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  editor,
  showImageInput,
  showYoutubeInput,
  showLinkInput,
  showColorMenu,
  imageSelected,
  onRemoveImage,
  onToggleImage,
  onToggleYoutube,
  onToggleLink,
  onToggleColor,
}) => {
  const styleValue = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'p';

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      <select
        aria-label="Text style"
        className="mr-1 h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-[#14263D]"
        value={styleValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          else if (next === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
          else editor.chain().focus().setParagraph().run();
        }}
      >
        <option value="p">Normal</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-0.5 h-5 w-px bg-slate-200" />
      <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-0.5 h-5 w-px bg-slate-200" />
      <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-0.5 h-5 w-px bg-slate-200" />
      <ToolbarButton title="Link" active={showLinkInput || editor.isActive('link')} onClick={onToggleLink}>
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Image" active={showImageInput} onClick={onToggleImage}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      {imageSelected && (
        <ToolbarButton title="Remove image" onClick={onRemoveImage}>
          <Trash2 className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}
      <ToolbarButton title="YouTube" active={showYoutubeInput} onClick={onToggleYoutube}>
        <PlayCircle className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-0.5 h-5 w-px bg-slate-200" />
      <div className="relative">
        <ToolbarButton title="Text color" active={showColorMenu} onClick={onToggleColor}>
          <Palette className="h-3.5 w-3.5" />
        </ToolbarButton>
        {showColorMenu && (
          <div className="absolute left-0 top-full z-20 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
            {COLORS.map((color) => (
              <button
                key={color.label}
                type="button"
                title={color.label}
                className="h-5 w-5 rounded-full border border-slate-200"
                style={{ backgroundColor: color.value || '#ffffff' }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  if (!color.value) editor.chain().focus().unsetColor().run();
                  else editor.chain().focus().setColor(color.value).run();
                  onToggleColor();
                }}
              />
            ))}
          </div>
        )}
      </div>
      <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
};
