import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = ({ logo1, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (item) => {
    console.log(`Navigating to: ${item.label}`);
    
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
    <footer id="footer" className="bg-[#FFCE48] py-6 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-4 md:gap-8">
          <div className="flex-1">
            <div className="flex flex-col items-start">
              <img
                src={logo1?.image}
                alt={logo1?.name || "Footer Logo"}
                className="h-14 md:h-20 w-auto mb-3 md:mb-4"
              />
              <p className="mb-3 md:mb-6 text-xs md:text-base leading-relaxed">
                Fresh, creamy, and healthy smoothies made by students. Match
                your vibe every day at school!
              </p>
            </div>
            <div>
              <p className="font-bold mb-1 md:mb-2 text-white text-sm md:text-base">
                Main Menu
              </p>
              <ul className="space-y-1 text-xs md:text-base">
                <li 
                  className="cursor-pointer hover:underline"
                  onClick={() => handleMenuItemClick({ label: "Dashboard", target: "home" })}
                >
                  Dashboard
                </li>
                <li 
                  className="cursor-pointer hover:underline"
                  onClick={() => handleMenuItemClick({ label: "Product", target: "our-menu" })}
                >
                  Product
                </li>
                <li 
                  className="cursor-pointer hover:underline"
                  onClick={() => handleMenuItemClick({ label: "History", target: "history" })}
                >
                  History
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="mb-4 md:mb-8">
              <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-4">
                Team Members & Roles
              </h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm leading-tight">
                <li>
                  <span className="font-semibold">Aprilla Athaya Syahda</span> – Production & Promotion
                </li>
                <li>
                  <span className="font-semibold">Citra Yuriska</span> – System Analyst
                </li>
                <li>
                  <span className="font-semibold">Faldan Yudistira Elbas</span> – Graphic Design
                </li>
                <li>
                  <span className="font-semibold">Fatimah Az-Zahra</span> – Database Analyst
                </li>
                <li>
                  <span className="font-semibold">Lintang Muhamaru Putra</span> – Web Developer
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold mb-1 md:mb-3 text-white text-sm md:text-base">
                Contact Us
              </p>
              <p className="mb-1 md:mb-2 text-xs md:text-sm leading-relaxed">
                Jl. Ki Ageng Gribig No.28, Kedungkandang,
                <br />
                Malang, East Java, Indonesia
              </p>
              <p className="mb-1 md:mb-2 text-xs md:text-sm">📍 0896-8547-4545</p>
              <p className="mb-2 md:mb-4 text-xs md:text-sm">🖩 Mon – Sat: 07:00 – 15:00</p>
              <p className="text-xs md:text-sm leading-relaxed">
                Follow us on Instagram and TikTok @sm00vibe or order online at
                <br />
                www.sm00vibe.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;