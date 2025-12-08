import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';

const containerStyle = {
  width: '100%',
  maxWidth: '420px',
  margin: '0 auto'
};

const buttonStyle = {
  backgroundColor: '#2D2C3C',
  color: 'white',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer'
};

const loginLink = {
    color: '#333',
    font: '14px Arial, Helvetica, sans-serif',
    textAlign: 'center',
    marginTop: '40px',
};  

const SignUpForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z0-9 ]+$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, api: undefined });
  };

  const validate = () => {
    let tempErrors = {};

    if (!form.name) tempErrors.name = 'Full name is required';
    else if (!nameRegex.test(form.name)) tempErrors.name = 'Name cannot contain special characters';
    else if (form.name.length > 80) tempErrors.name = 'Name cannot exceed 80 characters';

    if (!form.email) tempErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) tempErrors.email = 'Invalid email format';

    if (!form.password) tempErrors.password = 'Password is required';
    else if (form.password.length < 8) tempErrors.password = 'Password must be at least 8 characters';
    else if (form.password.length > 80) tempErrors.password = 'Password cannot exceed 80 characters';

    if (!form.passwordConfirm) tempErrors.passwordConfirm = 'Please confirm your password';
    else if (form.password !== form.passwordConfirm) tempErrors.passwordConfirm = 'Passwords do not match';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validate()) return;

    try {
      // Backend register endpoint
      // Backend expects: { email, password, passwordConfirm, name }
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm
      };

      const res = await axios.post('http://localhost:5000/api/auth/signup', payload, { withCredentials: true });
      setSuccess(res.data.message || 'Sign up successful');
      setForm({ name: '', email: '', password: '', passwordConfirm: '' });

      // After short delay navigate to login
      setTimeout(() => navigate('/auth/LogIn'), 1200);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Server error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle} className="signup-form">
      <div className="create-heading">Create account</div>

      {errors.api && <div style={{ color: '#6b6b6b', fontStyle: 'italic', marginBottom: '8px' }}>{errors.api}</div>}
      {success && <div style={{ color: 'green', marginBottom: '8px' }}>{success}</div>}

      <FormInput
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.name}
      />

      <FormInput
        label="Email Address"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Create a password"
        error={errors.password}
      />

      <FormInput
        label="Confirm Password"
        name="passwordConfirm"
        type="password"
        value={form.passwordConfirm}
        onChange={handleChange}
        placeholder="Confirm your password"
        error={errors.passwordConfirm}
      />

      <button type="submit" style={buttonStyle}>Create</button>
      <br />
        <p style={loginLink}>
          Already have an account? <a href="/auth/LogIn">Login</a>
        </p>
    </form>
  );
};

export default SignUpForm;
