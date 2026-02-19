export function validateEmail(value: string): ValidationCheck {
  if (!value) {
    return { passed: false, errorMessage: "Email address is required" };
  }
  if (!/\S+@\S+\.\S+/.test(value)) {
    return { passed: false, errorMessage: "Email address is invalid" };
  }
  return { passed: true };
}

export function validatePassword(value: string): ValidationCheck {
  if (!value) {
    return { passed: false, errorMessage: "Password is required" };
  }
  if (/[^A-Za-z0-9@#$%&*()!]/.test(value)) {
    return { passed: false, errorMessage: "Allowed special characters: @#$%&*()!" };
  }
  if (value.length < 8) {
    return { passed: false, errorMessage: "Must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(value)) {
    return { passed: false, errorMessage: "Must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(value)) {
    return { passed: false, errorMessage: "Must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(value)) {
    return { passed: false, errorMessage: "Must contain at least one number" };
  }
  if (value.length > 64) {
    return { passed: false, errorMessage: "Can be at most 64 characters long" };
  }
  return { passed: true };
}

export function validateUsername(value: string): ValidationCheck {
  if (!value) {
    return { passed: false, errorMessage: "Username is required" };
  }
  if (value.length < 3) {
    return { passed: false, errorMessage: "Must be at least 3 characters long" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return { passed: false, errorMessage: "Can only contain letters, numbers, and underscores" };
  }
  if (value.length > 16) {
    return { passed: false, errorMessage: "Can be at most 16 characters long" };
  }
  return { passed: true };
}

export function validateAlphabeticalOnly(value: string): ValidationCheck {
  if (!value) {
    return { passed: false, errorMessage: "Field cannot be empty" };
  }
  if (!/^[a-zA-Z]+$/.test(value)) {
    return { passed: false, errorMessage: "Can only contain letters" };
  }
  return { passed: true };
}
