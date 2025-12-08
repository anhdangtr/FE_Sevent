import React, { useState } from 'react';

const styles = {
  wrapper: {
    marginBottom: '1rem',
    width: '100%'
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#222'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #d7d7d7',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    position: 'relative',
  },
  inputWithIcon: {
    width: '100%',
    padding: '12px 45px 12px 14px',
    fontSize: '16px',
    border: '1px solid #d7d7d7',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  eyeIcon: {
    position: 'absolute',
    right: '8px',
    top: '24px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '26px',
    color: '#888',
    userSelect: 'none',
    transition: 'color 0.2s'
  },
  error: {
    marginTop: '6px',
    color: '#6b6b6b',
    fontStyle: 'italic',
    fontSize: '13px',
    textAlign: 'left'
  }
};

const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={styles.wrapper}>
      {label && <label htmlFor={name} style={styles.label}>{label}</label>}
      <div style={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={isPasswordField ? styles.inputWithIcon : styles.input}
        />
        {isPasswordField && (
          <span 
            onClick={togglePasswordVisibility} 
            style={styles.eyeIcon}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onMouseEnter={(e) => e.target.style.color = '#0088ff'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
          >
            {showPassword ? '🐵' : '🙈'}
          </span>
        )}
      </div>
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

export default FormInput;
