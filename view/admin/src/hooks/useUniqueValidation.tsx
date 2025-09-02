import { useState, useCallback, useRef } from "react";

interface UseUniqueValidationOptions {
  checkUnique: (
    value: string,
    currentId?: string | null,
    selectedCategoryId?: string | null
  ) => Promise<boolean>;
  debounceMs?: number;
  minLength?: number;
  errorMessage?: string;
  currentId?: string | null;
  selectedCategoryId?: string | null;
}

interface UseUniqueValidationReturn {
  validateUnique: (value: string) => Promise<boolean | string>;
  isValidating: boolean;
  isUnique: boolean | null;
  resetValidation: () => void;
}

export const useUniqueValidation = ({
  checkUnique,
  debounceMs = 500,
  minLength = 1,
  errorMessage = "This value already exists",
  currentId = null,
  selectedCategoryId = null, // ✅ Add this
}: UseUniqueValidationOptions): UseUniqueValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedValueRef = useRef<string>("");

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
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!value || value.trim().length < minLength) {
        resetValidation();
        return true;
      }

      const trimmedValue = value.trim();

      if (lastValidatedValueRef.current === trimmedValue && isUnique !== null) {
        return isUnique || errorMessage;
      }

      return new Promise((resolve) => {
        setIsValidating(true);

        debounceTimerRef.current = setTimeout(async () => {
          try {
            const unique = await checkUnique(
              trimmedValue,
              currentId,
              selectedCategoryId
            );
            setIsUnique(unique);
            lastValidatedValueRef.current = trimmedValue;
            setIsValidating(false);

            resolve(unique || errorMessage);
          } catch (error) {
            setIsValidating(false);
            setIsUnique(null);
            console.error("Unique validation error:", error);
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
    resetValidation,
  };
};
