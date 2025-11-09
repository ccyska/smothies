import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import HomeView from './HomeView';
import logocoklat from "../../assets/image/logocoklat.png";
import logogambar from "../../assets/image/logogambar.png";
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

const Home = () => {
  const [menuIndex, setMenuIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logo = {
    name: "Logo Coklat", 
    image: logocoklat 
  };

  const gambar = {
    name: "Logo Gambar", 
    image: logogambar
  };

  const logo1 = {
    name: "Putih", 
    image: logoputih
  };

  // API Functions - HAPUS getOrderHistory karena tidak digunakan di Home
  const getAllProducts = async () => {
    try {
      const response = await api.get("/api/products");
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  };

  const createOrder = async (data) => {
    try {
      const response = await api.post("/api/user/orders", data);
      return response;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  };

  // Fetch products from API - HANYA dari API, tidak ada fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts();
        console.log('API Products Response:', response.data);
        
        if (response.data && response.data.length > 0) {
          // Map API response to match our expected format
          const formattedMenus = response.data.map(product => ({
            id: product.id,
            name: product.name,
            image: product.imageUrl || product.image, // Ambil gambar dari API
            description: product.description,
            basePrice: product.price || 8000 // Default price jika tidak ada
          }));
          
          setMenus(formattedMenus);
          setError(null);
        } else {
          // Jika API mengembalikan array kosong
          setMenus([]);
          setError('Tidak ada menu yang tersedia');
        }
      } catch (err) {
        console.error('Error fetching products from API:', err);
        setError('Gagal memuat menu dari server. Silakan coba lagi.');
        setMenus([]); // Pastikan menus kosong jika API error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fungsi untuk handle Buy Now
  const handleBuyNow = (menu) => {
    setSelectedMenu(menu);
    setShowOrderForm(true);
  };

  // Fungsi untuk close form
  const handleCloseForm = () => {
    setShowOrderForm(false);
    setSelectedMenu(null);
  };

  // Fungsi untuk save order ke API dan localStorage
  const handleSaveOrder = async (orderDetails) => {
    try {
      // Prepare data for API
      const apiOrderData = {
        productId: orderDetails.menu.id,
        quantity: orderDetails.quantity,
        customerName: orderDetails.name,
        address: orderDetails.address,
        notes: orderDetails.notes,
        yogurtOption: orderDetails.yogurtOption,
        totalPrice: orderDetails.totalPrice,
        pricePerItem: orderDetails.pricePerItem,
        orderDate: new Date().toISOString()
      };

      // Send to API
      const apiResponse = await createOrder(apiOrderData);
      console.log('Order saved to API:', apiResponse.data);

      // Also save to localStorage as backup
      const existingOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
      const newOrder = {
        id: Date.now().toString(),
        ...orderDetails,
        apiOrderId: apiResponse.data.id // Save API order ID if needed
      };
      
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('smoothieOrders', JSON.stringify(updatedOrders));
      
      console.log('Order saved locally:', newOrder);
      return { success: true, data: apiResponse.data };

    } catch (error) {
      console.error('Error saving order to API:', error);
      
      // Fallback: save only to localStorage if API fails
      const existingOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
      const newOrder = {
        id: Date.now().toString(),
        ...orderDetails,
        apiError: true // Mark that API call failed
      };
      
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('smoothieOrders', JSON.stringify(updatedOrders));
      
      console.log('Order saved locally (API failed):', newOrder);
      return { success: false, error: error.message };
    }
  };

  // Fungsi untuk menangani navigasi
  const handleNavigate = (target) => {
    console.log(`Navigating to: ${target}`);
    
    let element;
    
    switch(target) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'our-menu':
        element = document.getElementById('our-menu');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'footer':
        element = document.getElementById('footer');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'history':
        navigate('/history');
        break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <HomeView 
        menus={menus}
        menuIndex={menuIndex}
        setMenuIndex={setMenuIndex}
        logo={logo}
        gambar={gambar}
        logo1={logo1}
        onNavigate={handleNavigate}
        onBuyNow={handleBuyNow}
        showOrderForm={showOrderForm}
        selectedMenu={selectedMenu}
        onCloseForm={handleCloseForm}
        onSaveOrder={handleSaveOrder}
        loading={loading}
        error={error}
      />
    </div>
  )
}

export default Home