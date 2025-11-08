import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HomeView from './HomeView';
import banadraImg from "../../assets/image/banadraImg.png";
import mangoImg from "../../assets/image/mangoImg.png";
import chocoImg from "../../assets/image/chocoImg.png";
import logocoklat from "../../assets/image/logocoklat.png";
import logogambar from "../../assets/image/logogambar.png";
import logoputih from "../../assets/image/logoputih.png";

const Home = () => {
  const [menuIndex, setMenuIndex] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const navigate = useNavigate();

  const menus = [
    { id: 1, name: "Banadra", image: banadraImg, description: "Banana mix Dragon" },
    { id: 2, name: "Mango Bliss", image: mangoImg },
    { id: 3, name: "Choco Banana", image: chocoImg },
  ];

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

  // Fungsi untuk save order ke localStorage
  const handleSaveOrder = (orderDetails) => {
    // Ambil existing orders dari localStorage
    const existingOrders = JSON.parse(localStorage.getItem('smoothieOrders')) || [];
    
    // Buat order baru dengan ID unik dan timestamp
    const newOrder = {
      id: Date.now().toString(), // ID unik berdasarkan timestamp
      ...orderDetails,
      orderDate: new Date().toISOString()
    };
    
    // Tambahkan ke array orders (order terbaru di awal)
    const updatedOrders = [newOrder, ...existingOrders];
    
    // Simpan ke localStorage
    localStorage.setItem('smoothieOrders', JSON.stringify(updatedOrders));
    
    console.log('Order saved:', newOrder);
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
        // Navigasi ke halaman history
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
      />
    </div>
  )
}

export default Home