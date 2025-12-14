import React, { useState, useEffect } from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
  masterPassword: string;
}

const AuthGate: React.FC<AuthGateProps> = ({ children, masterPassword }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [needsEmail, setNeedsEmail] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    const savedAuth = localStorage.getItem('aipix_auth');
    const savedEmail = localStorage.getItem('aipix_user_email');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === masterPassword) {
      setError('');
      setNeedsEmail(true);
    } else {
      setError('Invalid access code. Please check your email or contact support.');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Save authentication
    localStorage.setItem('aipix_auth', 'true');
    localStorage.setItem('aipix_user_email', userEmail);
    setIsAuthenticated(true);
    setError('');
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-white to-[#F0EBE0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(227,206,138,0.4)] p-8 border border-white/60">
          
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E3CE8A] to-[#C5B075] rounded-full shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#565A7C] font-['Montserrat'] mb-2">
              Welcome to AIpix Studio
            </h1>
            <p className="text-sm text-[#565A7C]/70 font-['Montserrat']">
              {needsEmail ? 'One more step...' : 'Enter your access code to continue'}
            </p>
          </div>

          {!needsEmail ? (
            // Password Form
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#565A7C] mb-2 uppercase tracking-wider font-['Montserrat']">
                  Access Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E3CE8A]" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your access code"
                    className="w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-lg pl-11 pr-4 py-3 text-[#565A7C] focus:ring-2 focus:ring-[#E3CE8A] focus:border-[#E3CE8A] outline-none font-['Montserrat']"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E3CE8A] to-[#C5B075] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-['Montserrat'] uppercase tracking-wider text-sm"
              >
                Continue
              </button>

              <div className="text-center pt-4 border-t border-[#E8E1D6]">
                <p className="text-xs text-[#565A7C]/60 font-['Montserrat']">
                  Access code sent to your email after purchase
                </p>
              </div>
            </form>
          ) : (
            // Email Form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#565A7C] mb-2 uppercase tracking-wider font-['Montserrat']">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-lg px-4 py-3 text-[#565A7C] focus:ring-2 focus:ring-[#E3CE8A] focus:border-[#E3CE8A] outline-none font-['Montserrat']"
                  autoFocus
                />
                <p className="mt-2 text-xs text-[#565A7C]/60 font-['Montserrat']">
                  This helps us keep your images organized and private
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E3CE8A] to-[#C5B075] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-['Montserrat'] uppercase tracking-wider text-sm"
              >
                Start Creating
              </button>
            </form>
          )}

        </div>

        {/* Support Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#565A7C]/60 font-['Montserrat']">
            Need help? Contact support at aipix.studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
