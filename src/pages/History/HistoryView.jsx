// HistoryView.jsx
import React, { useState } from 'react';

const HistoryView = ({ orders = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const ordersPerPage = 7;

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Format currency ke IDR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle expanded order
  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedOrder(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers untuk pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="font-[Poppins] flex-1 bg-white min-h-screen">
      {/* Content Container */}
      <div className="px-3 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            Riwayat Pesanan
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            {orders.length} pesanan tersimpan
            {orders.length > ordersPerPage && (
              <span className="text-gray-500">
                {' '}• Halaman {currentPage} dari {totalPages}
              </span>
            )}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              Belum Ada Pesanan
            </h3>
            <p className="text-gray-500 text-xs">
              Pesanan yang Anda buat akan muncul di sini
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {currentOrders.map((order, index) => (
                <div key={order.id || index} className="overflow-hidden">
                  {/* Order Card - Simple Version dengan Gambar */}
                  <div 
                    className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => toggleOrder(order.id || index)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Gambar Menu */}
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={order.menu?.image || '/placeholder-smoothie.png'}
                          alt={order.menu?.name || 'Smoothie'}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-smoothie.png';
                          }}
                        />
                      </div>
                      
                      {/* Info Menu */}
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                          {order.menu?.name || 'Unknown Menu'}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Total: {formatCurrency(order.totalPrice)}</span>
                          <span>Jumlah: {order.quantity}</span>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className={`transform transition-transform duration-300 ${
                        expandedOrder === (order.id || index) ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Dropdown */}
                  {expandedOrder === (order.id || index) && (
                    <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-lg p-3 animate-slideDown">
                      <div className="space-y-3">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Nama</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.name || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Kelas/Alamat</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.classAddress || '-'}
                            </p>
                          </div>
                        </div>

                        {/* Order Preferences */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Yogurt</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.yogurtOption || 'Standard'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Pembayaran</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.paymentMethod || '-'}
                            </p>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && order.notes.trim() !== '' && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Catatan</p>
                            <p className="text-sm text-gray-800 bg-white p-2 rounded border">
                              {order.notes}
                            </p>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="bg-white rounded p-2 border">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {order.quantity} × {formatCurrency(order.pricePerItem || order.totalPrice / order.quantity)}
                            </span>
                            <span className="font-bold text-gray-900">
                              = {formatCurrency(order.totalPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Order Date */}
                        <p className="text-xs text-gray-400 text-center">
                          {formatDate(order.orderDate || new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1.5 rounded text-xs transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 active:bg-yellow-600'
                  }`}
                >
                  ← Prev
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (pageNumber !== '...') {
                          handlePageChange(pageNumber);
                        }
                      }}
                      disabled={pageNumber === '...'}
                      className={`w-7 h-7 rounded text-xs transition-all ${
                        pageNumber === currentPage
                          ? 'bg-yellow-400 text-gray-900 shadow-sm'
                          : pageNumber === '...'
                          ? 'bg-transparent text-gray-400 cursor-default'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1.5 rounded text-xs transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 active:bg-yellow-600'
                  }`}
                >
                  Next →
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <p className="text-center text-xs text-gray-500 mt-3">
                Menampilkan {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} dari {orders.length} pesanan
              </p>
            )}
          </>
        )}
      </div>

      {/* Custom CSS untuk animasi */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HistoryView;