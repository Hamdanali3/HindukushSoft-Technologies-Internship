import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required, 
  placeholder, 
  maxLength 
}) => {
  const isTextarea = type === 'textarea';
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  // Validation icon logic (simple version)
  // For required fields, if they have a value and no error, show success
  const isValid = required ? (value.trim() !== '' && !error) : (!error && value.trim() !== '');
  const showError = error !== undefined && error !== '';

  return (
    <div className="field-wrapper">
      <label className="field-label" htmlFor={name}>
        {label} {required && <span>*</span>}
      </label>
      
      <div className="input-container">
        <InputComponent
          id={name}
          name={name}
          type={isTextarea ? undefined : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`input-element ${showError ? 'has-error' : ''} ${isValid && !isTextarea ? 'is-valid' : ''}`}
        />
        
        {!isTextarea && (
          <div className="validation-icon">
            {showError && (
              <svg className="error" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            {isValid && !showError && (
              <svg className="success" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
        )}
      </div>
      
      {showError && <div className="error-message">{error}</div>}
      
      {isTextarea && maxLength && (
        <div className={`char-counter ${value.length >= maxLength ? 'warning' : ''}`}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default FormField;
