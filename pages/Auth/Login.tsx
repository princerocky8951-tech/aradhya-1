import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ShieldCheck, ArrowLeft, KeyRound, RefreshCw, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { login, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setStep('otp');
      setResendTimer(30);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(otp);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    try {
      await resendOtp();
      setResendTimer(60);
      setOtp('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-crimson-950/30 border border-crimson-900/50 mb-4">
            <ShieldCheck className="w-8 h-8 text-crimson-600" />
          </div>
          <h2 className="text-3xl font-serif text-white">
            {step === 'credentials' ? 'Enter the Sanctum' : 'Verification Required'}
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            {step === 'credentials' 
              ? 'Identify yourself, devotee.' 
              : 'A secure access code has been sent to your email.'}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleLogin} className="space-y-6 bg-neutral-900/50 p-8 border border-white/5 shadow-2xl rounded-lg animate-in slide-in-from-bottom-4">
            {error && <div className="bg-red-900/30 text-red-500 p-3 rounded text-sm text-center font-medium border border-red-900/50">{error}</div>}
            <Input 
              type="email" 
              label="Email Address" 
              placeholder="devotee@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="password" 
              label="Password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                </span>
              ) : 'Initiate Access'}
            </Button>
            
            <div className="text-center text-sm text-neutral-500">
              Not yet registered? <Link to="/register" className="text-crimson-500 hover:underline">Join here</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 bg-neutral-900/50 p-8 border border-white/5 shadow-2xl rounded-lg animate-in fade-in zoom-in-95">
            {error && <div className="bg-red-900/30 text-red-500 p-3 rounded text-sm text-center font-medium border border-red-900/50">{error}</div>}
            
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 text-[10px] text-crimson-500 uppercase tracking-widest font-bold px-3 py-1 bg-crimson-950/20 border border-crimson-900/30 rounded-full">
                <Mail className="w-3 h-3" />
                <span>Email Protocol Active</span>
              </div>
            </div>

            <div className="space-y-2">
               <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">6-Digit Access Code</label>
               <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="••••••"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-crimson-900/50 text-neutral-200 pl-12 pr-4 py-4 rounded outline-none transition-all text-center tracking-[1em] font-mono text-2xl placeholder:opacity-20"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    required
                  />
               </div>
               <div className="flex justify-between items-center px-1 mt-4">
                  <button 
                    type="button" 
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${resendTimer > 0 ? 'text-neutral-700 cursor-not-allowed' : 'text-crimson-500 hover:text-crimson-400'}`}
                  >
                    {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Access Code'}
                  </button>
                  <p className="text-[9px] text-neutral-600 italic">Check console for mock code</p>
               </div>
            </div>

            <Button type="submit" fullWidth disabled={loading || otp.length < 6}>
              {loading ? 'Verifying...' : 'Unlock Sanctum'}
            </Button>

            <button 
              type="button" 
              onClick={() => setStep('credentials')}
              className="w-full flex items-center justify-center gap-2 text-xs text-neutral-600 hover:text-white transition-colors pt-2"
            >
              <ArrowLeft className="w-3 h-3" /> Change Identity
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;