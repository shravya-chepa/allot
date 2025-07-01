import {
  MOBILE_NUMBER,
  NUMBER_PATTERN,
  BLANK_SPACE,
  EMAIL_PATTERN,
  ALPHABET_PATTERN,
} from "../constants/patterns";

export const isOnlyNumbers = (value) => {
  if (value && value === "0") {
    return "0 as value is not allowed";
  }
  if (value && value?.toString()?.trim()?.includes("-")) {
    return "Negative values are not allowed";
  }

  if (value && !value?.toString().trim()?.match(NUMBER_PATTERN)) {
    return "Only numeric values allowed";
  }

  return null;
};

export const isMobileNumber = (value) => {
  if (!value || value?.match(MOBILE_NUMBER)) {
    return null;
  }

  return `Invalid Phone number`;
};

export const getFieldError = ({ error, errors, name }) => {
  const newError =
    (error && error.message) ||
    (errors && errors[name] && errors[name].message);
  const color = newError && "error";

  return { error: newError, color };
};

export const validateRequiredField = (fieldName) => (value) => {
  if (!value) {
    return `${fieldName} is required`;
  }

  if (value && Array.isArray(value)) {
    if (value.length === 0) {
      return `${fieldName} is required`;
    }
  }

  return null;
};

export const hasBlankSpace = (value) => {
  if (value.match(BLANK_SPACE)) {
    return "This field is required";
  }

  return null;
};

export const isOnlyAlphabets = (value) => {
  if (!value.match(ALPHABET_PATTERN)) {
    return "Please enter alphabets only";
  }

  return null;
};

export const isValidEmail = (value) => {
  if (!value || value?.trim().match(EMAIL_PATTERN)) {
    return null;
  }

  return `Please enter email id: xyz@gmail.com`;
};

export const checkMaxLength =
  (maxLength, field = "This Field") =>
  (value) => {
    if (value?.length > maxLength) {
      if (field === "Email Address") {
        return `Maximum of ${maxLength} characters are allowed for Email ID`;
      }

      return `${field} should not contain more than ${maxLength} characters`;
    }

    return null;
  };


  export const checkMinLength = (minLength) => (value) => {
    if (value.length < minLength) {
      return `Password must be of minimum ${minLength} character length.`;
    }

    return null;
  };

  export const validateConfirmPassword = (password) => (confirmPassword) => {
    if (password !== confirmPassword) {
      return "Password and Confirm Password do not match, please re-enter";
    }

    return null;
  };