import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, name, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-serif text-center mb-8 text-white">Offer Your Devotion</h2>
        <form onSubmit={handleRegister} className="space-y-6 bg-neutral-900/50 p-8 border border-white/5 shadow-2xl rounded-lg">
          {error && <div className="bg-red-900/30 text-red-500 p-3 rounded text-sm text-center">{error}</div>}
          <Input 
            type="text" 
            label="Full Name" 
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <Button type="submit" fullWidth>Register</Button>
          
          <div className="text-center text-sm text-neutral-500">
            Already devoted? <Link to="/login" className="text-crimson-500 hover:underline">Enter here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;