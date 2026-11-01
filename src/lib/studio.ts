export const studio = {
  email: 'hello@northwind.example',
  address: ['14 Lantern Wharf', 'Port Verrin', 'VR2 7TD'],
  hours: [
    { days: 'Monday to Thursday', time: '09:00 to 17:30' },
    { days: 'Friday', time: '09:00 to 15:00' },
    { days: 'Weekends', time: 'Closed' },
  ],
};

export const clients = [
  'Port Verrin Harbour Trust',
  'Saltgrass Fermentory',
  'Low Tide Sound Festival',
  'Hollow Oak Press',
  'Aldermoor Foundry Museum',
  'Verrin Sound Crossings',
  'Greywake Ropeworks',
  'Atelier Sorrel',
  'Kestrel Bay Oysters',
  'The Lamplighters Guild',
];

// Real logos, stored in public/logos/. See CREDITS.md.
export const brands = [
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'Apple', logo: '/logos/apple.svg' },
  { name: 'Spotify', logo: '/logos/spotify.svg' },
  { name: 'Netflix', logo: '/logos/netflix.svg' },
  { name: 'Airbnb', logo: '/logos/airbnb.svg' },
  { name: 'Nike', logo: '/logos/nike.svg' },
  { name: 'Adidas', logo: '/logos/adidas.svg' },
  { name: 'Shopify', logo: '/logos/shopify.svg' },
  { name: 'Stripe', logo: '/logos/stripe.svg' },
  { name: 'Figma', logo: '/logos/figma.svg' },
  { name: 'Notion', logo: '/logos/notion.svg' },
  { name: 'Uber', logo: '/logos/uber.svg' },
  { name: 'Samsung', logo: '/logos/samsung.svg' },
  { name: 'Sony', logo: '/logos/sony.svg' },
  { name: 'Meta', logo: '/logos/meta.svg' },
];

export const services = [
  {
    name: 'Identity',
    text: 'Names, marks and the rules that keep them honest, built to survive a repaint, a merger or a bad photocopier.',
  },
  {
    name: 'Print and editorial',
    text: 'Books, posters, reports and anything else with a spine or a fold. We stay on press until the sheet is right.',
  },
  {
    name: 'Packaging',
    text: 'Labels and boxes tested on real shelves, in real fridges, next to the competition and under bad light.',
  },
  {
    name: 'Digital',
    text: 'Websites and archives that load on a phone on a boat. Designed and built in the same room.',
  },
];

export const process = [
  {
    name: 'Walk the site',
    text: 'We start where the work will live: the quay, the shop floor, the reading room. Briefs get better outdoors.',
  },
  {
    name: 'Draw it wrong',
    text: 'The first week is for bad ideas, made quickly and pinned up. Clients see them too, because it saves time later.',
  },
  {
    name: 'Test it in place',
    text: 'Prototypes go on deck, on shelf and on a cheap phone. If it fails in the rain, it goes back to the bench.',
  },
  {
    name: 'Hand it over',
    text: 'You get the files, the rules and a person to call. We check back after a year to see what broke.',
  },
];

export const testimonial = {
  quote:
    'We asked for a logo and got a reason to walk down to the sea wall every morning. Nobody here had ever argued about a tide table before.',
  name: 'Odile Penhallow',
  role: 'Director, Port Verrin Harbour Trust',
};

export const values = [
  {
    name: 'Read it aloud',
    text: 'Every line of every job gets spoken in the studio before it goes out. If it sounds wrong, it is wrong.',
  },
  {
    name: 'Make it physical',
    text: 'We print it, cut it, stand back from it and take it outside. Screens flatter work, and weather does not.',
  },
  {
    name: 'Say so early',
    text: 'Bad news costs less on Monday than on Friday. We tell clients what will not work as soon as we know.',
  },
];

export const numbers = [
  { value: '12', label: 'Years on the wharf' },
  { value: '86', label: 'Projects delivered' },
  { value: '41', label: 'Clients served' },
];

export const team = [
  {
    name: 'Ines Varga-Holt',
    role: 'Founder, design director',
    bio: 'Spent a decade setting type for newspapers. Still reads every line of every job aloud before it goes to print.',
    portrait: 'team-ines',
  },
  {
    name: 'Tobias Okonjo-Reyes',
    role: 'Designer, identity',
    bio: 'Draws the letters when the right ones do not exist. Keeps a drawer of failed logos and shows them to clients on purpose.',
    portrait: 'team-tobias',
  },
  {
    name: 'Maren Solvik',
    role: 'Designer, print and packaging',
    bio: 'Knows every press within a day of the studio by sound. Will drive to a mill to look at one sheet of paper.',
    portrait: 'team-maren',
  },
  {
    name: 'Dev Castellan',
    role: 'Developer',
    bio: 'The whole engineering department. Builds what the designers draw, and says so early when a drawing will not load on a phone.',
    portrait: 'team-dev',
  },
] as const;
