import type { PhotoName } from '@/lib/photos';

export type CaseStudy = {
  cover: PhotoName;
  // Which part of a tall cover stays in frame when it is cropped wide.
  coverPosition?: string;
  gallery: [PhotoName, PhotoName, PhotoName, PhotoName];
  challenge: string;
  approach: string;
  outcome: string;
};

// Kept in the front end so the API keeps returning exactly what content/projects.json holds.
const caseStudies: Record<string, CaseStudy> = {
  'tidewater-almanac': {
    cover: 'tidewater-cover',
    coverPosition: '50% 78%',
    gallery: ['tidewater-1', 'tidewater-2', 'tidewater-3', 'tidewater-4'],
    challenge:
      'The Port Verrin Harbour Trust had five logos, three of them painted on boats nobody could afford to repaint. It needed one mark that could sit on a bollard, a tide table and a fishing licence without looking like a corporate guest.',
    approach:
      'We spent a fortnight in the harbour office reading a century of tide tables, then photographed every mark on the sea wall. The new logo is a single line set by that morning’s high water, drawn automatically and published at dawn.',
    outcome:
      'The identity now runs across 340 assets, from pontoon signs to the annual report. Harbour staff check the day’s logo the way they once checked the barometer.',
  },
  'saltgrass-ferments': {
    cover: 'saltgrass-cover',
    gallery: ['saltgrass-1', 'saltgrass-2', 'saltgrass-3', 'saltgrass-4'],
    challenge:
      'Saltgrass made forty ferments and sold them under forty unrelated labels, each designed the week the batch was ready. Shops shelved them at random, and regulars could not find last month’s favourite.',
    approach:
      'We built one label system around a calendar of colours, so every jar carries the colour of the week it was started. Type sizes were fixed first, on real jars in a real fridge, before any colour was chosen.',
    outcome:
      'Reorders from independent grocers rose by a third in the first year. Customers now ask for a jar by its colour, and the makers print new labels in-house from one template.',
  },
  'low-tide-sound': {
    cover: 'lowtide-cover',
    gallery: ['lowtide-1', 'lowtide-2', 'lowtide-3', 'lowtide-4'],
    challenge:
      'The festival happens on a beach that appears for three nights a year, on dates the sea decides. Posters printed months ahead could not promise anything, so the campaign had to sell the uncertainty.',
    approach:
      'We printed each edition in step with the tide chart, adding one band of ink for every metre the water fell. Crews pasted them along the seafront and pulled them down as soon as the tide came back.',
    outcome:
      'All three nights sold out eleven days early. People photographed the posters before they vanished, which carried the festival further than two years of paid advertising had.',
  },
  'hollow-oak-press': {
    cover: 'hollow-oak-cover',
    gallery: ['hollow-oak-1', 'hollow-oak-2', 'hollow-oak-3', 'hollow-oak-4'],
    challenge:
      'Sixty years of translated poetry had been published in sixty years of styles. Booksellers could not shelve the list as a list, and new readers had no idea the titles came from the same small press.',
    approach:
      'We drew one strict grid and allowed two weights of type, then tested it on the longest and shortest poems in the catalogue. Each translator’s name now sits beside the poet’s, at the same size, on every cover.',
    outcome:
      'Forty backlist titles have been reissued so far. Three independent bookshops now give the press its own shelf, and the first run of the series sold out in a season.',
  },
  'ferrous-archive': {
    cover: 'ferrous-cover',
    gallery: ['ferrous-1', 'ferrous-2', 'ferrous-3', 'ferrous-4'],
    challenge:
      'The Aldermoor Foundry Museum held nine thousand drawings in plan chests, catalogued only by date and job number. Researchers needed a member of staff to find anything, and the public could not see them at all.',
    approach:
      'We scanned the collection and traced the outline of every casting, so that shape itself became a way to search. Visitors sketch a curve on a phone or a gallery table, and the archive returns the nearest match.',
    outcome:
      'The archive logged sixty thousand searches in its first year. A retired pattern maker used it to identify an unlabelled bridge bracket in under a minute.',
  },
  'night-ferry': {
    cover: 'night-ferry-cover',
    coverPosition: '50% 58%',
    gallery: ['night-ferry-1', 'night-ferry-2', 'night-ferry-3', 'night-ferry-4'],
    challenge:
      'Verrin Sound Crossings runs most of its sailings after dark, and its signs had been designed in an office in daylight. Drivers missed lanes on the ramp, and crew spent every crossing waving torches.',
    approach:
      'We took prototypes on deck in rain and low light, then cut the numerals wider until they read from a moving car. Every sign was tested at ramp speed with the wipers on.',
    outcome:
      'Loading times fell by nine minutes a sailing in the first winter. The crews have put the torches away, and the numerals are being rolled out across the other piers on the sound.',
  },
};

export const caseStudyFor = (slug: string): CaseStudy | undefined => caseStudies[slug];
