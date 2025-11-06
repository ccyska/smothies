// History.jsx
import React, { useEffect, useState } from 'react';
import HistoryView from './HistoryView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import logocoklat from "../../assets/image/logocoklat.png";
import logoputih from "../../assets/image/logoputih.png";

const History = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);

  const logo = {
    name: "Logo Coklat", 
    image: logocoklat 
  };

  const logo1 = {
    name: "Putih", 
    image: logoputih
  };

  // Load orders dari localStorage saat component mount
  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
      setOrders(savedOrders);
      console.log('Loaded orders:', savedOrders);
    };

    loadOrders();

    // Optional: Listen for storage changes (jika order ditambah dari tab lain)
    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar logo={logo} onNavigate={onNavigate} />
      <HistoryView orders={orders} />
      <Footer logo1={logo1} onNavigate={onNavigate} />
    </div>
  );
};

export default History;