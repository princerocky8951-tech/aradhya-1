import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/MockBackend';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Image as ImageIcon, 
  Users as UsersIcon, 
  ClipboardList, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Plus,
  FileImage,
  X,
  UserX,
  ShieldCheck,
  Eye,
  Lock,
  ShieldAlert,
  RefreshCw,
  Layout as LayoutIcon,
  Monitor,
  Type as TypeIcon,
  Save,
  Info,
  Briefcase,
  PlaySquare,
  Activity,
  Zap,
  Fingerprint,
  PlusCircle,
  FileText,
  Video
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { BookingStatus, Booking, HomeConfig, AboutConfig, ServicesConfig, MediaCategory } from '../../types';

type Tab = 'overview' | 'media' | 'bookings' | 'users' | 'security' | 'home' | 'about' | 'services';

const AdminPanel: React.FC = () => {
  const { 
    media, bookings, users, homeConfig, aboutConfig, servicesConfig,
    updateBookingStatus, deleteBooking, deleteMedia, addMedia, 
    suspendUser, deleteUser, updateHomeConfig, updateAboutConfig, updateServicesConfig, loading: dataLoading 
  } = useData();
  const { requestPasswordUpdateOtp, verifyPasswordUpdate } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [uploadData, setUploadData] = useState({ title: '', description: '', type: 'image' as 'image' | 'video' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CMS Form States
  const [homeForm, setHomeForm] = useState<HomeConfig | null>(null);
  const [aboutForm, setAboutForm] = useState<AboutConfig | null>(null);
  const [servicesForm, setServicesForm] = useState<ServicesConfig | null>(null);
  const [cmsUpdating, setCmsUpdating] = useState(false);

  // Sync state with backend data when it arrives
  useEffect(() => {
    if (homeConfig && !homeForm) setHomeForm(homeConfig);
  }, [homeConfig]);

  useEffect(() => {
    if (aboutConfig && !aboutForm) setAboutForm(aboutConfig);
  }, [aboutConfig]);

  useEffect(() => {
    if (servicesConfig && !servicesForm) setServicesForm(servicesConfig);
  }, [servicesConfig]);

  // --- HANDLERS ---
  const handleHomeFieldChange = (field: keyof HomeConfig, value: any) => {
    if (!homeForm) return;
    setHomeForm({ ...homeForm, [field]: value });
  };

  const handleHomeServiceChange = (index: number, field: string, value: string) => {
    if (!homeForm) return;
    const newServices = [...homeForm.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setHomeForm({ ...homeForm, services: newServices });
  };

  const handleHomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeForm) return;
    setCmsUpdating(true);
    try { 
      await updateHomeConfig(homeForm); 
      alert("Home layout successfully deployed to main-frame."); 
    } catch (err) { alert("Deployment failed."); } 
    finally { setCmsUpdating(false); }
  };

  const handleHomeAssetUpload = async (field: string, index?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = field === 'videoUrl' ? 'video/*' : 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', `Architect Asset: ${field}`);
      fd.append('type', file.type.startsWith('video') ? 'video' : 'image');
      fd.append('category', 'home');
      try {
        const newItem = await addMedia(fd, 'home');
        if (typeof index === 'number') { 
          handleHomeServiceChange(index, 'img', newItem.url); 
        } else { 
          handleHomeFieldChange(field as keyof HomeConfig, newItem.url); 
        }
      } catch (err) { alert("Upload protocol failed."); }
    };
    input.click();
  };

  const handleAboutAssetUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', 'About Profile Image');
      fd.append('type', 'image');
      fd.append('category', 'about');
      try {
        const newItem = await addMedia(fd, 'about');
        if (aboutForm) setAboutForm({ ...aboutForm, profileImage: newItem.url });
      } catch (err) { alert("Upload failed."); }
    };
    input.click();
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutForm) return;
    setCmsUpdating(true);
    try { await updateAboutConfig(aboutForm); alert("Biography updated."); }
    catch (err) { alert("Update failed."); } finally { setCmsUpdating(false); }
  };

  const handleServicesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicesForm) return;
    setCmsUpdating(true);
    try { await updateServicesConfig(servicesForm); alert("Services registry updated."); }
    catch (err) { alert("Update failed."); } finally { setCmsUpdating(false); }
  };

  const handleAddSiteService = () => {
    if (!servicesForm) return;
    setServicesForm({
      ...servicesForm,
      servicesList: [...servicesForm.servicesList, { title: 'New Service', description: 'Description...' }]
    });
  };

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('type', uploadData.type);
    formData.append('file', selectedFile);
    formData.append('category', 'gallery');
    await addMedia(formData, 'gallery');
    setUploadData({ title: '', description: '', type: 'image' });
    setSelectedFile(null);
  };

  // Security Logic States
  const [securityStep, setSecurityStep] = useState<'idle' | 'otp' | 'success'>('idle');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityOtp, setSecurityOtp] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  // Security logic handlers: Request OTP for secure password rotation
  const handleRequestSecurityCode = async () => {
    setSecurityLoading(true);
    setSecurityError('');
    try {
      await requestPasswordUpdateOtp();
      setSecurityStep('otp');
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to initiate security protocol.');
    } finally {
      setSecurityLoading(false);
    }
  };

  // Security logic handlers: Verify OTP and commit new password to the registry
  const handleFinalPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSecurityError('Ciphers do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError('Cipher must be at least 8 characters.');
      return;
    }

    setSecurityLoading(true);
    setSecurityError('');
    try {
      await verifyPasswordUpdate(securityOtp, newPassword);
      setSecurityStep('success');
      setNewPassword('');
      setConfirmPassword('');
      setSecurityOtp('');
    } catch (err: any) {
      setSecurityError(err.message || 'Security update failed.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const stats = [
    { label: 'Devotees', value: users.length, icon: UsersIcon, color: 'text-blue-500' },
    { label: 'Artifacts', value: media.length, icon: ImageIcon, color: 'text-purple-500' },
    { label: 'Bookings', value: bookings.length, icon: ClipboardList, color: 'text-crimson-500' },
    { label: 'Pending', value: bookings.filter(b => b.status === BookingStatus.PENDING).length, icon: BarChart3, color: 'text-yellow-500' },
  ];

  const navigationItems = [
    { id: 'overview', label: 'Stats', icon: BarChart3 },
    { id: 'home', label: 'Home CMS', icon: LayoutIcon },
    { id: 'about', label: 'About CMS', icon: Info },
    { id: 'services', label: 'Services CMS', icon: Briefcase },
    { id: 'media', label: 'Library', icon: ImageIcon },
    { id: 'bookings', label: 'Petitions', icon: ClipboardList },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
      
      {/* SIDEBAR / TOP NAVIGATION */}
      <aside className="w-full md:w-64 space-y-2 md:sticky md:top-24 h-fit z-40">
        <div className="hidden md:block mb-8 px-4">
          <h2 className="text-xl font-serif text-white uppercase tracking-widest border-b border-crimson-900/30 pb-4">Command Center</h2>
        </div>
        
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar p-2 gap-2 bg-neutral-900/80 md:bg-transparent rounded-2xl md:rounded-none backdrop-blur-xl md:backdrop-blur-none border border-white/5 md:border-none sticky top-20 md:static shadow-2xl md:shadow-none">
          {navigationItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-crimson-950/40 border border-crimson-900/50 text-crimson-500 shadow-[0_0_20px_rgba(153,27,27,0.2)]' 
                  : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow pb-20 w-full overflow-hidden">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((s, idx) => (
                <div key={idx} className="bg-neutral-900 border border-white/5 p-4 md:p-6 rounded-3xl shadow-xl hover:border-crimson-900/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 md:p-3 rounded-xl bg-neutral-950 border border-white/5 group-hover:scale-110 transition-transform ${s.color}`}>
                      <s.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-2xl md:text-4xl font-serif text-white">{s.value}</span>
                  </div>
                  <p className="text-neutral-500 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">{s.label}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-neutral-900/50 border border-white/5 p-12 rounded-[2.5rem] text-center border-dashed">
               <Activity className="w-16 h-16 text-crimson-900 mx-auto mb-6 opacity-30 animate-pulse" />
               <h3 className="text-2xl font-serif text-white mb-2">Dominion Active</h3>
               <p className="text-neutral-500 font-serif italic max-w-sm mx-auto">The digital sanctum is synchronized across all nodes. Ready for administrative deployment.</p>
            </div>
          </div>
        )}

        {/* HOME CMS TAB - FULLY IMPLEMENTED */}
        {activeTab === 'home' && homeForm && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-10">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 md:relative z-30 bg-black/90 md:bg-transparent py-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <LayoutIcon className="w-8 h-8 text-crimson-600" />
                  <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Home Architect</h2>
                </div>
                <Button onClick={handleHomeSubmit} disabled={cmsUpdating} className="w-full sm:w-auto shadow-2xl">
                   {cmsUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Deploy Landing Page
                </Button>
             </div>

             <div className="space-y-12">
                {/* HERO SECTION */}
                <div className="bg-neutral-900 border border-white/5 p-6 md:p-10 rounded-[2rem] space-y-8">
                   <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <Monitor className="w-5 h-5 text-crimson-700" />
                      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">Hero & Identity</h3>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Banner Artifact</label>
                        <div className="relative aspect-square bg-neutral-950 rounded-3xl overflow-hidden group border border-white/5">
                            <img src={homeForm.heroBanner} className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-100" alt="" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => handleHomeAssetUpload('heroBanner')} className="p-4 bg-crimson-900 rounded-full text-white shadow-xl hover:scale-110 transition-transform"><Upload className="w-6 h-6" /></button>
                            </div>
                        </div>
                      </div>
                      <div className="lg:col-span-2 space-y-6">
                        <Input label="Tagline (Top Line)" value={homeForm.heroTagline} onChange={(e) => handleHomeFieldChange('heroTagline', e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Title Part 1" value={homeForm.heroTitleLine1} onChange={(e) => handleHomeFieldChange('heroTitleLine1', e.target.value)} />
                          <Input label="Title Part 2 (Crimson)" value={homeForm.heroTitleLine2} onChange={(e) => handleHomeFieldChange('heroTitleLine2', e.target.value)} />
                        </div>
                        <Input label="Main Subtitle / Quote" value={homeForm.heroSubtitle} onChange={(e) => handleHomeFieldChange('heroSubtitle', e.target.value)} />
                      </div>
                   </div>
                </div>

                {/* COVENANT SECTION */}
                <div className="bg-neutral-900 border border-white/5 p-6 md:p-10 rounded-[2rem] space-y-8">
                   <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <FileText className="w-5 h-5 text-crimson-700" />
                      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">The Covenant (Manifesto)</h3>
                   </div>
                   <div className="space-y-6">
                      <Input label="Section Header" value={homeForm.covenantTitle} onChange={(e) => handleHomeFieldChange('covenantTitle', e.target.value)} />
                      <div className="space-y-4">
                         <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Manifesto Paragraphs</label>
                         {homeForm.covenantParagraphs.map((para, i) => (
                           <div key={i} className="relative group">
                             <textarea 
                                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 p-4 rounded-2xl text-xs md:text-sm outline-none focus:border-crimson-900/50 transition-all min-h-[100px]" 
                                value={para} 
                                onChange={(e) => {
                                   const newP = [...homeForm.covenantParagraphs];
                                   newP[i] = e.target.value;
                                   handleHomeFieldChange('covenantParagraphs', newP);
                                }} 
                             />
                             <button onClick={() => {
                               const newP = homeForm.covenantParagraphs.filter((_, idx) => idx !== i);
                               handleHomeFieldChange('covenantParagraphs', newP);
                             }} className="absolute top-4 right-4 text-neutral-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         ))}
                         <Button variant="outline" fullWidth onClick={() => handleHomeFieldChange('covenantParagraphs', [...homeForm.covenantParagraphs, ''])} className="!py-3 border-dashed">
                           <PlusCircle className="w-4 h-4 mr-2" /> Add Paragraph
                         </Button>
                      </div>
                   </div>
                </div>

                {/* LANDING SERVICES SECTION */}
                <div className="bg-neutral-900 border border-white/5 p-6 md:p-10 rounded-[2rem] space-y-10">
                   <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <Briefcase className="w-5 h-5 text-crimson-700" />
                      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">Instruments of Control</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Input label="Services Section Title" value={homeForm.servicesTitle} onChange={(e) => handleHomeFieldChange('servicesTitle', e.target.value)} />
                     <Input label="Location Tags" value={homeForm.servicesSubtitle} onChange={(e) => handleHomeFieldChange('servicesSubtitle', e.target.value)} />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {homeForm.services.map((s, i) => (
                        <div key={i} className="bg-neutral-950 p-5 rounded-[1.5rem] border border-white/5 space-y-4 group hover:border-crimson-900/30 transition-all">
                           <div className="relative aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden shadow-inner">
                              <img src={s.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity" alt="" />
                              <button onClick={() => handleHomeAssetUpload('services', i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all"><Upload className="w-6 h-6 text-white" /></button>
                           </div>
                           <input 
                              className="w-full bg-transparent border-b border-neutral-800 text-[11px] font-bold text-white uppercase py-2 outline-none focus:border-crimson-600 transition-colors" 
                              value={s.title} 
                              onChange={(e) => handleHomeServiceChange(i, 'title', e.target.value)} 
                           />
                           <textarea 
                              className="w-full bg-transparent text-[10px] text-neutral-500 leading-relaxed outline-none resize-none min-h-[60px]" 
                              value={s.desc} 
                              onChange={(e) => handleHomeServiceChange(i, 'desc', e.target.value)} 
                           />
                        </div>
                      ))}
                   </div>
                </div>

                {/* VIDEO SECTION */}
                <div className="bg-neutral-900 border border-white/5 p-6 md:p-10 rounded-[2rem] space-y-10">
                   <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <Video className="w-5 h-5 text-crimson-700" />
                      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">Manifestation (Video)</h3>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                      <div className="space-y-6">
                        <Input label="Section Title" value={homeForm.videoSectionTitle} onChange={(e) => handleHomeFieldChange('videoSectionTitle', e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Video Artifact URL</label>
                             <div className="bg-neutral-950 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                               <span className="text-[10px] text-neutral-400 truncate max-w-[150px] font-mono">{homeForm.videoUrl}</span>
                               <button onClick={() => handleHomeAssetUpload('videoUrl')} className="text-crimson-600 hover:scale-110 transition-transform"><Upload className="w-4 h-4" /></button>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Cover Thumbnail</label>
                             <div className="bg-neutral-950 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                               <span className="text-[10px] text-neutral-400 truncate max-w-[150px] font-mono">{homeForm.videoThumb}</span>
                               <button onClick={() => handleHomeAssetUpload('videoThumb')} className="text-crimson-600 hover:scale-110 transition-transform"><Upload className="w-4 h-4" /></button>
                             </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Input label="Mistress Username Tag" value={homeForm.videoMistressTag} onChange={(e) => handleHomeFieldChange('videoMistressTag', e.target.value)} />
                           <Input label="Overlay Subtitle" value={homeForm.videoMistressDesc} onChange={(e) => handleHomeFieldChange('videoMistressDesc', e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-center bg-neutral-950/50 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                         <div className="relative aspect-[9/16] w-32 bg-neutral-900 rounded-3xl overflow-hidden border-[4px] border-neutral-800 shadow-2xl">
                           <img src={homeForm.videoThumb} className="w-full h-full object-cover opacity-60" alt="" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <PlaySquare className="w-10 h-10 text-white/40" />
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* ABOUT CMS TAB */}
        {activeTab === 'about' && aboutForm && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-serif text-white tracking-widest uppercase">About Architect</h2>
                <Button onClick={handleAboutSubmit} disabled={cmsUpdating} className="w-full sm:w-auto">
                   {cmsUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Deploy Biography
                </Button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-neutral-900 border border-white/5 p-8 rounded-[2rem] space-y-8">
                   <div className="relative aspect-square w-48 mx-auto bg-neutral-950 rounded-3xl overflow-hidden group border border-white/5 shadow-2xl">
                      <img src={aboutForm.profileImage} className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-100" />
                      <button onClick={handleAboutAssetUpload} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all"><Upload className="w-6 h-6 text-white" /></button>
                   </div>
                   <Input label="Main Biography Title" value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} />
                </div>
                <div className="bg-neutral-900 border border-white/5 p-8 rounded-[2rem] space-y-6">
                   <label className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">The Narrative</label>
                   {aboutForm.paragraphs.map((para, i) => (
                     <div key={i} className="relative group">
                        <textarea 
                           className="w-full bg-neutral-950 border border-neutral-800 text-neutral-400 p-4 rounded-2xl text-xs md:text-sm outline-none focus:border-crimson-900/40 transition-all" 
                           rows={4} 
                           value={para} 
                           onChange={(e) => {
                             const newP = [...aboutForm.paragraphs]; 
                             newP[i] = e.target.value; 
                             setAboutForm({ ...aboutForm, paragraphs: newP });
                           }} 
                        />
                        <button onClick={() => {
                          const newP = aboutForm.paragraphs.filter((_, idx) => idx !== i); 
                          setAboutForm({ ...aboutForm, paragraphs: newP });
                        }} className="absolute top-4 right-4 text-red-900 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   ))}
                   <Button variant="outline" fullWidth onClick={() => setAboutForm({ ...aboutForm, paragraphs: [...aboutForm.paragraphs, ''] })} className="!py-3 border-dashed">
                     <PlusCircle className="w-4 h-4 mr-2" /> Add Story Unit
                   </Button>
                </div>
             </div>
          </div>
        )}

        {/* SERVICES CMS TAB - RESTORED RENDERING */}
        {activeTab === 'services' && servicesForm && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-8 h-8 text-crimson-600" />
                  <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Registry Architect</h2>
                </div>
                <Button onClick={handleServicesSubmit} disabled={cmsUpdating} className="w-full sm:w-auto shadow-2xl">
                   {cmsUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Deploy Services
                </Button>
             </div>
             <div className="space-y-10">
                <div className="bg-neutral-900 border border-white/5 p-8 md:p-12 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Input label="Full Page Title" value={servicesForm.title} onChange={(e) => setServicesForm({ ...servicesForm, title: e.target.value })} />
                   <Input label="Sub-header / Locations" value={servicesForm.subtitle} onChange={(e) => setServicesForm({ ...servicesForm, subtitle: e.target.value })} />
                   <div className="col-span-2 space-y-2">
                     <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Opening Statement</label>
                     <textarea className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 p-5 rounded-3xl text-sm outline-none focus:border-crimson-900/30 transition-all" rows={4} value={servicesForm.mainDescription} onChange={(e) => setServicesForm({ ...servicesForm, mainDescription: e.target.value })} />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {servicesForm.servicesList.map((s, i) => (
                     <div key={i} className="bg-neutral-900 border border-white/5 p-8 rounded-[2rem] relative group hover:border-crimson-900/30 transition-all shadow-xl">
                        <button onClick={() => setServicesForm({ ...servicesForm, servicesList: servicesForm.servicesList.filter((_, idx) => idx !== i) })} className="absolute top-6 right-6 text-neutral-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                        <div className="flex items-center gap-3 mb-6">
                           <ShieldCheck className="w-5 h-5 text-crimson-800" />
                           <input 
                              className="w-full bg-transparent border-b border-neutral-800 text-xl font-serif text-white outline-none focus:border-crimson-600 transition-colors" 
                              value={s.title} 
                              onChange={(e) => {
                                const newList = [...servicesForm.servicesList]; newList[i].title = e.target.value; setServicesForm({ ...servicesForm, servicesList: newList });
                              }} 
                           />
                        </div>
                        <textarea 
                           className="w-full bg-transparent text-sm text-neutral-500 outline-none leading-relaxed min-h-[100px]" 
                           value={s.description} 
                           onChange={(e) => {
                             const newList = [...servicesForm.servicesList]; newList[i].description = e.target.value; setServicesForm({ ...servicesForm, servicesList: newList });
                           }} 
                        />
                     </div>
                   ))}
                   <div onClick={handleAddSiteService} className="border-2 border-dashed border-neutral-800 rounded-[2rem] flex flex-col items-center justify-center p-16 hover:border-crimson-900/40 cursor-pointer transition-all group hover:bg-neutral-900/20">
                      <PlusCircle className="w-12 h-12 text-neutral-700 group-hover:text-crimson-600 mb-4 transition-all group-hover:scale-110" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-bold group-hover:text-neutral-400">Add Service Registry Record</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* BOOKING QUEUE TAB - RESTORED RENDERING */}
        {activeTab === 'bookings' && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Petition Queue</h2>
               <div className="px-4 py-1 rounded-full bg-crimson-950/20 border border-crimson-900/30 text-[10px] text-crimson-500 font-bold uppercase tracking-widest">{bookings.length} Registered</div>
            </div>
            <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-neutral-900 shadow-2xl">
               <table className="w-full text-left">
                  <thead className="bg-black/50 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                     <tr><th className="px-8 py-5">Devotee</th><th className="px-8 py-5">Sanctum</th><th className="px-8 py-5">Protocol State</th><th className="px-8 py-5 text-right">Sanction</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center text-neutral-600 font-serif italic">No petitions pending judgment.</td></tr>
                    ) : (
                      bookings.map(b => (
                        <tr key={b.id} className="hover:bg-black/20 transition-colors group">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500 font-bold">{b.userName.charAt(0)}</div>
                                <span className="text-sm text-white font-medium">{b.userName}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-neutral-500 text-[10px] uppercase tracking-widest font-bold">{b.city}</td>
                          <td className="px-8 py-5">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                b.status === 'approved' ? 'text-green-500 border-green-900/30 bg-green-950/20' : 
                                b.status === 'rejected' ? 'text-red-500 border-red-900/30 bg-red-950/20' : 
                                'text-yellow-500 border-yellow-900/30 bg-yellow-950/20'
                             }`}>{b.status}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setSelectedBooking(b)} className="p-2 text-neutral-600 hover:text-white transition-colors"><Eye className="w-5 h-5" /></button>
                                {b.status === 'pending' && (
                                  <>
                                    <button onClick={() => updateBookingStatus(b.id, BookingStatus.APPROVED)} className="p-2 text-green-900 hover:text-green-500 transition-colors"><CheckCircle2 className="w-5 h-5" /></button>
                                    <button onClick={() => updateBookingStatus(b.id, BookingStatus.REJECTED)} className="p-2 text-red-900 hover:text-red-500 transition-colors"><XCircle className="w-5 h-5" /></button>
                                  </>
                                )}
                                <button onClick={() => deleteBooking(b.id)} className="p-2 text-neutral-800 hover:text-red-700 transition-colors"><Trash2 className="w-5 h-5" /></button>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* DEVOTEE REGISTRY TAB - RESTORED RENDERING */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Devotee Registry</h2>
            <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-neutral-900 shadow-2xl">
               <table className="w-full text-left">
                  <thead className="bg-black/50 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                     <tr><th className="px-8 py-5">Identity Cipher</th><th className="px-8 py-5">Authority Level</th><th className="px-8 py-5 text-right">Registry Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className={`hover:bg-black/20 transition-colors ${u.isSuspended ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-8 py-5">
                           <div className="flex flex-col">
                              <span className="text-sm text-white font-bold">{u.name}</span>
                              <span className="text-[10px] text-neutral-600 font-mono">{u.email}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-crimson-900/20 text-crimson-500 border border-crimson-900/30' : 'bg-neutral-800 text-neutral-500'}`}>{u.role}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-2">
                             {u.role !== 'admin' && (
                               <>
                                 <button onClick={() => suspendUser(u.id)} className={`p-3 rounded-xl transition-all ${u.isSuspended ? 'bg-green-950/20 text-green-500 border border-green-900/30' : 'bg-orange-950/20 text-orange-700 border border-orange-900/30'}`}>{u.isSuspended ? <ShieldCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}</button>
                                 <button onClick={() => deleteUser(u.id)} className="p-3 bg-neutral-950/50 rounded-xl text-neutral-800 hover:text-red-700 border border-white/5"><Trash2 className="w-5 h-5" /></button>
                               </>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* MEDIA LIBRARY TAB */}
        {activeTab === 'media' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-neutral-900 border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><ImageIcon className="w-40 h-40 text-white" /></div>
              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="p-4 bg-crimson-950/30 rounded-2xl border border-crimson-900/20"><Upload className="w-8 h-8 text-crimson-600" /></div>
                <h3 className="text-2xl font-serif text-white uppercase tracking-widest">New Archive Item</h3>
              </div>
              <form onSubmit={handleManualUpload} className="space-y-6 max-w-3xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Artifact Title" value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} required />
                  <div className="space-y-2">
                    <label className="text-neutral-400 text-[10px] uppercase tracking-widest font-bold">Modality</label>
                    <select className="w-full bg-neutral-950 border border-neutral-800 text-neutral-400 px-5 py-4 rounded-2xl text-sm outline-none appearance-none focus:border-crimson-900/40" value={uploadData.type} onChange={(e) => setUploadData({...uploadData, type: e.target.value as any})}>
                      <option value="image">Still Image Artifact</option>
                      <option value="video">Cinematic Manifestation</option>
                    </select>
                  </div>
                </div>
                <div 
                   onClick={() => fileInputRef.current?.click()} 
                   className="border-2 border-dashed border-neutral-800 rounded-[2rem] p-16 text-center cursor-pointer hover:border-crimson-900/50 transition-all group bg-neutral-950/40"
                >
                   <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                   {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileImage className="w-12 h-12 text-crimson-600 mb-2" />
                        <span className="text-white text-sm font-bold truncate max-w-md">{selectedFile.name}</span>
                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Resource Locked</span>
                      </div>
                   ) : (
                      <div className="flex flex-col items-center gap-2">
                        <PlusCircle className="w-12 h-12 text-neutral-800 group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Select Resource For Encryption</span>
                      </div>
                   )}
                </div>
                <Button type="submit" fullWidth disabled={dataLoading || !selectedFile} className="h-16 shadow-xl">
                   {dataLoading ? <RefreshCw className="w-5 h-5 animate-spin mr-3 inline" /> : null} Transmit to High Command
                </Button>
              </form>
            </div>
            
            <div className="bg-neutral-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead className="bg-black/50 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    <tr><th className="px-8 py-5">Visual</th><th className="px-8 py-5">Designation</th><th className="px-8 py-5">Category</th><th className="px-8 py-5 text-right">Sanction</th></tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {media.map(item => (
                     <tr key={item.id} className="hover:bg-black/20 transition-all text-sm">
                       <td className="px-8 py-5"><img src={item.url} className="w-12 h-12 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all" alt="" /></td>
                       <td className="px-8 py-5 text-white font-serif tracking-wide">{item.title}</td>
                       <td className="px-8 py-5"><span className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-500 bg-neutral-950 px-3 py-1 rounded-full border border-white/5">{item.category || 'gallery'}</span></td>
                       <td className="px-8 py-5 text-right"><button onClick={() => deleteMedia(item.id)} className="p-3 text-neutral-800 hover:text-red-700 transition-colors"><Trash2 className="w-5 h-5" /></button></td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 space-y-12">
             <div className="bg-neutral-900/50 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldAlert className="w-48 h-48 text-crimson-600" /></div>
                <div className="flex items-start gap-6 relative z-10">
                   <div className="p-6 bg-crimson-950/30 rounded-[2rem] border border-crimson-900/20 shadow-xl"><Lock className="w-12 h-12 text-crimson-600" /></div>
                   <div>
                      <h2 className="text-4xl font-serif text-white tracking-widest uppercase mb-2">Sanctum Vault</h2>
                      <p className="text-neutral-500 text-xs uppercase tracking-[0.4em] font-bold">High-Security Cipher Rotation</p>
                   </div>
                </div>
             </div>

             <div className="bg-neutral-900 border border-white/5 p-10 md:p-16 rounded-[3rem] shadow-2xl relative">
                {securityStep === 'idle' && (
                   <div className="text-center space-y-10">
                      <Fingerprint className="w-24 h-24 text-neutral-800 mx-auto opacity-30 animate-pulse" />
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-white tracking-widest uppercase">Rotation Protocol</h3>
                        <p className="text-neutral-500 text-sm max-w-sm mx-auto italic leading-relaxed">Identity verification is mandatory to rotate registry ciphers. This node is end-to-end encrypted.</p>
                      </div>
                      <Button fullWidth onClick={handleRequestSecurityCode} disabled={securityLoading} className="h-20 text-lg shadow-[0_0_30px_rgba(153,27,27,0.3)]">
                         {securityLoading ? 'Initiating Security Handshake...' : 'Initiate Secure Rotation Protocol'}
                      </Button>
                      {securityError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{securityError}</p>}
                   </div>
                )}

                {securityStep === 'otp' && (
                   <form onSubmit={handleFinalPasswordUpdate} className="space-y-8 animate-in slide-in-from-bottom-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input label="New Cipher String" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
                        <Input label="Confirm Cipher String" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block text-center mb-4">6-Digit Secure Access Key</label>
                         <input 
                            type="text" 
                            maxLength={6} 
                            value={securityOtp} 
                            onChange={(e) => setSecurityOtp(e.target.value.replace(/\D/g, ''))} 
                            className="w-full bg-black/60 border border-neutral-800 text-neutral-100 p-8 rounded-[2rem] text-5xl font-mono text-center outline-none focus:border-crimson-600 transition-all shadow-inner tracking-widest" 
                            placeholder="000000" 
                            required 
                         />
                      </div>
                      {securityError && <p className="text-red-500 text-center text-[10px] font-bold uppercase tracking-widest">{securityError}</p>}
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" fullWidth onClick={() => setSecurityStep('idle')} className="h-16">Abort Protocol</Button>
                        <Button type="submit" fullWidth disabled={securityLoading} className="h-16">Commit Registry Update</Button>
                      </div>
                   </form>
                )}

                {securityStep === 'success' && (
                   <div className="text-center py-20 animate-in zoom-in-95">
                      <div className="w-32 h-32 bg-green-950/20 border border-green-900/30 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                        <CheckCircle2 className="w-16 h-16" />
                      </div>
                      <h3 className="text-3xl font-serif text-white uppercase tracking-widest mb-4">Registry Updated</h3>
                      <p className="text-neutral-500 text-sm font-serif italic mb-10">Identity cipher successfully rotated in all clusters.</p>
                      <Button variant="outline" className="px-12" onClick={() => setSecurityStep('idle')}>Return to Vault</Button>
                   </div>
                )}
             </div>
          </div>
        )}
      </main>

      {/* Petition Modal Overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden p-10 md:p-16 relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-t-crimson-900/30">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-10 right-10 text-neutral-600 hover:text-white transition-all hover:scale-110"><X className="w-8 h-8" /></button>
            <div className="flex items-center gap-4 mb-10">
               <div className="w-16 h-16 rounded-[1.5rem] bg-crimson-950/30 border border-crimson-900/20 flex items-center justify-center text-3xl font-serif text-crimson-500">{selectedBooking.userName.charAt(0)}</div>
               <div>
                  <h3 className="text-3xl font-serif text-white uppercase tracking-widest">{selectedBooking.userName}</h3>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] font-bold">Formal Petition Registry</p>
               </div>
            </div>
            <div className="bg-black/40 p-10 rounded-[2.5rem] mb-12 border border-white/5 shadow-inner">
               <p className="text-neutral-400 font-serif italic text-xl leading-relaxed text-center">"{selectedBooking.message}"</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {selectedBooking.status === 'pending' && (
                <>
                  <Button fullWidth onClick={() => { updateBookingStatus(selectedBooking.id, BookingStatus.APPROVED); setSelectedBooking(null); }} className="h-16">Grant Sacred Audience</Button>
                  <Button fullWidth variant="outline" onClick={() => { updateBookingStatus(selectedBooking.id, BookingStatus.REJECTED); setSelectedBooking(null); }} className="h-16">Reject Petition</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;