export interface Room {
  id: string;
  name: string;
  price: number; // in NGN
  description: string;
  amenities: string[];
  image: string;
  maxGuests: number;
  sizeSqM: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  roomType?: string;
  likes: number;
  isCustom?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'rooms' | 'lobby' | 'dining' | 'amenities';
}

export interface Booking {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestsCount: number;
  totalPrice: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
