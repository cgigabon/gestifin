'use client';

import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * 📋 SELECT DE FORMULAIRE ANIMÉ
 */

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export function FormSelect({ 
  label, 
  error, 
  register, 
  options,
  placeholder = 'Sélectionnez...',
  className,
  ...props 
}: FormSelectProps) {
  const hasError = !!error;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <Label 
        htmlFor={props.id || props.name}
        className={hasError ? 'text-red-600' : ''}
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <motion.div
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <select
          {...register}
          {...props}
          className={`
            w-full px-4 py-2 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-all duration-200
            ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-blue-500'}
            ${className || ''}
          `}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.name}-error` : undefined}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </motion.div>
      
      {/* Error message */}
      {error && (
        <motion.p
          id={`${props.name}-error`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <span>⚠️</span>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}


