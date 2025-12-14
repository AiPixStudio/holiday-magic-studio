import React, { useState, useCallback, ReactNode, ErrorInfo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, Key } from 'lucide-react';

import Header from './components/Header';
import Generator from './components/Generator';
import Spinner from './components/Spinner'; 
import AuthGate from './AuthGate';
import { ReferenceImage } from './types';

// PRODUCTION CONFIGURATION
const MASTER_PASSWORD = 'Welcome2PortraitMagic';

// Declare process for environment variables
declare var process: any;

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EC] p-8 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message || "An unexpected error occurred."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- API Key Gate ---
interface ApiKeyGateProps {
  onKeySelected: () => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const [inputKey, setInputKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('GOOGLE_API_KEY');
    if (storedKey) {
      process.env.API_KEY = storedKey;
      onKeySelected();
    }
  }, [onKeySelected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!inputKey.trim()) {
      setError('Please enter your API key');
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem('GOOGLE_API_KEY', inputKey.trim());
      process.env.API_KEY = inputKey.trim();
      setTimeout(() => onKeySelected(), 100);
    } catch (err) {
      setError('Failed to save API key');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF5EC] to-[#F0EBE0] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/60">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E3CE8A] to-[#C5B075] rounded-full shadow-lg mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#565A7C] mb-2 font-['Montserrat']">Connect Your API</h1>
          <p className="text-sm text-[#565A7C]/70 font-['Montserrat']">Enter your Google AI Studio API key to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#565A7C] mb-2 uppercase tracking-wider font-['Montserrat']">
              API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-lg px-4 py-3 text-[#565A7C] focus:ring-2 focus:ring-[#E3CE8A] focus:border-[#E3CE8A] outline-none font-['Montserrat']"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E3CE8A] to-[#C5B075] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Montserrat'] uppercase tracking-wider text-sm"
          >
            {loading ? 'Connecting...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E8E1D6]">
          <p className="text-xs text-[#565A7C]/60 text-center font-['Montserrat']">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Studio Page ---
interface StudioPageProps {
  onAuthError: () => void;
}

const StudioPage: React.FC<StudioPageProps> = ({ onAuthError }) => {
  const [currentTab, setCurrentTab] = useState<'generator' | 'learning'>('generator');
  const [editorPrompt, setEditorPrompt] = useState<string | null>(null);
  const [editorReferences, setEditorReferences] = useState<ReferenceImage[]>([]);
  const [transferredImage, setTransferredImage] = useState<string | null>(null);

  const handlePromptConsumed = useCallback(() => {
    setEditorPrompt(null);
    setEditorReferences([]);
  }, []);

  const handleImageTransfer = useCallback((imageUrl: string) => {
    setTransferredImage(imageUrl);
    setCurrentTab('generator');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-white to-[#F0EBE0]">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {currentTab === 'generator' && (
          <Generator
            initialCustomPrompt={editorPrompt || undefined}
            initialReferenceImages={editorReferences.length > 0 ? editorReferences : undefined}
            onPromptConsumed={handlePromptConsumed}
            onImageTransfer={handleImageTransfer}
            onAuthError={onAuthError}
          />
        )}
      </main>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedKey = localStorage.getItem('GOOGLE_API_KEY');
    if (storedKey) {
      process.env.API_KEY = storedKey;
      setHasApiKey(true);
    }
    setLoading(false);
  }, []);

  const handleAuthError = () => {
    localStorage.removeItem('GOOGLE_API_KEY');
    setHasApiKey(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EC]">
        <Spinner />
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <ErrorBoundary>
        <AuthGate masterPassword={MASTER_PASSWORD}>
          <ApiKeyGate onKeySelected={() => setHasApiKey(true)} />
        </AuthGate>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AuthGate masterPassword={MASTER_PASSWORD}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<StudioPage onAuthError={handleAuthError} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthGate>
    </ErrorBoundary>
  );
};

export default App;
