export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  icon?: string; // Optional icon name for Lucide or other libraries
}

export const PREDEFINED_CATEGORIES: CategoryDefinition[] = [
  {
    name: 'Food & Dining',
    slug: 'food-dining',
    description: 'Restaurants, Cafes, Quick Bites, and Brunches.',
    icon: 'Utensils',
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Spas, Salons, Laser Clinics, and Massages.',
    icon: 'Sparkles',
  },
  {
    name: 'Leisure & Attractions',
    slug: 'leisure-attractions',
    description: 'Theme Parks, Museums, Desert Safaris, and Tours.',
    icon: 'Palmtree',
  },
  {
    name: 'Staycations & Travel',
    slug: 'staycations-travel',
    description: 'Hotels, Resorts, and Holiday Packages.',
    icon: 'Hotel',
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    description: 'Gyms, Yoga Studios, Clinics, and Sports Clubs.',
    icon: 'Dumbbell',
  },
  {
    name: 'Shopping & Fashion',
    slug: 'shopping-fashion',
    description: 'Clothing, Accessories, Footwear, and Jewelry.',
    icon: 'ShoppingBag',
  },
  {
    name: 'Grocery & Essentials',
    slug: 'grocery-essentials',
    description: 'Supermarkets, Specialty food stores, and Pharmacies.',
    icon: 'ShoppingCart',
  },
  {
    name: 'Electronics & Tech',
    slug: 'electronics-tech',
    description: 'Gadgets, Mobile Phones, and Computing.',
    icon: 'Smartphone',
  },
  {
    name: 'Home & Maintenance',
    slug: 'home-maintenance',
    description: 'Interior Design, Cleaning Services, and Repairs.',
    icon: 'Home',
  },
  {
    name: 'Auto & Transport',
    slug: 'auto-transport',
    description: 'Car Wash, Servicing, and Rentals.',
    icon: 'Car',
  },
  {
    name: 'Kids & Family',
    slug: 'kids-family',
    description: 'Indoor Play Areas, Educational Activities, and Kids\' Events.',
    icon: 'Baby',
  },
  {
    name: 'Nightlife & Entertainment',
    slug: 'nightlife-entertainment',
    description: 'Bars, Clubs, Concerts, and Live Shows.',
    icon: 'Music',
  },
  {
    name: 'Sports & Adventure',
    slug: 'sports-adventure',
    description: 'Golf, Padel, Skydiving, and Water Sports.',
    icon: 'Trophy',
  },
  {
    name: 'Education & Learning',
    slug: 'education-learning',
    description: 'Workshops, Short Courses, and Skill Classes.',
    icon: 'GraduationCap',
  },
  {
    name: 'Local Services',
    slug: 'local-services',
    description: 'Laundry, Pet Care, and Photography.',
    icon: 'UserCheck',
  },
];
