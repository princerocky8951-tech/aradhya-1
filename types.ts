
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isSuspended?: boolean;
  createdAt: string;
  watchHistory?: string[];
}

export type MediaCategory = 'gallery' | 'home' | 'about' | 'system';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  category?: MediaCategory;
  uploadedBy: string;
  createdAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  city: 'Hyderabad' | 'Bangalore' | 'Vizag';
  preferredDate: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

export interface HomeService {
  title: string;
  desc: string;
  img: string;
}

export interface HomeConfig {
  heroTagline: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroBanner: string;
  covenantTitle: string;
  covenantParagraphs: string[];
  servicesTitle: string;
  servicesSubtitle: string;
  services: HomeService[];
  videoSectionTitle: string;
  videoUrl: string;
  videoThumb: string;
  videoMistressTag: string;
  videoMistressDesc: string;
}

export interface AboutConfig {
  title: string;
  profileImage: string;
  paragraphs: string[];
  values: string[];
}

export interface SiteService {
  title: string;
  description: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  mainDescription: string;
  servicesList: SiteService[];
  footerTitle: string;
  footerDescription: string;
}
