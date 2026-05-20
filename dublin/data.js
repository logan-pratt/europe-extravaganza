window.DUBLIN_DATA = {
  meta: {
    title: 'Dublin: Pints, Pages & Proper Craic',
    dates: 'July 3-5, 2026',
    tagline: 'From Galway rails to Dublin pints.',
    subtitle: 'A two-couple Dublin finale for Logan, Emily, Ashley, and Max: Georgian streets, real pubs, literary stops, fire-cooked dinner, and one proper trad-session memory.',
    hotel: {
      name: 'Marlin Hotel Dublin',
      area: 'St Stephen’s Green / South Great George’s Street',
      address: '11 Bow Lane East, St Stephen’s Green, Dublin 2, D02 AY81',
      link: 'https://www.marlin.com/dublin/'
    },
    arrival: {
      depart: '3:05pm',
      arrive: '5:44pm',
      from: 'Galway',
      to: 'Dublin',
      station: 'Likely Dublin Heuston',
      transfer: 'Taxi is easiest for four with luggage; Luas/taxi combo is possible if traveling light.'
    }
  },
  verdicts: [
    { status: 'Add', title: 'Friday Mister S', text: 'The best first-night fit: lively, close to Marlin, fire-cooked, and good for four.' },
    { status: 'Add', title: 'Saturday Delahunt', text: 'The romantic Dublin dinner default. Library Street is the strongest social alternative.' },
    { status: 'Protect', title: 'One Cultural Anchor', text: 'Marsh’s Library, Book of Kells, or Little Museum. One, not four.' },
    { status: 'Skip', title: 'Castle / Chester Beatty', text: 'Both are unavailable during the trip window. Do not route through Dublin Castle campus.' }
  ],
  chapters: [
    { dayId: 'fri', title: 'Arrival Glow', subtitle: 'Galway train, first pint, Mister S, music if alive', stamp: 'Train arrival' },
    { dayId: 'sat', title: 'Proper Dublin', subtitle: 'Georgian walk, literary stop, dinner, trad, late-night choices', stamp: 'Main day' },
    { dayId: 'sun', title: 'Soft Exit', subtitle: 'Coffee, one final stroll, airport buffer', stamp: 'London bound' }
  ],
  days: [
    {
      id: 'fri',
      day: 'Friday',
      date: 'July 3',
      title: 'Arrival, First Pint, Mister S, Music',
      mood: 'West-coast Ireland becomes capital-city Dublin.',
      image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1800&q=80',
      scores: { Stress: 4, Romance: 7, 'Group fun': 9, Food: 9 },
      timeline: [
        ['3:05-5:44pm', 'Train Galway → Dublin. Treat this as the opening cinematic beat, not flexible sightseeing time.'],
        ['5:44-6:20pm', 'Arrive Dublin, likely Heuston, then transfer to Marlin. Taxi is easiest for four with luggage.'],
        ['6:20-7:00pm', 'Check in / quick reset. Keep this tight and low-stress.'],
        ['7:00-7:35pm', 'First pint or micro-walk: Long Hall / Stag’s Head if tight; George’s Street Arcade → Dame Lane → Temple Bar edge if dinner is later.'],
        ['7:45-9:30pm', 'Dinner at Mister S.'],
        ['9:45pm-late', 'O’Donoghue’s if tired; Cobblestone if energized; Kehoe’s / Long Hall / Grogan’s if staying central.']
      ],
      watch: ['If transfer or check-in drags, cut the walk and protect dinner.', 'Do not route through Dublin Castle.', 'If tired, O’Donoghue’s beats a Smithfield transfer.'],
      variants: {
        low: 'Marlin → Long Hall → Mister S → Kehoe’s or O’Donoghue’s → bed.',
        rain: 'Marlin → Powerscourt Townhouse / George’s Street Arcade → Long Hall → Mister S → O’Donoghue’s.'
      },
      links: [['Marlin', 'https://www.marlin.com/dublin/'], ['Mister S', 'https://www.misters.ie/bookings'], ['O’Donoghue’s', 'https://www.odonoghues.ie/'], ['Cobblestone', 'https://www.cobblestonepub.ie/irish-traditional-music-sessions']]
    },
    {
      id: 'sat',
      day: 'Saturday',
      date: 'July 4',
      title: 'Georgian Streets, Literary Dublin, Delahunt, Trad',
      mood: 'Complete Dublin in one day without making it homework.',
      image: 'https://images.unsplash.com/photo-1564959130747-897fb406b9af?auto=format&fit=crop&w=1800&q=80',
      scores: { Stress: 5, Romance: 9, 'Group fun': 10, Food: 10 },
      timeline: [
        ['9:30am', 'Coffee / breakfast: Kaph, Tang, Beanhive, or hotel fallback.'],
        ['10:15am-12:00pm', 'Georgian + literary walk: St Stephen’s Green → Merrion Square → Oscar Wilde → Trinity exterior → Grafton Street.'],
        ['12:00-1:15pm', 'Lunch: Woollen Mills, The Bank, George’s Street, or Winding Stair.'],
        ['1:30-3:00pm', 'One cultural anchor: Marsh’s Library + St Patrick’s exterior, Book of Kells, or Little Museum.'],
        ['3:15-5:00pm', 'Neighborhood pivot: Liberties + Teeling, Smithfield/Stoneybatter, or easy central pubs.'],
        ['5:30-6:45pm', 'Pre-dinner drinks: Delahunt Sitting Room, 1661, Peruke & Periwig, Sidecar, or Fidelity if in Smithfield.'],
        ['7:30-9:45pm', 'Dinner: Delahunt default; Library Street if the group wants polished sharing-plates energy.'],
        ['10:00pm-late', 'Central pubs, O’Donoghue’s, Cobblestone/Fidelity, Whelan’s, Workman’s, Pygmalion, or Bernard Shaw depending on listings and energy.']
      ],
      watch: ['Pick one cultural anchor.', 'Use Marsh’s, Little Museum, National Gallery, MoLI, Teeling, or Winding Stair as rainy-day pivots.', 'Switch neighborhoods if pubs are packed.'],
      variants: {
        low: 'Little Museum → Kehoe’s / Grogan’s → Delahunt → O’Donoghue’s → bed.',
        rain: 'Marsh’s or Little Museum → Winding Stair → Long Hall / Palace Bar → Delahunt → Whelan’s if something good is on.'
      },
      links: [['Marsh’s Library', 'https://marshlibrary.ie/'], ['Book of Kells', 'https://www.visittrinity.ie/book-now/'], ['Little Museum', 'https://www.littlemuseum.ie/'], ['Delahunt', 'https://delahunt.ie/bookings/'], ['Library Street', 'https://www.librarystreet.ie/booking']]
    },
    {
      id: 'sun',
      day: 'Sunday',
      date: 'July 5',
      title: 'Low-Stress Departure to London',
      mood: 'Coffee, one short stroll, airport without drama.',
      image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?auto=format&fit=crop&w=1800&q=80',
      scores: { Stress: 3, Romance: 5, 'Group fun': 5, Food: 5 },
      timeline: [
        ['Morning', 'Coffee / breakfast near Marlin: Kaph, Tang, Beanhive, or hotel fallback.'],
        ['If spare', 'St Stephen’s Green, Grafton Street, or MoLI shop only. No major sights.'],
        ['2.75-3.25 hrs pre-flight', 'Leave Marlin by taxi if flying DUB → London with luggage.'],
        ['2 hrs pre-flight', 'Be at Dublin Airport for short-haul flight. Add buffer if checking bags.']
      ],
      watch: ['Do not book Guinness, Kilmainham, Howth, or a long brunch before a flight.', 'Taxi is simplest for four with luggage.'],
      variants: { low: 'Hotel breakfast → taxi → airport.', rain: 'Hotel coffee → taxi → airport.' },
      links: [['Airport timing', 'https://www.dublinairport.com/at-the-airport/check-in'], ['Taxi', 'https://www.dublinairport.com/to-from-the-airport/by-taxi'], ['Dublin Express', 'https://www.dublinexpress.ie/dublin-airport']]
    }
  ],
  paths: [
    {
      id: 'pints-pages',
      name: 'Pints, Pages & Proper Dublin',
      badge: 'Recommended default',
      best: 'This exact group: literary streets, real pubs, one cultural anchor, one excellent dinner, one trad session.',
      scores: { Stress: 3, Romance: 8, 'Group fun': 9, Atmosphere: 10, 'Food/drink': 9, Logistics: 8 },
      includes: ['Georgian walk', 'Marsh’s or Book of Kells', 'Delahunt / Library Street', 'Cobblestone or O’Donoghue’s'],
      cuts: ['Howth', 'Guinness unless must-do', 'Dublin Castle', 'Chester Beatty', 'long museums'],
      why: 'It captures Dublin as a living city: pubs, stories, streets, music, and food.',
      tradeoff: 'You will not see every famous attraction.'
    },
    {
      id: 'foodie-romantic',
      name: 'Foodie & Romantic Dublin',
      badge: 'Best date-night version',
      best: 'A more polished, candlelit, restaurant-forward Dublin.',
      scores: { Stress: 5, Romance: 10, 'Group fun': 7, Atmosphere: 8, 'Food/drink': 10, Logistics: 8 },
      includes: ['MoLI / Iveagh', 'cocktail bar', 'Delahunt or Etto', 'Palace Bar nightcap'],
      cuts: ['big trad adventure', 'Smithfield crawl'],
      why: 'It feels special and adult without becoming precious.',
      tradeoff: 'Less raw pub/trad energy.'
    },
    {
      id: 'pub-trad-social',
      name: 'Pub / Trad / Social Dublin',
      badge: 'Most fun',
      best: 'The group that wants the night to become the memory.',
      scores: { Stress: 6, Romance: 6, 'Group fun': 10, Atmosphere: 10, 'Food/drink': 8, Logistics: 7 },
      includes: ['Long Hall', 'Kehoe’s', 'Palace Bar', 'Cobblestone', 'Fidelity / Whelan’s'],
      cuts: ['Trinity interior', 'cathedrals', 'formal dinner if necessary'],
      why: 'Dublin is one of the world’s great pub cities; this leans in.',
      tradeoff: 'Less cultural structure.'
    },
    {
      id: 'hidden-neighborhoods',
      name: 'Hidden Neighborhoods + Low Tourist Density',
      badge: 'Least touristy',
      best: 'Avoiding checklist Dublin and finding atmosphere in side streets.',
      scores: { Stress: 6, Romance: 7, 'Group fun': 8, Atmosphere: 9, 'Food/drink': 8, Logistics: 6 },
      includes: ['Liberties', 'Marsh’s Library', 'Teeling', 'Smithfield', 'Fidelity / Bonobo'],
      cuts: ['Temple Bar emphasis', 'Trinity crowd funnel'],
      why: 'It gets beyond the obvious without leaving the city.',
      tradeoff: 'More movement and slightly less iconic first-time sightseeing.'
    }
  ],
  restaurants: [
    ['mister-s', 1, 'Mister S', 'Friday dinner', 'Add', 'Fire-cooking, lively room, near Marlin, excellent for four.', 'Book Friday prime time ahead.', 'https://www.misters.ie/bookings', 'group foodie near'],
    ['delahunt', 2, 'Delahunt', 'Saturday romantic dinner', 'Add', 'Historic Camden atmosphere, literary character, special without being stiff.', 'Book dinner for four; walk-in high tables are not the plan.', 'https://delahunt.ie/bookings/', 'romance foodie'],
    ['library-street', 3, 'Library Street', 'Saturday alternative', 'Add', 'Contemporary sharing plates, Irish seasonal food, polished social energy.', 'Small restaurant; book early.', 'https://www.librarystreet.ie/booking', 'group foodie romance'],
    ['winding-stair', 4, 'The Winding Stair', 'Literary lunch / rainy dinner', 'Add', 'Bookshop plus Irish food plus river view.', 'Reserve for dinner; lunch may be easier.', 'https://www.winding-stair.com/', 'literary rain romance'],
    ['etto', 5, 'Etto', 'Intimate backup dinner', 'Add', 'Small, excellent, Merrion Row location.', 'Book early.', 'https://www.etto.ie/reservations', 'romance foodie'],
    ['uno-mas', 6, 'Uno Mas', 'Refined wine-forward backup', 'Add', 'Strong near-Marlin backup, but not casual tapas pricing.', 'Bookings open 60 days ahead; card required; max six.', 'https://unomas.ie/reservations', 'romance foodie near'],
    ['big-fan', 7, 'Big Fan', 'Casual fun fallback', 'Add', 'Dumplings, bao, cocktails, easy group-sharing energy.', 'Book online if possible.', 'https://www.bigfan.ie/', 'group casual near'],
    ['woollen-mills', 8, 'The Woollen Mills', 'Casual lunch near Liffey', 'Add', 'Useful lunch near Ha’penny / Winding Stair zone.', 'Flexible lunch / casual booking.', 'https://thewoollenmills.com/', 'lunch casual'],
    ['fish-shop', 9, 'Fish Shop', 'Smithfield food option', 'Maybe/Add', 'Good if doing Smithfield/Cobblestone and wanting seafood nearby.', 'Check current hours.', 'https://fish-shop.ie/', 'smithfield casual'],
    ['pickle', 10, 'Pickle', 'Excellent Indian', 'Maybe', 'Strong food, but less Dublin-specific for this short plan.', 'Backup only.', 'https://www.picklerestaurant.com/', 'foodie'],
    ['pigs-ear', 11, 'The Pig’s Ear', 'Irish near Trinity', 'Maybe', 'Useful Trinity-area Irish restaurant.', 'Backup / lunch option.', 'https://www.thepigsear.ie/', 'irish'],
    ['fx-buckley', 12, 'FX Buckley', 'Steakhouse fallback', 'Maybe', 'Reliable if the group wants steak instead of chef-y planning.', 'Keep as fallback.', 'https://www.fxbuckley.ie/', 'fallback'],
    ['bank', 13, 'The Bank on College Green', 'Room / lunch / fallback', 'Maybe', 'Useful central room, better as lunch or drink fallback.', 'Do not make it the special dinner.', 'https://www.bankoncollegegreen.com/', 'lunch fallback'],
    ['variety-jones', 14, 'Variety Jones', 'Serious food', 'Maybe', 'Excellent but restrictive / expensive for this trip.', 'Only if group wants serious tasting-menu energy.', 'https://www.varietyjones.ie/', 'foodie'],
    ['chapter-one', 15, 'Chapter One', 'Formal fine dining', 'Skip', 'Objectively excellent, subjectively wrong for this short two-couple weekend.', 'Too expensive and time-consuming.', 'https://chapteronerestaurant.com/', 'skip']
  ],
  pubs: [
    ['cobblestone', 1, 'The Cobblestone', 'Best real trad session', 'Add', 'Smithfield', 'Friday sessions from 2pm through close; arrive early for musicians.', 'https://www.cobblestonepub.ie/irish-traditional-music-sessions'],
    ['long-hall', 2, 'The Long Hall', 'Best cinematic central pub', 'Add', 'South Great George’s Street', 'First-pint material near Marlin.', 'https://www.instagram.com/thelonghalldublin/'],
    ['kehoes', 3, 'Kehoe’s', 'Proper central pub', 'Add', 'South Anne Street', 'Classic Dublin pub energy, popular but worth it.', 'https://kehoesdublin.ie/'],
    ['palace-bar', 4, 'The Palace Bar', 'Temple Bar-edge literary pub', 'Add', 'Fleet Street', 'The acceptable historic edge-of-Temple-Bar stop.', 'https://www.instagram.com/thepalacebardublin/'],
    ['odonoghues', 5, 'O’Donoghue’s Merrion Row', 'Tired/central trad fallback', 'Add', 'Merrion Row', 'Live Irish music nightly; Friday from 6:30pm, Saturday from 5:30pm.', 'https://www.odonoghues.ie/'],
    ['grogans', 6, 'Grogan’s', 'Pints / toasties / people-watching', 'Add', 'South William Street', 'Classic, busy, useful central stop.', 'https://www.instagram.com/groganspubdublin/'],
    ['stag', 8, 'The Stag’s Head', 'Hidden-lane classic', 'Add', 'Dame Court', 'Useful first-evening pint near the micro-walk.', 'https://www.louisfitzgerald.com/stagshead'],
    ['fidelity', 9, 'Fidelity', 'Modern Smithfield late-night add-on', 'Add', 'Smithfield', 'Audiophile bar, craft beer, cocktails, DJs/events.', 'https://www.fidelitybar.ie/'],
    ['whelans', 13, 'Whelan’s', 'Late live music / club fallback', 'Add', 'Wexford Street', 'Best reliable late Saturday “something happening” option.', 'https://www.whelanslive.com/events/'],
    ['workmans', 14, 'Workman’s Club', 'Monitor for events', 'Maybe', 'Wellington Quay', 'Check listings closer.', 'https://theworkmansclub.com/'],
    ['pygmalion', 15, 'Pygmalion', 'Central dance/cocktail option', 'Maybe', 'South William Street', 'Can be scene-y; useful if the group wants dancing.', 'https://pyg.ie/'],
    ['bernard-shaw', 16, 'The Bernard Shaw', 'Casual group wildcard', 'Maybe', 'Drumcondra', 'Fun but less central.', 'https://thebernardshaw.com/']
  ],
  activities: [
    ['marshs-library', 'Marsh’s Library', 'Add', 'Best small, atmospheric, bookish cultural stop after Chester Beatty closure.', '€8 adult', '30-45 minutes', 'https://marshlibrary.ie/'],
    ['book-of-kells', 'Book of Kells Experience', 'Maybe/Add', 'Iconic, but Long Room is restoration-era with most books removed and Gaia present.', 'From €26 self-guided; Old Library-only may be from €19', '45-90 minutes', 'https://www.visittrinity.ie/book-now/'],
    ['little-museum', 'Little Museum of Dublin', 'Add/Maybe', 'Short, funny, guided storytelling near St Stephen’s Green.', 'Check live ticketing', '45-60 minutes', 'https://www.littlemuseum.ie/'],
    ['moli', 'MoLI', 'Maybe', 'Literary, near Iveagh Gardens; good if leaning bookish.', 'Check live ticketing', '60-90 minutes', 'https://moli.ie/'],
    ['national-gallery', 'National Gallery of Ireland', 'Rainy Add', 'Free, central, easy rainy-day backup near Merrion Square.', 'Free permanent collection', '30-75 minutes', 'https://www.nationalgallery.ie/visit-us/visitor-guide'],
    ['teeling', 'Teeling Whiskey Distillery', 'Add/Maybe', 'Best paid drinks experience if the group wants one.', '€20 / €25 / €35 tiers', '60-90 minutes', 'https://teelingdistillery.com/tasting-tours/'],
    ['guinness', 'Guinness Storehouse', 'Skip/Maybe', 'Fine attraction, wrong priority unless someone personally considers it must-do.', 'From €22', '90-150 minutes', 'https://www.guinness-storehouse.com/en/booking']
  ],
  warnings: [
    ['chester-beatty', 'Chester Beatty', 'skip', 'Closed from June 15 through end of December 2026. Remove from all rainy-day/activity recommendations.', 'https://chesterbeatty.ie/'],
    ['dublin-castle', 'Dublin Castle campus', 'skip', 'Closed to the public during the trip window; no public route through campus.', 'https://dublincastle.ie/'],
    ['guinness-warning', 'Guinness Storehouse', 'maybe', 'Skip unless someone says it is a must-do. Real pubs fit this trip better.', 'https://www.guinness-storehouse.com/en/booking'],
    ['howth-poolbeg', 'Howth / Poolbeg', 'skip', 'Wrong use of time after Cliffs/Galway/rural Ireland.', ''],
    ['hop-on-hop-off', 'Hop-on-hop-off bus', 'skip', 'Unnecessary and misaligned with the walkable city plan.', ''],
    ['long-museums', 'Long museum blocks', 'skip', 'One cultural anchor per day maximum.', '']
  ],
  events: [
    ['take-that', 'Take That + OneRepublic', 'Sat July 4, 5pm', 'Skip', 'Aviva Stadium', 'Confirmed, but it replaces the best Dublin night unless someone is a fan.', 'https://www.avivastadium.ie/whats-on/take-that-the-circus-live'],
    ['brenn', 'Brenn!', 'Sat July 4, 7pm', 'Maybe', 'Green Room at The Academy', 'Easy central show, but less Dublin-specific than pubs/trad.', 'https://www.songkick.com/concerts/43198453-brenn-at-green-room-the-academy'],
    ['cobblestone-event', 'Cobblestone sessions', 'Fri/Sat', 'Add', 'Smithfield', 'Core add; verify exact session pattern closer.', 'https://www.cobblestonepub.ie/irish-traditional-music-sessions'],
    ['odonoghues-event', 'O’Donoghue’s live music', 'Fri/Sat', 'Add', 'Merrion Row', 'Core central fallback.', 'https://www.odonoghues.ie/']
  ],
  routes: [
    { id: 'first-evening', title: 'Marlin First Evening', stops: ['Marlin', 'George’s Street Arcade', 'Dame Lane', 'Temple Bar edge', 'Ha’penny Bridge', 'Long Hall / Palace'], note: 'Do not route through Dublin Castle.' },
    { id: 'georgian', title: 'Georgian Dublin Walk', stops: ['Marlin', 'St Stephen’s Green', 'Merrion Square', 'Oscar Wilde', 'Trinity exterior', 'Grafton Street'], note: 'Best Saturday morning spine.' },
    { id: 'literary', title: 'Literary Dublin Walk', stops: ['Trinity exterior', 'Winding Stair', 'Ha’penny Bridge', 'Temple Bar edge', 'Palace Bar'], note: 'Literary, river, pubs, atmosphere.' },
    { id: 'liberties', title: 'Liberties / Historic Dublin', stops: ['Christ Church exterior', 'St Patrick’s', 'Marsh’s Library', 'Teeling', 'Liberties streets'], note: 'Best replacement for Chester Beatty / Dublin Castle.' },
    { id: 'smithfield', title: 'Smithfield / Stoneybatter Pub Route', stops: ['Taxi/Luas', 'Cobblestone', 'Walsh’s or Bonobo', 'Fidelity', 'Frank Ryan’s'], note: 'Best real music + modern Dublin route.' },
    { id: 'camden', title: 'Camden / Portobello Night Route', stops: ['Delahunt / Mister S', 'Anseo or Devitt’s', 'Whelan’s', 'Bernard Shaw / Pygmalion'], note: 'Easy from Marlin, good late-night energy.' }
  ],
  mapPins: [
    ['hotel', 'Marlin Hotel', 49, 74, '#plan'],
    ['mister-s', 'Mister S', 45, 63, '#restaurants'],
    ['delahunt', 'Delahunt', 44, 68, '#restaurants'],
    ['trinity', 'Trinity / Book of Kells', 55, 42, '#culture'],
    ['marshs', 'Marsh’s Library', 36, 50, '#culture'],
    ['green', 'St Stephen’s Green', 53, 62, '#plan'],
    ['merrion', 'Merrion Square', 67, 50, '#plan'],
    ['palace', 'Palace / Temple Bar edge', 42, 35, '#pubs'],
    ['cobblestone', 'Cobblestone / Smithfield', 24, 26, '#pubs']
  ],
  stamps: [
    ['train', 'Galway train arrival', '5:44pm Dublin begins'],
    ['first-pint', 'First Dublin pint', 'Long Hall / Kehoe’s'],
    ['mister-s', 'Mister S', 'Fire-cooked first night'],
    ['georgian', 'Georgian walk', 'Squares and green doors'],
    ['literary', 'Literary stop', 'Marsh’s / Kells / MoLI'],
    ['trad', 'Trad session', 'Cobblestone or O’Donoghue’s'],
    ['dinner', 'Saturday dinner', 'Delahunt / Library Street'],
    ['coffee', 'Final Dublin coffee', 'Before London']
  ],
  bookingTimeline: [
    ['Now / ASAP', 'Friday dinner: Mister S', 'high', ['Book Friday prime-time table for four.', 'Protect dinner even if the arrival walk shrinks.']],
    ['Now / ASAP', 'Saturday dinner', 'high', ['Book Delahunt default.', 'Hold Library Street if the group wants sharing-plates polish.']],
    ['2-4 weeks ahead', 'Cultural anchor tickets', 'medium', ['Book Book of Kells only if choosing it despite Long Room caveat.', 'Marsh’s and Little Museum are easier, but still check availability.']],
    ['2-4 weeks ahead', 'Nightlife/listings scan', 'medium', ['Check Whelan’s, Workman’s, Fidelity, RA, Dice, Eventbrite.', 'Only add a ticketed night if it does not wreck Saturday dinner/trad.']],
    ['Week of', 'Weather + closures sanity check', 'medium', ['Use rainy-day stack: Marsh’s, Little Museum, National Gallery, MoLI, Teeling, Winding Stair.', 'Confirm Dublin Castle / Chester Beatty remain unavailable.']],
    ['Sunday', 'Airport buffer', 'high', ['Taxi 2.75-3.25 hours pre-flight if luggage.', 'Be at DUB two hours pre-flight for short-haul.']]
  ],
  priceReality: [
    ['Taxi city ↔ airport', '€30-45 total', 'Yes for four with luggage', 'https://www.dublinairport.com/to-from-the-airport/by-taxi'],
    ['Dublin Express', 'From around €9pp', 'Useful if convenient', 'https://www.dublinexpress.ie/dublin-airport'],
    ['Leap 90-minute fare', '€2', 'Useful for city services', 'https://www.transportforireland.ie/fares/bus-fares/'],
    ['Book of Kells Experience', 'From €26; Old Library-only may be from €19', 'Maybe', 'https://www.visittrinity.ie/book-now/'],
    ['Marsh’s Library', '€8 adult', 'Yes', 'https://marshlibrary.ie/'],
    ['Teeling', '€20 / €25 / €35 tiers', 'Good if doing a paid drinks experience', 'https://teelingdistillery.com/tasting-tours/'],
    ['Special dinner', '€60-110pp', 'Worth it', 'https://delahunt.ie/bookings/'],
    ['Pub crawl', '€25-60pp', 'Absolutely worth it', '']
  ]
};
