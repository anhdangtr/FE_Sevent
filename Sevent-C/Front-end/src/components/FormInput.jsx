import React from 'react';

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
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    border: '1px solid #d7d7d7',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none'
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
  return (
    <div style={styles.wrapper}>
      {label && <label htmlFor={name} style={styles.label}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
      />
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

export default FormInput;
