import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from './LoginView';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (email && password) {
      alert(`Login berhasil!\nEmail: ${email}`);
      navigate('/home'); // Pindah ke Home setelah login
    } else {
      alert('Silakan isi email dan password');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Pindah ke halaman Register
  };

  return (
    <LoginView
      email={email}
      password={password}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onSubmit={handleSubmit}
      onRegisterClick={handleRegisterClick}
    />
  );
};

export default Login;