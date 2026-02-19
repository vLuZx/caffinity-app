type ValidationCheck = {
  passed: boolean;
  errorMessage?: string;
}

type ValidationFn = (value: string) => ValidationCheck;
