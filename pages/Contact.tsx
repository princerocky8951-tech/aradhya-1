
import React, { useState } from 'react';
import { SOCIAL_ASSETS } from '../mediaData';
import { ExternalLink, Twitter, Send, Instagram, Lock, ShieldCheck, MapPin, Calendar, MessageSquare, SendHorizonal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/MockBackend';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { addBooking, loading } = useData();
  const [formData, setFormData] = useState({
    city: 'Hyderabad',
    preferredDate: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'x (twitter)': return <Twitter className="w-6 h-6" />;
      case 'telegram': return <Send className="w-6 h-6" />;
      case 'instagram': return <Instagram className="w-6 h-6" />;
      default: return <ExternalLink className="w-6 h-6" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBooking({
        ...formData,
        userId: user?.id,
        userName: user?.name,
        city: formData.city as any
      });
      setSuccess(true);
      setFormData({ city: 'Hyderabad', preferredDate: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Reach My Dominion</h1>
        <div className="w-32 h-1 bg-crimson-900 mx-auto mb-8"></div>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
          The Goddess is everywhere. Connect through the official portals to begin your journey of absolute submission. 
          Inquiries are handled with clinical discretion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Booking Form */}
        <div className="bg-neutral-900/40 border border-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-900/10 blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-crimson-600" />
            <h2 className="text-2xl font-serif text-white uppercase tracking-widest">Formal Petition</h2>
          </div>

          {!isAuthenticated ? (
            <div className="py-20 text-center space-y-6">
              <Lock className="w-12 h-12 text-neutral-700 mx-auto" />
              <p className="text-neutral-500 font-serif italic text-lg">"Unauthorized access detected. You must identify yourself before begging for an audience."</p>
              <Link to="/login" className="inline-block">
                <Button variant="primary" className="!px-10">Initiate Protocol</Button>
              </Link>
            </div>
          ) : success ? (
            <div className="py-20 text-center space-y-6 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-950/20 border border-green-900/50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif text-white">Petition Recorded</h3>
              <p className="text-neutral-400">Your request has been added to the registry. The High Priestess will review your worth in due time.</p>
              <Button variant="outline" onClick={() => setSuccess(false)}>Send Another Petition</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold">Select Sanctum</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-crimson-800" />
                    <select 
                      className="w-full bg-neutral-950 border border-white/5 text-neutral-300 pl-12 pr-4 py-4 rounded outline-none focus:border-crimson-900/50 appearance-none transition-all uppercase tracking-widest text-xs"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    >
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Vizag">Vizag</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-crimson-800" />
                    <input 
                      type="date"
                      className="w-full bg-neutral-950 border border-white/5 text-neutral-300 pl-12 pr-4 py-4 rounded outline-none focus:border-crimson-900/50 transition-all uppercase tracking-widest text-xs"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold">Nature of Submission</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-crimson-800" />
                  <textarea 
                    className="w-full bg-neutral-950 border border-white/5 text-neutral-300 pl-12 pr-4 py-4 rounded outline-none focus:border-crimson-900/50 transition-all min-h-[150px] text-sm leading-relaxed"
                    placeholder="Describe your boundaries, your desires, and why you believe you deserve the Goddess's attention..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
              </div>

              <Button type="submit" fullWidth disabled={loading} className="group/btn h-16 !text-sm">
                <span className="flex items-center justify-center gap-3">
                  {loading ? 'Transmitting...' : 'Submit to the Goddess'}
                  <SendHorizonal className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          )}
        </div>

        {/* Right: Social Portals */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif text-white mb-8 tracking-widest text-center lg:text-left">Official Portals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SOCIAL_ASSETS.map((social, index) => (
              <a 
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center bg-neutral-900/20 border border-white/5 p-8 rounded-3xl hover:bg-neutral-900/50 transition-all duration-500 hover:border-crimson-900/40"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-crimson-900/20 group-hover:border-crimson-600 transition-all duration-500 shadow-xl">
                    <img 
                      src={social.profileImg} 
                      alt={social.platform} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-crimson-900 p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                    {getIcon(social.platform)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-serif text-white group-hover:text-crimson-500 transition-colors">{social.platform}</h3>
                  <p className="text-crimson-500 font-mono text-[10px] tracking-widest font-bold uppercase">{social.username}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-crimson-950/10 border border-crimson-900/20 p-8 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
               <ShieldCheck className="w-5 h-5 text-crimson-600" />
               <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">Discretion Protocol</span>
             </div>
             <p className="text-neutral-500 text-sm italic leading-relaxed">
               "Your metadata is stripped upon receipt. Conversations are end-to-end encrypted. Discretion is not a promise; it is the foundation of our covenant."
             </p>
          </div>
        </div>
      </div>

      <div className="mt-32 text-center">
        <p className="text-neutral-600 uppercase tracking-[0.6em] text-[10px] mb-6">Verification Shield Active</p>
        <p className="text-neutral-500 font-light italic max-w-xl mx-auto text-sm leading-relaxed">
          "Do not seek me on platforms not explicitly listed here. My presence is exclusive, and my authority is singular."
        </p>
      </div>
    </div>
  );
};

export default Contact;
