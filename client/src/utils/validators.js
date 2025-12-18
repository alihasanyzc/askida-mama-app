// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Turkish format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Password validation (min 8 char, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Min length validation
export const minLength = (value, min) => {
  return value && value.toString().length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
  return value && value.toString().length <= max;
};
