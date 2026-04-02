// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Turkish format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Password validation (min 8 char, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value: unknown): boolean => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Min length validation
export const minLength = (value: unknown, min: number): boolean => {
  return value && value.toString().length >= min;
};

// Max length validation
export const maxLength = (value: unknown, max: number): boolean => {
  return value && value.toString().length <= max;
};
