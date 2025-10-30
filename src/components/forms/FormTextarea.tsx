'use client';

import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * 📝 TEXTAREA DE FORMULAIRE ANIMÉ
 */

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  hint?: string;
}

export function FormTextarea({ 
  label, 
  error, 
  register, 
  hint,
  className,
  ...props 
}: FormTextareaProps) {
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
        <textarea
          {...register}
          {...props}
          className={`
            w-full px-4 py-2 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-all duration-200 resize-none
            ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-blue-500'}
            ${className || ''}
          `}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.name}-error` : undefined}
        />
      </motion.div>
      
      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-zinc-500">{hint}</p>
      )}
      
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


