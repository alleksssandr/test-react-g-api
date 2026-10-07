import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import './Field.css';

interface FieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export default function Field({
  value = '',
  onChange,
  onSend,
  placeholder = 'Написать сообщение...',
  leftIcon,
  disabled = false,
}: FieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && onSend) onSend(value);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const wrapperClasses = [
    'field',
    isFocused && 'field--focused',
    disabled && 'field--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {leftIcon && <button className="field__icon field__icon--left">{leftIcon}</button>}

      <textarea
        ref={textareaRef}
        className="field__input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
      />
    </div>
  );
}