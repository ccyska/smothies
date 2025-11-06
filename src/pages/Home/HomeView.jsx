import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const HomeView = ({ 
  menus, 
  menuIndex, 
  setMenuIndex, 
  logo, 
  gambar, 
  logo1, 
  onNavigate,
  onBuyNow,
  showOrderForm,
  selectedMenu,
  onCloseForm,
  onSaveOrder
}) => {
  const menuContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMenuHeader, setShowMenuHeader] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // State untuk form
  const [orderData, setOrderData] = useState({
    quantity: 1,
    name: "",
    classAddress: "",
    notes: "",
    paymentMethod: "QRIS",
    yogurtOption: "TANPA YOGURT"
  });

  // State untuk validasi
  const [formErrors, setFormErrors] = useState({});

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Set Mango Bliss sebagai default hanya saat pertama kali load
  useEffect(() => {
    if (menus.length > 0 && !initialized) {
      const mangoBlissIndex = menus.findIndex(item => 
        item.name.toLowerCase().includes('mango') || 
        item.name.toLowerCase().includes('bliss')
      );
      
      const targetIndex = mangoBlissIndex !== -1 ? mangoBlissIndex : 0;
      
      setMenuIndex(targetIndex);
      setInitialized(true);
    }
  }, [menus, setMenuIndex, initialized]);

  // Auto center the selected card
  useEffect(() => {
    const timer = setTimeout(() => {
      if (menuContainerRef.current && menus[menuIndex]) {
        const container = menuContainerRef.current;
        const selectedCard = container.querySelector(
          `[data-index="${menuIndex}"]`
        );

        if (selectedCard) {
          const cardRect = selectedCard.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const cardWidth = cardRect.width;
          const containerWidth = containerRect.width;

          const scrollPosition =
            selectedCard.offsetLeft - containerWidth / 2 + cardWidth / 2;

          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [menuIndex, menus]);

  const handleCardClick = (index) => {
    setMenuIndex(index);
    setShowMenuHeader(true);
    
    setTimeout(() => {
      if (menuContainerRef.current && menus[index]) {
        const container = menuContainerRef.current;
        const selectedCard = container.querySelector(`[data-index="${index}"]`);

        if (selectedCard) {
          const cardRect = selectedCard.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const cardWidth = cardRect.width;
          const containerWidth = containerRect.width;

          const scrollPosition =
            selectedCard.offsetLeft - containerWidth / 2 + cardWidth / 2;

          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  };

  // Fungsi untuk handle form input
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear error ketika user mulai mengetik
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (type === 'number') {
      // Jika input dikosongkan, biarkan empty string sementara
      // Jika ada value, convert ke number
      const processedValue = value === '' ? '' : parseInt(value) || 1;
      
      setOrderData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Fungsi untuk validasi form
  const validateForm = () => {
    const errors = {};

    // Validasi quantity
    if (orderData.quantity === '' || orderData.quantity < 1) {
      errors.quantity = 'Jumlah harus diisi dan minimal 1';
    }

    // Validasi nama
    if (!orderData.name.trim()) {
      errors.name = 'Nama harus diisi';
    }

    // Validasi kelas/alamat
    if (!orderData.classAddress.trim()) {
      errors.classAddress = 'Kelas atau alamat harus diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Hitung total harga berdasarkan jumlah dan opsi yogurt
  const calculateTotalPrice = () => {
    const quantity = orderData.quantity === '' ? 1 : parseInt(orderData.quantity) || 1;
    const pricePerItem = orderData.yogurtOption === "DENGAN YOGURT" ? 10000 : 8000;
    return quantity * pricePerItem;
  };

  // Fungsi untuk handle submit form - SUDAH DIPERBARUI
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Validasi form sebelum submit
    if (!validateForm()) {
      alert('Harap isi semua field yang wajib diisi!');
      return;
    }
    
    // Convert quantity to number, default ke 1 jika empty
    const quantity = orderData.quantity === '' ? 1 : parseInt(orderData.quantity) || 1;
    
    // Hitung total harga
    const pricePerItem = orderData.yogurtOption === "DENGAN YOGURT" ? 10000 : 8000;
    const totalPrice = quantity * pricePerItem;
    
    const orderDetails = {
      menu: selectedMenu,
      ...orderData,
      quantity: quantity,
      pricePerItem,
      totalPrice,
      orderDate: new Date().toISOString()
    };
    
    console.log("Order Data:", orderDetails);
    
    // SIMPAN ORDER KE HISTORY
    if (onSaveOrder) {
      onSaveOrder(orderDetails);
    }
    
    // Simpan data order untuk ditampilkan di popup
    setLastOrder({
      menuName: selectedMenu.name,
      yogurtOption: orderData.yogurtOption,
      quantity: quantity,
      totalPrice: totalPrice
    });
    
    // Tampilkan popup success
    setShowSuccessPopup(true);
    
    // Reset form data setelah submit berhasil
    setOrderData({
      quantity: 1,
      name: "",
      classAddress: "",
      notes: "",
      paymentMethod: "QRIS",
      yogurtOption: "TANPA YOGURT"
    });
    
    setFormErrors({});
    
    onCloseForm();
  };

  // Fungsi untuk navigasi ke history
  const handleGoToHistory = () => {
    if (onNavigate) {
      onNavigate('history');
    }
    setShowSuccessPopup(false);
  };

  // Fungsi untuk tetap di halaman ini
  const handleStayHere = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="font-[Poppins] bg-white min-h-screen relative">
      {/* NAVBAR COMPONENT */}
      <Navbar logo={logo} onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="bg-[#FFCE48] py-6 md:py-12">
        <div className="relative">
          <div className="flex items-center justify-between px-4 md:px-6">
            <div className="text-[#8B4513] flex-1">
              <h1 className="text-2xl md:text-4xl text-left">Banana</h1>
              <h1 className="text-2xl md:text-4xl font-black underline decoration-2 md:decoration-4 text-left">
                Smoothies
              </h1>
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={gambar?.image}
                alt={gambar?.name || "Hero Image"}
                className="w-48 h-56 md:w-72 md:h-80 object-contain"
              />
            </div>

            <div className="text-[#8B4513] flex-1">
              <p className="text-3xl md:text-6xl font-black text-right">8K!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deskripsi */}
      <div className="px-4 md:px-6 mt-6 md:mt-10">
        <div className="flex flex-row justify-between items-start gap-2 md:gap-6 text-xs md:text-base text-gray-800">
          <p className="w-1/2 text-left font-semibold leading-relaxed">
            Smoothies sehat dengan beberapa
            <br />
            rasa buah segar.
          </p>
          <p className="w-1/2 text-right font-semibold leading-relaxed">
            Fresh smoothies, real fruits.
            <br />
            Best part — only 8K–10K!
          </p>
        </div>
      </div>

      {/* MENU SECTION */}
      <section id="our-menu" className="py-4 md:py-8 bg-white text-center">
        {showMenuHeader && (
          <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">Our Menu</h3>
        )}

        <div className="relative w-full">
          <div
            ref={menuContainerRef}
            className="flex items-center overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full px-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex items-center gap-3 md:gap-6 py-3 mx-auto">
              {menus.map((item, index) => (
                <div
                  key={item.id}
                  data-index={index}
                  className="flex-shrink-0 snap-center"
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className={`${
                      isMobile ? "w-56 h-64" : "w-64 h-72"
                    } flex flex-col items-center p-4 rounded-xl cursor-pointer border-2 justify-between transition-all duration-400 ease-out ${
                      index === menuIndex
                        ? "bg-white border-yellow-400 shadow-xl transform scale-105 z-10"
                        : "bg-white border-gray-200 shadow-sm transform scale-100 opacity-100"
                    }`}
                  >
                    {/* Image Container */}
                    <div className={`${
                      isMobile ? "h-32 w-32" : "h-36 w-36"
                    } flex items-center justify-center mb-2`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`${
                          isMobile ? "h-28 w-28" : "h-32 w-32"
                        } object-contain transition-transform duration-300`}
                      />
                    </div>

                    {/* Title Container */}
                    <div className={`${isMobile ? "h-14" : "h-16"} flex items-center justify-center mb-2`}>
                      <h4
                        className={`font-bold ${
                          isMobile ? "text-base" : "text-lg"
                        } text-center ${
                          index === menuIndex
                            ? "text-yellow-600"
                            : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </h4>
                    </div>

                    {/* Button - Hanya aktif ketika card dipilih */}
                    <button
                      className={`${
                        isMobile ? "w-32 py-2 text-xs" : "w-36 py-2.5 text-sm"
                      } rounded-full font-bold transition-colors shadow-md ${
                        index === menuIndex
                          ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500 active:bg-yellow-600 cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index === menuIndex) {
                          onBuyNow(item);
                        }
                      }}
                      disabled={index !== menuIndex}
                    >
                      {index === menuIndex ? "Buy Now" : "Pilih Menu"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-8">
          {menus.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === menuIndex ? "bg-yellow-500 w-8" : "bg-gray-400"
              }`}
              onClick={() => handleCardClick(index)}
              aria-label={`Go to menu ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ORDER FORM */}
      {showOrderForm && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mt-4 md:mt-8 border-2 border-yellow-400">
            <form onSubmit={handleSubmitOrder} className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pesan Menu</h2>
                <button
                  type="button"
                  onClick={onCloseForm}
                  className="text-gray-500 hover:text-gray-700 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Menu Info */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedMenu.name} 
                  {selectedMenu.description && (
                    <span className="text-gray-600 font-normal"> ({selectedMenu.description})</span>
                  )}
                </h3>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Jumlah : <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none"
                  />
                  {formErrors.quantity && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Nama : <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama"
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all outline-none"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Class/Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Kelas atau Alamat : <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="classAddress"
                    value={orderData.classAddress}
                    onChange={handleInputChange}
                    placeholder="Masukkan kelas atau alamat"
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all outline-none"
                  />
                  {formErrors.classAddress && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.classAddress}</p>
                  )}
                </div>

                {/* Yogurt Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Yogurt : <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yogurtOption"
                    value={orderData.yogurtOption}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all outline-none"
                  >
                    <option value="TANPA YOGURT">TANPA YOGURT - Rp 8.000</option>
                    <option value="DENGAN YOGURT">DENGAN YOGURT - Rp 10.000</option>
                  </select>
                </div>

                {/* Notes - Opsional */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Catatan: <span className="text-gray-500 text-xs">(opsional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    placeholder="Tambahkan catatan (opsional)"
                    rows="3"
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all resize-none outline-none"
                  />
                </div>

                {/* Divider */}
                <div className="pt-4">
                  {/* Payment Method */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      Metode Pembayaran: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="QRIS"
                          checked={orderData.paymentMethod === "QRIS"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-yellow-600 border-2 border-yellow-400 focus:ring-yellow-400 outline-none"
                        />
                        <span className="text-sm">QRIS</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CASH"
                          checked={orderData.paymentMethod === "CASH"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-yellow-600 border-2 border-yellow-400 focus:ring-yellow-400 outline-none"
                        />
                        <span className="text-sm">CASH</span>
                      </label>
                    </div>
                  </div>

                  {/* Total Price - DINAMIS */}
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-lg font-bold text-gray-900">
                      Total Pembayaran : Rp {calculateTotalPrice().toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderData.quantity} x Rp {orderData.yogurtOption === "DENGAN YOGURT" ? "10.000" : "8.000"}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 active:bg-yellow-600 transition-colors shadow-lg border-2 border-yellow-500 outline-none"
                  >
                    Buat Pesanan - Rp {calculateTotalPrice().toLocaleString('id-ID')}
                  </button>
                  
                  {/* Info required fields */}
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    <span className="text-red-500">*</span> Wajib diisi
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP - TANPA BACKDROP HITAM DAN SESUAI TEMA KUNING */}
      {showSuccessPopup && lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-yellow-400">
            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Pesanan Berhasil!
              </h2>

              {/* Order Details */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {lastOrder.menuName} ({lastOrder.yogurtOption.toLowerCase()})
                </p>
                <p className="text-gray-600">
                  Jumlah: {lastOrder.quantity}
                </p>
                <p className="text-lg font-bold text-yellow-600 mt-2">
                  Total: Rp {lastOrder.totalPrice.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Pesanan Anda telah berhasil disimpan. Anda bisa melihat riwayat pesanan di halaman History.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToHistory}
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 active:bg-yellow-600 transition-colors shadow-lg border-2 border-yellow-500"
                >
                  Lihat History
                </button>
                <button
                  onClick={handleStayHere}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 active:bg-gray-400 transition-colors border-2 border-gray-300"
                >
                  Lanjut Pesan
                </button>
              </div>

              {/* Info */}
              <p className="text-xs text-gray-500 mt-4">
                Pesanan tersimpan otomatis di riwayat
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER COMPONENT */}
      <Footer logo1={logo1} onNavigate={onNavigate} />
    </div>
  );
};

export default HomeView;