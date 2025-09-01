import { useState, useCallback, useRef } from 'react';

interface UseUniqueValidationOptions {
  /** Function that checks if value is unique - should return true if unique, false if duplicate */
  checkUnique: (value: string, currentId?: string | null) => Promise<boolean>;
  /** Debounce delay in milliseconds (default: 500) */
  debounceMs?: number;
  /** Minimum length before validation starts (default: 1) */
  minLength?: number;
  /** Custom error message for duplicate values */
  errorMessage?: string;
  /** Current record ID for edit mode (to exclude from uniqueness check) */
  currentId?: string | null;
}

interface UseUniqueValidationReturn {
  /** Validation function to use with react-hook-form or yup */
  validateUnique: (value: string) => Promise<boolean | string>;
  /** Current validation state */
  isValidating: boolean;
  /** Whether the current value is unique */
  isUnique: boolean | null;
  /** Reset validation state */
  resetValidation: () => void;
}

export const useUniqueValidation = ({
  checkUnique,
  debounceMs = 500,
  minLength = 1,
  errorMessage = 'This value already exists',
  currentId = null
}: UseUniqueValidationOptions): UseUniqueValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedValueRef = useRef<string>('');

  const resetValidation = useCallback(() => {
    setIsValidating(false);
    setIsUnique(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const validateUnique = useCallback(
    async (value: string): Promise<boolean | string> => {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Skip validation for empty or too short values
      if (!value || value.trim().length < minLength) {
        resetValidation();
        return true;
      }

      const trimmedValue = value.trim();

      // Skip if we already validated this value
      if (lastValidatedValueRef.current === trimmedValue && isUnique !== null) {
        return isUnique || errorMessage;
      }

      return new Promise((resolve) => {
        setIsValidating(true);
        
        debounceTimerRef.current = setTimeout(async () => {
          try {
            const unique = await checkUnique(trimmedValue, currentId);
            setIsUnique(unique);
            lastValidatedValueRef.current = trimmedValue;
            setIsValidating(false);
            
            resolve(unique || errorMessage);
          } catch (error) {
            setIsValidating(false);
            setIsUnique(null);
            console.error('Unique validation error:', error);
            // On error, assume it's unique to not block form submission
            resolve(true);
          }
        }, debounceMs);
      });
    },
    [checkUnique, debounceMs, minLength, errorMessage, currentId, isUnique]
  );

  return {
    validateUnique,
    isValidating,
    isUnique,
    resetValidation
  };
};