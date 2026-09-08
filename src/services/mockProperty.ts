import glassPavilion from '../images/The Glass Pavilion.jpg';

/**
 * Development fixture for the property detail page.
 *
 * The REChain backend is not part of this repository, so `/property/:id` would
 * otherwise always render its error state (PropertyDetailsPage bails out early
 * when the fetch fails) and the page could not be worked on or demoed.
 *
 * Enable by setting VITE_USE_MOCK_DATA=true in .env. This is scaffolding, not a
 * feature — delete this file and the branch in `propertiesAPI.getById` once a
 * real backend is available.
 */

/**
 * Mirrors the `PropertyData` interface in PropertyDetailsPage.tsx. Duplicated
 * rather than imported because services should not depend on pages; worth
 * hoisting into a shared types module if a second consumer appears.
 */
export interface MockProperty {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string[];
  beds: number;
  baths: number;
  sqm: number;
  type: string;
  availability: string;
  description: string;
  amenities: string[];
  phone: string;
  googleMapLink?: string;
}

/** True when the app should serve fixtures instead of calling the API. */
export function isMockDataEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true';
}

export const MOCK_PROPERTY: MockProperty = {
  _id: 'mock-1',
  title: 'The Glass Pavilion',
  // "Area, City, State" — PropertyDetailsPage derives the city from the
  // second-to-last segment, so keep all three parts.
  location: 'Jardim Paulista, São Paulo, SP',
  price: 25000000,
  image: [glassPavilion],
  beds: 4,
  baths: 3,
  sqm: 420,
  type: 'Villa',
  availability: 'available',
  description:
    'A study in light and transparency, The Glass Pavilion sits on a quiet ' +
    'tree-lined street in Jardim Paulista. Floor-to-ceiling glazing wraps the ' +
    'main living volume, opening onto a landscaped courtyard and reflecting ' +
    'pool. The upper floor holds four bedrooms, each with garden views, while ' +
    'the lower level offers a media room, wine store and covered parking for ' +
    'three vehicles.',
  // Names chosen to match AMENITY_ICON_MAP in PropertyAmenities.tsx so each
  // renders with its intended icon rather than the generic fallback.
  amenities: [
    'Swimming Pool',
    'Gym',
    'Covered Parking',
    '24/7 Advanced Security',
    'Landscaped Garden',
    'Power Backup',
    'High-Speed Internet Ready',
    'Elevator',
    'Pet Friendly',
  ],
  phone: '+55 11 98765 4321',
  googleMapLink: 'https://maps.google.com/?q=Jardim+Paulista,+Sao+Paulo',
};
