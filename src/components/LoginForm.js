import React, { useState } from "react";
import { Modal, Button, Input } from './ui';
import { useToast } from './ui/Toast';
import { useAuth } from '../AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const addToast = useToast();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPincode, setRegPincode] = useState('');

  const resetForm = () => {
    setLoginEmail(''); setLoginPassword('');
    setRegName(''); setRegEmail(''); setRegMobile(''); setRegPassword('');
    setRegStreet(''); setRegCity(''); setRegState(''); setRegPincode('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast('Please fill in all fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      addToast('Logged in successfully!', 'success');
      resetForm();
      onClose();
    } catch (err) {
      addToast(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regMobile || !regPassword) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: regName, email: regEmail, mobile: regMobile, password: regPassword,
        address: { street: regStreet, city: regCity, state: regState, pincode: regPincode },
      });
      addToast('Registered successfully!', 'success');
      resetForm();
      onClose();
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tab === 'login' ? 'Login' : 'Create Account'} size="sm">
      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl mb-5">
        {['login', 'register'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
              tab === t
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-soft'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      {tab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email" type="email" value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter password" required />
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={regName}
              onChange={(e) => setRegName(e.target.value)} placeholder="Your name" required />
            <Input label="Mobile" type="tel" value={regMobile}
              onChange={(e) => setRegMobile(e.target.value)} placeholder="9876543210" required />
          </div>
          <Input label="Email" type="email" value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)} placeholder="Create a password" required />
          <details className="text-sm text-surface-500 dark:text-surface-400">
            <summary className="cursor-pointer font-medium text-surface-700 dark:text-surface-300">Address (optional)</summary>
            <div className="mt-3 space-y-3">
              <Input label="Street" value={regStreet}
                onChange={(e) => setRegStreet(e.target.value)} placeholder="Street address" />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" value={regCity}
                  onChange={(e) => setRegCity(e.target.value)} placeholder="City" />
                <Input label="State" value={regState}
                  onChange={(e) => setRegState(e.target.value)} placeholder="State" />
                <Input label="PIN" value={regPincode}
                  onChange={(e) => setRegPincode(e.target.value)} placeholder="PIN" />
              </div>
            </div>
          </details>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      )}
    </Modal>
  );
};

export default LoginModal;
