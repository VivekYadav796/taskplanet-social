import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
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

        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Login to your account to continue</p>

        {error && (
          <Alert variant="danger" style={{ borderRadius: 10, fontSize: '0.88rem', fontWeight: 600 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="tp-form-control"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="tp-form-label">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
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
                Logging in...
              </>
            ) : (
              'Login →'
            )}
          </Button>
        </Form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </div>

        {/* Demo hint */}
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: '#f0f9ff',
            borderRadius: 10,
            border: '1px solid #bae6fd',
            fontSize: '0.8rem',
            color: '#0369a1',
            fontWeight: 600,
          }}
        >
          💡 New here? <Link to="/register" style={{ color: '#0369a1' }}>Create a free account</Link> to post and engage!
        </div>
      </div>
    </div>
  );
};

export default Login;
