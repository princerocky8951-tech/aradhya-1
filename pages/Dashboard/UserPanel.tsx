import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/MockBackend';
import { ShieldCheck, Clock, MapPin, MessageSquare, History, Settings, User as UserIcon, Lock, Save, PlusCircle, ExternalLink, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ProtectedVideo } from '../../components/ui/SecureMedia';
import { Link } from 'react-router-dom';

type DashboardTab = 'bookings' | 'history' | 'settings';

const UserPanel: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { bookings, deleteBooking, watchHistory, media } = useData();
  const [activeTab, setActiveTab] = useState<DashboardTab>('bookings');
  
  // Profile settings state
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  const myBookings = bookings.filter(b => b.userId === user?.id);
  const myHistory = media.filter(item => watchHistory.includes(item.id));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ type: '', message: '' });
    
    if (password && password !== confirmPassword) {
      setUpdateStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      await updateProfile(email, password || undefined);
      setUpdateStatus({ type: 'success', message: 'Profile updated successfully' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateStatus({ type: 'error', message: 'Failed to update profile' });
    }
  };

  const tabs = [
    { id: 'bookings', label: 'Audience Requests', icon: MessageSquare },
    { id: 'history', label: 'Watch History', icon: History },
    { id: 'settings', label: 'Sanctum Settings', icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-neutral-900 border border-white/5 p-8 rounded flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-900/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-3xl font-serif text-white mb-2">Welcome to the Sanctum</h1>
          <p className="text-neutral-500 flex items-center justify-center md:justify-start gap-2 uppercase tracking-widest text-xs">
            <ShieldCheck className="w-4 h-4 text-crimson-700" />
            Authenticated Devotee: <span className="text-neutral-300">{(user?.id || '---').slice(0, 8)}</span>
          </p>
        </div>
        <div className="relative z-10 text-center md:text-right flex flex-col items-center md:items-end gap-3">
          <div>
            <p className="text-neutral-400 font-serif text-xl italic">"{user?.name}"</p>
            <p className="text-[10px] text-neutral-600 uppercase tracking-[0.4em] mt-1">Status: Active Service</p>
          </div>
          <Link to="/contact">
            <Button variant="outline" className="!py-2 !px-4 !text-[10px]">
              <PlusCircle className="w-3 h-3 mr-2" /> New Petition
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-crimson-600 text-crimson-500 bg-crimson-900/5' 
                : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'bookings' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
               <h2 className="text-xl font-serif text-white tracking-widest uppercase">My Active Petitions</h2>
               <div className="flex items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest">
                  <span>Total: {myBookings.length}</span>
                  <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                  <span>Pending: {myBookings.filter(b => b.status === 'pending').length}</span>
               </div>
            </div>

            {myBookings.length === 0 ? (
              <div className="bg-neutral-900/30 border border-dashed border-neutral-800 p-20 text-center rounded-3xl">
                <p className="text-neutral-600 italic font-serif text-xl mb-6">"Your devotion has yet to be recorded in our registry."</p>
                <Link to="/contact">
                  <Button variant="primary">Submit First Petition</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                 {myBookings.map(b => (
                   <div key={b.id} className="group bg-neutral-900/50 border border-white/5 p-8 rounded-3xl hover:border-crimson-900/30 transition-all shadow-xl relative">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div className="space-y-4 flex-grow">
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-neutral-400">
                              <MapPin className="w-4 h-4 text-crimson-800" />
                              <span className="text-sm font-medium uppercase tracking-widest">{b.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-400">
                              <Clock className="w-4 h-4 text-crimson-800" />
                              <span className="text-sm font-medium uppercase tracking-widest">{b.preferredDate}</span>
                            </div>
                         </div>
                         <div className="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                           <MessageSquare className="w-4 h-4 text-neutral-700 mt-1 flex-shrink-0" />
                           <p className="text-neutral-500 text-sm italic font-serif leading-relaxed">
                            "{b.message}"
                           </p>
                         </div>
                       </div>
                       <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                         <div className={`px-5 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] border ${
                            b.status === 'approved' ? 'bg-green-950/20 text-green-500 border-green-900/30' :
                            b.status === 'rejected' ? 'bg-red-950/20 text-red-500 border-red-900/30' :
                            'bg-yellow-950/20 text-yellow-500 border-yellow-900/30'
                         }`}>
                           {b.status}
                         </div>
                         <p className="text-[10px] text-neutral-700 uppercase tracking-tighter">REQ-ID: {b.id.slice(-6)}</p>
                         
                         {b.status === 'pending' && (
                            <button 
                              onClick={() => deleteBooking(b.id)}
                              className="text-[9px] uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors flex items-center gap-1 mt-2"
                            >
                              <Trash2 className="w-3 h-3" /> Retract Petition
                            </button>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'history' && (
          <section className="space-y-8">
            <h2 className="text-xl font-serif text-white flex items-center gap-3 tracking-widest uppercase">
              <History className="w-5 h-5 text-crimson-600" />
              Recently Viewed Artifacts
            </h2>
            {myHistory.length === 0 ? (
              <div className="bg-neutral-900/30 border border-dashed border-neutral-800 p-20 text-center rounded-3xl">
                <p className="text-neutral-600 italic font-serif text-xl mb-6">"Your history is as empty as your worth. Visit the gallery to begin."</p>
                <Link to="/gallery">
                  <Button variant="outline">Enter Archive</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myHistory.map(item => (
                  <div key={item.id} className="bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden group hover:border-crimson-900/30 transition-all shadow-xl">
                    <div className="aspect-video bg-black relative">
                      <ProtectedVideo src={item.url} poster={item.url + "#t=0.1"} className="w-full h-full" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-serif text-lg">{item.title}</h3>
                        <Link to="/gallery" className="text-neutral-600 hover:text-white"><ExternalLink className="w-4 h-4" /></Link>
                      </div>
                      <p className="text-neutral-500 text-xs line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="max-w-2xl">
            <div className="bg-neutral-900/50 border border-white/5 p-10 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <UserIcon className="w-6 h-6 text-crimson-600" />
                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Identity Protocols</h3>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {updateStatus.message && (
                  <div className={`p-4 rounded-xl text-sm text-center font-bold ${
                    updateStatus.type === 'success' ? 'bg-green-900/20 text-green-500 border border-green-900/30' : 'bg-red-900/20 text-red-500 border border-red-900/30'
                  }`}>
                    {updateStatus.message}
                  </div>
                )}

                <Input 
                  label="Registered Identity (Email)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="!bg-black/40"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold">New Cipher (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-neutral-800 focus:border-crimson-900/50 text-neutral-200 pl-12 pr-4 py-4 rounded-xl outline-none transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold">Confirm Cipher</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input 
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-neutral-800 focus:border-crimson-900/50 text-neutral-200 pl-12 pr-4 py-4 rounded-xl outline-none transition-colors"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-600 italic text-center">Leave cipher fields blank to maintain current identity access.</p>

                <Button type="submit" fullWidth className="h-14">
                  <Save className="w-4 h-4 mr-2 inline-block" /> Update Registry Entry
                </Button>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default UserPanel;