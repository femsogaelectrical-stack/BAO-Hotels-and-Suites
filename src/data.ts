import { Room, Review, GalleryItem } from './types';

// 1. Import all your room images directly from your asset paths
import standardRoomImg from './assets/images/standard_room_1779356881095.png';
import deluxeSuiteImg from './assets/images/deluxe_suite_1779356898476.png';
import executiveSuiteImg from './assets/images/executive_suite_1779356918000.png';
import presidentialSuiteImg from './assets/images/presidential_suite_1779356940229.png';
import hotelLobbyImg from './assets/images/hotel_lobby_1779356860605.png';
import unnamedImg from './assets/images/unnamed.jpg';

export const HOTEL_DETAILS = {
  name: "BAO Hotels and Suites",
  rating: 3.8,
  reviewCount: 17,
  address: "Barin Epega St, Ishara 121108, Ogun State, Nigeria",
  phone: "+234 812 345 6789", 
  whatsapp: "2348123456789", 
  email: "info@baohotels.com",
  coordinates: {
    lat: 6.9942, 
    lng: 3.6895
  },
  description: "Nestled in the serene and historic town of Ishara, Ogun State, BAO Hotels and Suites is a beacon of comfort and Nigerian hospitality. Offering premium accommodations, exquisite service, and state-of-the-art facilities, we provide a relaxing haven for business travellers, executives, and families looking for premium comfort outside the bustle of Lagos.",
  amenities: [
    { name: "24/7 Uninterrupted Power", icon: "Zap" },
    { name: "Premium Security & Video Surveillance", icon: "Shield" },
    { name: "High-Speed Wi-Fi Area", icon: "Wifi" },
    { name: "Exquisite Lounge & Bar", icon: "Coffee" },
    { name: "Complimentary Fine Dining Breakfast", icon: "Utensils" },
    { name: "Laundry & Valet Services", icon: "Sparkles" },
    { name: "Executive Meeting Room", icon: "Users" },
    { name: "VIP Concierge & Room Service", icon: "PhoneCall" }
  ]
};

export const ROOMS: Room[] = [
  {
    id: "standard-room",
    name: "Standard Room",
    price: 45000,
    description: "Cozy and perfectly tailored for solo travelers or short business stays.",
    amenities: [
      "King-size Bed",
      "High-speed Wi-Fi",
      "Smart TV",
      "Working Desk",
      "24/7 Power",
      "En-suite Bathroom"
    ],
    image: standardRoomImg,
    maxGuests: 1,
    sizeSqM: 24,
    featured: true
  },
  {
    id: "deluxe-suite",
    name: "Deluxe Suite",
    price: 65000,
    description: "Extra space and enhanced comfort featuring premium interior finishes.",
    amenities: [
      "Super King Bed",
      "City View",
      "Mini-fridge",
      "Smart TV with DSTV",
      "High-speed Wi-Fi",
      "Complimentary Breakfast"
    ],
    image: deluxeSuiteImg,
    maxGuests: 2,
    sizeSqM: 36,
    featured: true
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    price: 95000,
    description: "A luxurious space designed for executives who value productivity and ultimate relaxation.",
    amenities: [
      "Separate Living Area",
      "Work Station",
      "Bath tub",
      "Mini-bar",
      "Ultra-fast Wi-Fi",
      "24/7 Room Service",
      "Complimentary Breakfast"
    ],
    image: executiveSuiteImg,
    maxGuests: 2,
    sizeSqM: 52
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    price: 15000,
    description: "The ultimate luxury experience with sprawling space, premium privacy, and top-tier amenities.",
    amenities: [
      "2 Bedrooms",
      "Private Living & Dining Area",
      "Kitchenette",
      "Master Bathroom with Jacuzzi",
      "Access to Executive Lounge",
      "VIP Concierge Service"
    ],
    image: presidentialSuiteImg,
    maxGuests: 4,
    sizeSqM: 110
  }
];

export const PRELOADED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Emeka Adesina",
    rating: 4.5,
    comment: "Very impressive and serene atmosphere. The rooms are clean, 24/7 power was fully active during my 3-day business stay. The high-speed internet let me work hassle-free.",
    date: "2026-05-10",
    roomType: "Executive Suite",
    likes: 8
  },
  {
    id: "rev-2",
    author: "Oluwaseun Banjo",
    rating: 4.0,
    comment: "Nice location in Ishara. Very secure environment and standard amenities are functional. The breakfast was exquisite and authentic. Highly recommended.",
    date: "2026-04-28",
    roomType: "Deluxe Suite",
    likes: 5
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    url: hotelLobbyImg,
    caption: "The elegant BAO lobby dressed with premium African furniture.",
    category: "lobby"
  },
  {
    id: "gal-2",
    url: standardRoomImg,
    caption: "Standard Room: Cozy & practical desk layout.",
    category: "rooms"
  },
  {
    id: "gal-3",
    url: deluxeSuiteImg,
    caption: "Deluxe Suite: Super King bed and premium finishes.",
    category: "rooms"
  },
  {
    id: "gal-4",
    url: executiveSuiteImg,
    caption: "Executive Suite: Separate workspace and sofa lounge.",
    category: "rooms"
  },
  {
    id: "gal-5",
    url: presidentialSuiteImg,
    caption: "Presidential Suite: Ultimate luxury layout.",
    category: "rooms"
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    caption: "Premium local and continental dining at the BAO Restaurant",
    category: "dining"
  },
  {
    id: "gal-7",
    url: unnamedImg, 
    caption: "Lush gardens and executive meeting lounge walkway",
    category: "amenities"
  }
];