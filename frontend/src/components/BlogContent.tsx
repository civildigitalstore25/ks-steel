import React from 'react';

export const BlogContent: React.FC<{ content: string }> = ({ content }) => {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5 text-[#202A36] text-base leading-8">
      {blocks.map((block, index) => {
        if (block.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-extrabold text-[#14263D] pt-2">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-extrabold text-[#14263D] pt-3">
              {block.slice(3)}
            </h2>
          );
        }
        return (
          <p key={index} className="text-slate-700">
            {block}
          </p>
        );
      })}
    </div>
  );
};
