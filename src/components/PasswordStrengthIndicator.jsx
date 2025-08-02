import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { 
  checkPasswordStrength, 
  getStrengthColor, 
  getStrengthBgColor, 
  getStrengthBorderColor,
  PASSWORD_REQUIREMENTS 
} from '../utils/passwordStrength';

const PasswordStrengthIndicator = ({ password, isDark }) => {
  if (!password) return null;

  const analysis = checkPasswordStrength(password);
  const { checks, strength, percentage, message } = analysis;

  const requirements = [
    { key: 'length', label: `At least ${PASSWORD_REQUIREMENTS.minLength} characters`, icon: CheckCircle },
    { key: 'uppercase', label: 'One uppercase letter (A-Z)', icon: CheckCircle },
    { key: 'lowercase', label: 'One lowercase letter (a-z)', icon: CheckCircle },
    { key: 'numbers', label: 'One number (0-9)', icon: CheckCircle },
    { key: 'specialChars', label: 'One special character (@$!%*?#&)', icon: CheckCircle }
  ];

  return (
    <div className={`mt-2 p-3 rounded-lg border ${getStrengthBorderColor(strength)} ${getStrengthBgColor(strength)}`}>
      {/* Strength Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
            Password Strength: {strength}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              strength === 'Weak' ? 'bg-red-500' :
              strength === 'Moderate' ? 'bg-yellow-500' :
              strength === 'Good' ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((req) => {
          const isMet = checks[req.key];
          const Icon = req.icon;
          
          return (
            <div key={req.key} className="flex items-center gap-2 text-xs">
              {isMet ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span className={isMet ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span className={getStrengthColor(strength)}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator; 