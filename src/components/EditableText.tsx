import React, { useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  tagName?: keyof React.JSX.IntrinsicElements;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onChange, 
  className = "", 
  multiline = false,
  tagName: Tag = "span"
}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value;
    }
  }, [value]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newValue = elementRef.current.innerText;
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  const CustomTag = Tag as any;

  return (
    <CustomTag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none focus:ring-1 focus:ring-indigo-300 rounded px-0.5 transition-all cursor-text hover:bg-slate-50/50 ${className}`}
    />
  );
};
