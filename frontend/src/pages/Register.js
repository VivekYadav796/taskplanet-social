import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only have letters, numbers, underscores');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(username, email, password);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <h1>Task<span>Planet</span></h1>
          <p>Social — Connect, Share & Earn 🚀</p>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the community and start earning</p>

        {error && (
          <Alert variant="danger" style={{ borderRadius: 10, fontSize: '0.88rem', fontWeight: 600 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="e.g. john_doe123"
              value={form.username}
              onChange={handleChange}
              className="tp-form-control"
              autoFocus
              maxLength={30}
            />
            <Form.Text style={{ fontSize: '0.76rem', color: 'var(--tp-text-muted)', fontWeight: 600 }}>
              Letters, numbers, underscores only
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="tp-form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              className="tp-form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="tp-form-control"
            />
          </Form.Group>

          <Button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating Account...
              </>
            ) : (
              'Create Account →'
            )}
          </Button>
        </Form>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
