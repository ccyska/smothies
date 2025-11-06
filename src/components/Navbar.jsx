import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ logo, onNavigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const menuItems = [
    { id: 1, label: "Dashboard", target: "home" },
    { id: 2, label: "Product", target: "our-menu" },
    { id: 3, label: "History", target: "history" },
    { id: 4, label: "About", target: "footer" },
  ];

  const handleMenuItemClick = (item) => {
    console.log(`Navigating to: ${item.label}`);
    setIsDropdownOpen(false);

    // Jika target adalah history, navigasi ke /history
    if (item.target === 'history') {
      navigate('/history');
      return;
    }

    // Jika sedang di halaman history dan ingin ke home section
    if (location.pathname === '/history' && item.target !== 'history') {
      // Navigasi ke home dulu, lalu scroll
      navigate('/');
      
      // Tunggu sebentar agar halaman home ter-render
      setTimeout(() => {
        scrollToSection(item.target);
      }, 100);
      return;
    }

    // Jika sudah di home, langsung scroll
    if (onNavigate) {
      onNavigate(item.target);
    } else {
      scrollToSection(item.target);
    }
  };

  const scrollToSection = (target) => {
    let element;
    switch(target) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'footer':
        element = document.querySelector('footer');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'our-menu':
        element = document.getElementById('our-menu');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-5">
      <div className="flex items-center">
        <img
          src={logo?.image}
          alt={logo?.name || "Logo"}
          className="h-14 md:h-20 w-auto cursor-pointer"
          onClick={() => handleMenuItemClick({ label: "Dashboard", target: "home" })}
        />
      </div>

      {/* Hamburger Button dengan Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 hover:opacity-70 transition-opacity"
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-gray-800 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 rounded"></span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-200 transition-colors"
                onClick={() => handleMenuItemClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;