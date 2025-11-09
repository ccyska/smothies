import React, { useEffect, useState } from 'react';
import HistoryView from './HistoryView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import logocoklat from "../../assets/image/logocoklat.png";
import logoputih from "../../assets/image/logoputih.png";
import axios from "axios";

// API configuration
const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const History = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logo = {
    name: "Logo Coklat", 
    image: logocoklat 
  };

  const logo1 = {
    name: "Putih", 
    image: logoputih
  };

  // API Function untuk get order history
  const getOrderHistory = async () => {
    try {
      const response = await api.get("/api/user/orders");
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch order history: ${error.message}`);
    }
  };

  // Load orders dari API dan localStorage
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        
        // Coba ambil dari API terlebih dahulu
        const apiResponse = await getOrderHistory();
        console.log('API Orders:', apiResponse.data);
        
        if (apiResponse.data && apiResponse.data.length > 0) {
          // Format data dari API ke format yang diharapkan
          const formattedOrders = apiResponse.data.map(order => ({
            id: order.id,
            menu: {
              id: order.productId,
              name: order.productName || `Product ${order.productId}`,
              image: order.productImage || '/placeholder-smoothie.png'
            },
            quantity: order.quantity,
            name: order.customerName,
            address: order.address,
            notes: order.notes,
            yogurtOption: order.yogurtOption,
            totalPrice: order.totalPrice,
            pricePerItem: order.pricePerItem,
            orderDate: order.orderDate || order.createdAt
          }));
          
          setOrders(formattedOrders);
          setError(null);
        } else {
          // Fallback ke localStorage jika API tidak ada data
          const savedOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
          setOrders(savedOrders);
          console.log('Loaded orders from localStorage:', savedOrders);
        }
      } catch (err) {
        console.error('Error loading orders from API:', err);
        // Fallback ke localStorage jika API error
        const savedOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
        setOrders(savedOrders);
        console.log('Loaded orders from localStorage (API failed):', savedOrders);
        setError('Gagal memuat riwayat dari server. Menampilkan data lokal.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    // Listen for storage changes (jika order ditambah dari tab lain)
    const handleStorageChange = () => {
      const savedOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
      setOrders(prevOrders => {
        // Gabungkan data dari API (jika ada) dengan data localStorage terbaru
        const apiOrders = prevOrders.filter(order => order.apiOrderId);
        const localOrders = savedOrders;
        return [...apiOrders, ...localOrders];
      });
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar logo={logo} onNavigate={onNavigate} />
      <HistoryView 
        orders={orders} 
        loading={loading}
        error={error}
      />
      <Footer logo1={logo1} onNavigate={onNavigate} />
    </div>
  );
};

export default History;