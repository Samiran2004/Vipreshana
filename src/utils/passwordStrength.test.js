// Test file for password strength validation
import { validatePassword, checkPasswordStrength } from './passwordStrength';

// Test cases for password validation
const testCases = [
  {
    password: '',
    expected: { isValid: false, errors: ['Password must be at least 8 characters long'] }
  },
  {
    password: '123',
    expected: { isValid: false, errors: ['Password must be at least 8 characters long'] }
  },
  {
    password: 'password',
    expected: { isValid: false, errors: ['Password must contain at least one uppercase letter (A-Z)', 'Password must contain at least one number (0-9)', 'Password must contain at least one special character (@$!%*?#&)'] }
  },
  {
    password: 'Password',
    expected: { isValid: false, errors: ['Password must contain at least one number (0-9)', 'Password must contain at least one special character (@$!%*?#&)'] }
  },
  {
    password: 'Password123',
    expected: { isValid: false, errors: ['Password must contain at least one special character (@$!%*?#&)'] }
  },
  {
    password: 'Password123!',
    expected: { isValid: true, errors: [] }
  },
  {
    password: 'MySecurePass123!',
    expected: { isValid: true, errors: [] }
  }
];

// Run tests
console.log('🧪 Testing Password Strength Validation...');

testCases.forEach((testCase, index) => {
  const result = validatePassword(testCase.password);
  const passed = result.isValid === testCase.expected.isValid;
  
  console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Password: "${testCase.password}"`);
  console.log(`  Expected: ${testCase.expected.isValid ? 'Valid' : 'Invalid'}`);
  console.log(`  Got: ${result.isValid ? 'Valid' : 'Invalid'}`);
  
  if (!passed) {
    console.log(`  Expected errors: ${testCase.expected.errors.join(', ')}`);
    console.log(`  Got errors: ${result.errors.join(', ')}`);
  }
  console.log('');
});

// Test strength checker
console.log('🧪 Testing Password Strength Checker...');
const strengthTests = [
  'weak',
  'Password123',
  'MySecurePass123!',
  'SuperStrongPassword123!@#'
];

strengthTests.forEach(password => {
  const strength = checkPasswordStrength(password);
  console.log(`Password: "${password}"`);
  console.log(`  Strength: ${strength.strength}`);
  console.log(`  Percentage: ${Math.round(strength.percentage)}%`);
  console.log(`  Valid: ${strength.isValid}`);
  console.log('');
});

console.log('✅ Password strength validation tests completed!'); 