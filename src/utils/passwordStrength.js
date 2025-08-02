// Password strength validation utility
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: /[@$!%*?#&]/.test(password)
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  // Calculate strength percentage
  const strengthPercentage = (passedChecks / totalChecks) * 100;

  // Determine strength level
  let strength = 'Weak';
  let color = 'red';
  let message = '';

  if (strengthPercentage >= 100) {
    strength = 'Strong';
    color = 'green';
    message = 'Excellent! Your password meets all security requirements.';
  } else if (strengthPercentage >= 80) {
    strength = 'Good';
    color = 'blue';
    message = 'Good password! Consider adding more complexity.';
  } else if (strengthPercentage >= 60) {
    strength = 'Moderate';
    color = 'yellow';
    message = 'Moderate strength. Add more requirements for better security.';
  } else {
    strength = 'Weak';
    color = 'red';
    message = 'Weak password. Please strengthen it.';
  }

  return {
    strength,
    color,
    percentage: strengthPercentage,
    checks,
    message,
    isValid: strengthPercentage >= 80 // At least 80% of requirements met
  };
};

export const validatePassword = (password) => {
  const analysis = checkPasswordStrength(password);
  
  const errors = [];
  
  if (!analysis.checks.length) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  if (!analysis.checks.uppercase) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  if (!analysis.checks.lowercase) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  if (!analysis.checks.numbers) {
    errors.push('Password must contain at least one number (0-9)');
  }
  if (!analysis.checks.specialChars) {
    errors.push('Password must contain at least one special character (@$!%*?#&)');
  }

  return {
    isValid: analysis.isValid,
    errors,
    analysis
  };
};

export const getStrengthColor = (strength) => {
  const colors = {
    Weak: 'text-red-500',
    Moderate: 'text-yellow-500',
    Good: 'text-blue-500',
    Strong: 'text-green-500'
  };
  return colors[strength] || 'text-gray-500';
};

export const getStrengthBgColor = (strength) => {
  const colors = {
    Weak: 'bg-red-100 dark:bg-red-900',
    Moderate: 'bg-yellow-100 dark:bg-yellow-900',
    Good: 'bg-blue-100 dark:bg-blue-900',
    Strong: 'bg-green-100 dark:bg-green-900'
  };
  return colors[strength] || 'bg-gray-100 dark:bg-gray-900';
};

export const getStrengthBorderColor = (strength) => {
  const colors = {
    Weak: 'border-red-300 dark:border-red-600',
    Moderate: 'border-yellow-300 dark:border-yellow-600',
    Good: 'border-blue-300 dark:border-blue-600',
    Strong: 'border-green-300 dark:border-green-600'
  };
  return colors[strength] || 'border-gray-300 dark:border-gray-600';
}; 