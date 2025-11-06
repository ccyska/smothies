import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterView from './RegisterView';

const Register = () => {
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleKelasChange = (e) => {
    setKelas(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (name && kelas && email && password) {
      alert(`Register berhasil!\nName: ${name}\nKelas/Alamat: ${kelas}\nEmail: ${email}`);
      navigate('/login'); // Pindah ke Login setelah register berhasil
    } else {
      alert('Silakan isi semua field');
    }
  };

  const handleLoginClick = () => {
    navigate('/login'); // Pindah ke halaman Login
  };

  return (
    <RegisterView
      name={name}
      kelas={kelas}
      email={email}
      password={password}
      onNameChange={handleNameChange}
      onKelasChange={handleKelasChange}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onSubmit={handleSubmit}
      onLoginClick={handleLoginClick}
    />
  );
};

export default Register;