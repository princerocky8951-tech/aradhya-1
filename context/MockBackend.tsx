
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking, MediaItem, BookingStatus, User, HomeConfig, AboutConfig, ServicesConfig, MediaCategory } from '../types';
import { useAuth } from './AuthContext';
import { HOME_ASSETS, SACRED_GALLERY } from '../mediaData';
import api from '../api/axios';

// --- DEFAULTS ---
const DEFAULT_HOME_CONFIG: HomeConfig = {
  heroTagline: 'Obedience • Sacrifice • Silence',
  heroTitleLine1: 'Goddess',
  heroTitleLine2: 'Aradhya',
  heroSubtitle: '"You are not here to negotiate. You are here to submit. My word is your only law."',
  heroBanner: HOME_ASSETS.heroBanner,
  covenantTitle: 'The Covenant of Reality',
  covenantParagraphs: [
    'Do not mistake this for a game. When you enter my dominion in Hyderabad, Bangalore, or Vizag, you leave your rights at the door.',
    'I do not require your understanding, only your compliance. I am everything, and you are nothing.'
  ],
  servicesTitle: 'Instruments of Control',
  servicesSubtitle: 'Hyderabad • Bangalore • Vizag',
  services: HOME_ASSETS.services,
  videoSectionTitle: 'Cinematic Short',
  videoUrl: HOME_ASSETS.videoUrl,
  videoThumb: HOME_ASSETS.videoThumb,
  videoMistressTag: '@MistressAradhya',
  videoMistressDesc: 'Experience the absolute peak of digital dominance. Secure and exclusive content for the devoted.'
};

const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  title: 'About The Goddess',
  profileImage: 'https://raw.githubusercontent.com/princerocky8951-tech/aradhya/refs/heads/main/public/about.png',
  paragraphs: [
    'I am Goddess Aradhya, a Mistress of the psychological and physical arts of BDSM. My approach is strict yet nurturing, demanding nothing less than your total surrender.',
    'With years of experience in the lifestyle, I curate sessions that explore the boundaries of pain, pleasure, and servitude.',
    'I specialize in sensation play, psychological dominance, and ritualistic service.'
  ],
  values: ['Safe, Sane, Consensual', 'Absolute Discretion', 'Psychological Depth', 'Ritualistic Discipline']
};

const DEFAULT_SERVICES_CONFIG: ServicesConfig = {
  title: 'Sacred Offerings',
  subtitle: 'Hyderabad • Bangalore • Vizag',
  mainDescription: 'Choose your path of surrender. My dungeon offers a variety of ways to break you. Do not ask for the cost; if you have to ask, you cannot afford my attention.',
  servicesList: [
    { title: "Foot Worship & Trampling", description: "Your existence is beneath me. Literally. In my private dungeons across Hyderabad and Bangalore, you will serve as the carpet I walk upon." },
    { title: "Nipple & Genital Torture", description: "I delight in the sounds of your suffering. Using precision instruments, electricity, and hot wax, I will push your threshold of pain." }
  ],
  footerTitle: 'Have a specific fetish not listed?',
  footerDescription: 'I am open to discussing custom scenarios, provided they meet my standards of intensity and safety.'
};

interface DataContextType {
  media: MediaItem[];
  bookings: Booking[];
  users: User[];
  homeConfig: HomeConfig | null;
  aboutConfig: AboutConfig | null;
  servicesConfig: ServicesConfig | null;
  watchHistory: string[];
  addBooking: (booking: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  addMedia: (formData: FormData, category?: MediaCategory) => Promise<MediaItem>;
  updateHomeConfig: (config: Partial<HomeConfig>) => Promise<void>;
  updateAboutConfig: (config: Partial<AboutConfig>) => Promise<void>;
  updateServicesConfig: (config: Partial<ServicesConfig>) => Promise<void>;
  addToHistory: (mediaId: string) => void;
  fetchUsers: () => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>(SACRED_GALLERY.map(m => ({ ...m, category: 'gallery' })));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [aboutConfig, setAboutConfig] = useState<AboutConfig | null>(null);
  const [servicesConfig, setServicesConfig] = useState<ServicesConfig | null>(null);
  const [watchHistory, setWatchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const cachedHome = localStorage.getItem('aradhya_home_config');
    const cachedAbout = localStorage.getItem('aradhya_about_config');
    const cachedServices = localStorage.getItem('aradhya_services_config');

    if (cachedHome) setHomeConfig(JSON.parse(cachedHome));
    if (cachedAbout) setAboutConfig(JSON.parse(cachedAbout));
    if (cachedServices) setServicesConfig(JSON.parse(cachedServices));

    fetchHomeConfig();
    fetchAboutConfig();
    fetchServicesConfig();
    
    if (isAuthenticated) {
      fetchMedia();
      fetchBookings();
      if (user?.role === 'admin') fetchUsers();
    }
    
    const savedHistory = localStorage.getItem(`history_${user?.id}`);
    if (savedHistory) setWatchHistory(JSON.parse(savedHistory));
  }, [isAuthenticated, user?.role, user?.id]);

  const fetchHomeConfig = async () => {
    try {
      const res = await api.get('/home-config');
      setHomeConfig(res.data);
      localStorage.setItem('aradhya_home_config', JSON.stringify(res.data));
    } catch (err) {
      if (!homeConfig) setHomeConfig(DEFAULT_HOME_CONFIG);
    }
  };

  const fetchAboutConfig = async () => {
    try {
      const res = await api.get('/site-config/about');
      setAboutConfig(res.data);
      localStorage.setItem('aradhya_about_config', JSON.stringify(res.data));
    } catch (err) {
      if (!aboutConfig) setAboutConfig(DEFAULT_ABOUT_CONFIG);
    }
  };

  const fetchServicesConfig = async () => {
    try {
      const res = await api.get('/site-config/services');
      setServicesConfig(res.data);
      localStorage.setItem('aradhya_services_config', JSON.stringify(res.data));
    } catch (err) {
      if (!servicesConfig) setServicesConfig(DEFAULT_SERVICES_CONFIG);
    }
  };

  const updateHomeConfig = async (newConfig: Partial<HomeConfig>) => {
    const updated = { ...homeConfig!, ...newConfig };
    setHomeConfig(updated);
    localStorage.setItem('aradhya_home_config', JSON.stringify(updated));
    try { await api.put('/home-config', newConfig); } catch (err) {}
  };

  const updateAboutConfig = async (newConfig: Partial<AboutConfig>) => {
    const updated = { ...aboutConfig!, ...newConfig };
    setAboutConfig(updated);
    localStorage.setItem('aradhya_about_config', JSON.stringify(updated));
    try { await api.put('/site-config/about', newConfig); } catch (err) {}
  };

  const updateServicesConfig = async (newConfig: Partial<ServicesConfig>) => {
    const updated = { ...servicesConfig!, ...newConfig };
    setServicesConfig(updated);
    localStorage.setItem('aradhya_services_config', JSON.stringify(updated));
    try { await api.put('/site-config/services', newConfig); } catch (err) {}
  };

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      const transformedMedia = res.data.map((m: any) => ({
        ...m,
        id: m._id,
        url: m.cloudinaryUrl,
        category: m.category || 'gallery'
      }));
      setMedia(transformedMedia);
    } catch (err) {
      console.error('Failed to fetch media');
    }
  };

  const addToHistory = (mediaId: string) => {
    if (!user) return;
    setWatchHistory(prev => {
      const filtered = prev.filter(id => id !== mediaId);
      const newHistory = [mediaId, ...filtered].slice(0, 10);
      localStorage.setItem(`history_${user.id}`, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.map((b: any) => ({ ...b, id: b._id })));
    } catch (err) {}
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.map((u: any) => ({ ...u, id: u._id })));
    } catch (err) {}
  };

  const suspendUser = async (id: string) => {
    try {
      await api.put(`/auth/users/${id}/suspend`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isSuspended: !u.isSuspended } : u));
    } catch (err) {}
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Purge this identity?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {}
  };

  const addBooking = async (bookingData: Partial<Booking>) => {
    setLoading(true);
    try {
      const res = await api.post('/bookings', bookingData);
      setBookings(prev => [{ ...res.data, id: res.data._id }, ...prev]);
    } catch (err) {
      const mockBooking = { ...bookingData, id: 'mock_' + Math.random(), status: BookingStatus.PENDING, createdAt: new Date().toISOString() } as Booking;
      setBookings(prev => [mockBooking, ...prev]);
    } finally { setLoading(false); }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {}
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Purge petition?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {}
  };

  const deleteMedia = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/media/${id}`);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {} finally { setLoading(false); }
  };

  const addMedia = async (formData: FormData, category: MediaCategory = 'gallery'): Promise<MediaItem> => {
    setLoading(true);
    try {
      // Append category to the form data so the backend can store it
      if (!formData.has('category')) {
        formData.append('category', category);
      }
      
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newItem = { ...res.data, id: res.data._id, url: res.data.cloudinaryUrl, category: res.data.category || category };
      setMedia(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw new Error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      media, bookings, users, homeConfig, aboutConfig, servicesConfig, watchHistory, addBooking, updateBookingStatus, deleteBooking,
      deleteMedia, addMedia, updateHomeConfig, updateAboutConfig, updateServicesConfig, addToHistory, fetchUsers, suspendUser, deleteUser, loading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
