import React from 'react';

const LoginView = ({ email, password, onEmailChange, onPasswordChange, onSubmit, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Login</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            onClick={onSubmit}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
          >
            Login
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={onRegisterClick}
            className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;