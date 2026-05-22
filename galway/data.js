window.GALWAY_DATA = {
  meta: {
    title: 'Galway: Rails, Pubs & Cliffs',
    dates: 'July 2-3, 2026',
    tagline: 'Galway, with one clean Cliffs mission.',
    subtitle: 'A short west-coast Ireland chapter for Logan, Emily, Ashley, and Max: rail in, Galway night, Cliffs of Moher half-day tour, rail back to Dublin.',
    mood: 'west-coast Ireland, pub-warm, social, easy, scenic, compact, not overplanned',
    researchedAt: '2026-05-21',
    implementationNote: 'Use 1:30pm as the realistic Lally tour return anchor; do not build Friday lunch around a 1:00pm return.',
    outbound: {
      date: 'July 2, 2026',
      depart: '1:02pm',
      arrive: '3:50pm',
      from: 'Dublin',
      to: 'Galway',
      duration: '2h 48m'
    },
    return: {
      date: 'July 3, 2026',
      depart: '3:05pm',
      arrive: '5:44pm',
      from: 'Galway',
      to: 'Dublin',
      duration: '2h 39m'
    }
  },
  criticalTiming: {
    title: 'Friday timing is tighter than it first looks.',
    text: 'Lally’s half-day Cliffs tour should be treated as returning to Galway around 1:30pm, not 1:00pm. That still leaves enough time before the 3:05pm train, but only for a quick central lunch and bag pickup.',
    facts: ['7:45am HYDE meetup', '8:00am departure', '~1:30pm Galway return', '2:30pm station-minded', '3:05pm train']
  },
  quickFacts: [
    ['Rail in', 'July 2, 1:02pm-3:50pm', 'Dublin Heuston to Galway.', 'Fixed. Protect the departure and keep luggage movement simple.'],
    ['Check in / bags', 'July 2, ~4:00pm', 'Drop bags, check in, and get oriented.', 'Confirm bag plan before committing to dinner/pub timing.'],
    ['Thursday dinner', 'July 2 evening', 'Book Cava Bodega or Ard Bia as the top dinner hold.', 'Choose Cava for group energy; Ard Bia for atmosphere.'],
    ['HYDE meetup', 'July 3, 7:45am sharp', 'Outside HYDE Hotel, 10 Forster St. Look for Lally Tours blue jackets.', 'Set alarm the night before. This is the non-negotiable anchor.'],
    ['Cliffs tour', 'July 3, 8:00am-~1:30pm', 'Lally Tours Cliffs of Moher Half-Day Express.', 'Use 1:30pm as the realistic Galway return anchor.'],
    ['Friday lunch', 'July 3, ~1:30-2:30pm', 'Fast, central, low-risk lunch only.', '~95 minutes to train. No ambitious seated lunch.'],
    ['Rail out', 'July 3, 3:05pm-5:44pm', 'Galway to Dublin.', 'Fixed. Be station-minded by 2:30pm.']
  ],
  verdicts: [
    {
      status: 'Add',
      title: 'Protect the rail + Cliffs spine',
      text: 'The Galway chapter works because it has a clean structure: train west, one pub-warm Galway night, Cliffs in the morning, train back to Dublin.'
    },
    {
      status: 'Protect',
      title: 'Use 1:30pm as the realistic tour return',
      text: 'Lally’s timing points to a realistic return around 1:30pm, not 1:00pm. The lunch block should be short and central.'
    },
    {
      status: 'Add',
      title: 'Book one Thursday dinner hold',
      text: 'Cava Bodega and Ard Bia at Nimmos are the co-top dinner picks. Book one early and keep the rest of the night flexible.'
    },
    {
      status: 'Add',
      title: 'Do pubs, not a crawl',
      text: 'One trad session and one optional final pint is the right Galway night before a 7:45am tour meetup.'
    },
    {
      status: 'Skip',
      title: 'Skip big side trips',
      text: 'Aran Islands, Connemara, Salthill as a full outing, and long museum blocks do not fit this 26-hour Galway stop.'
    }
  ],
  chapters: [
    { id: 'rail-west', dayId: 'thu', title: 'Rail West', subtitle: 'Dublin train, Galway arrival, easy bags, first glimpse of the west coast city.', stamp: '1:02pm train' },
    { id: 'pub-warm-night', dayId: 'thu', title: 'Pub-Warm Night', subtitle: 'Cava or Ard Bia, then one trad session and a relaxed pint without overdoing it.', stamp: 'first Galway pint' },
    { id: 'cliffs-run', dayId: 'fri', title: 'Cliffs Run', subtitle: 'HYDE Hotel meetup, Lally Tours blue jackets, Atlantic cliffs, weather layers, back around 1:30pm.', stamp: '8:00am tour' },
    { id: 'capital-return', dayId: 'fri', title: 'Capital Return', subtitle: 'Quick lunch, bags, platform buffer, then rail back to Dublin.', stamp: '3:05pm train' }
  ],
  days: [
    {
      id: 'thu',
      day: 'Thursday',
      date: 'July 2',
      title: 'Dublin to Galway, then a pub-warm night',
      mood: 'West-coast arrival without overplanning the first night.',
      image: '../assets/galway-long-walk.jpg',
      scores: { Stress: 2, Atmosphere: 9, Logistics: 8, Flexibility: 8 },
      timeline: [
        ['1:02pm', 'Train departs Dublin for Galway.'],
        ['3:50pm', 'Arrive Galway. Get bags sorted and keep the transfer simple.'],
        ['4:30-6:00pm', 'Optional compact walk: Eyre Square to Shop Street to Latin Quarter to Spanish Arch to Long Walk.'],
        ['6:00-8:30pm', 'Dinner: Cava Bodega for group energy or Ard Bia for atmosphere.'],
        ['8:30-10:45pm', 'One trad pub: Tig Coili or Taaffes. Optional final relaxed pint at Tigh Neachtain.'],
        ['Before bed', 'Set HYDE Hotel route, alarm, layers, and rain shell for Friday morning.']
      ],
      optional: [
        'Golden-hour photo stop at Spanish Arch / Long Walk if weather is good.',
        'Taaffes early session before dinner if timing works.',
        'Skip the walk and go straight to dinner if tired or rainy.'
      ],
      watch: [
        'Do not turn Thursday into a late pub crawl.',
        'Confirm where bags are going before building the dinner flow.',
        'Keep the 7:45am HYDE meetup visible on the page.'
      ],
      variants: {
        low: 'Arrive, check in / drop bags, McDonagh’s or Merchant-style easy dinner, one pint, bed by 10:30.',
        rain: 'Taxi or shortest luggage route, indoor dinner, skip exposed Long Walk, settle into a pub earlier.',
        goodWeather: 'Do the full arrival walk to Spanish Arch / Long Walk before dinner, then one trad session.'
      },
      links: [
        ['Galway Station', 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station'],
        ['Spanish Arch', 'https://www.google.com/maps/search/?api=1&query=Spanish%20Arch%20Galway'],
        ['The Long Walk', 'https://www.google.com/maps/search/?api=1&query=The%20Long%20Walk%20Galway']
      ]
    },
    {
      id: 'fri',
      day: 'Friday',
      date: 'July 3',
      title: 'Cliffs of Moher, quick lunch, train to Dublin',
      mood: 'A clean half-day scenic mission with no logistics fog.',
      image: '../assets/galway-cliffs-of-moher.jpg',
      scores: { Stress: 4, Atmosphere: 10, Logistics: 7, Flexibility: 4 },
      timeline: [
        ['7:30am', 'Leave lodging / hotel area for HYDE Hotel unless already very close.'],
        ['7:45am', 'Arrive outside HYDE Hotel, Forster Street. Look for Lally Tours blue jackets.'],
        ['8:00am', 'Lally Tours Cliffs of Moher Half-Day Express departs.'],
        ['~1:30pm', 'Realistic Galway return anchor. Do not plan around 1:00pm.'],
        ['1:30-2:30pm', 'Quick lunch / coffee / bags / station buffer.'],
        ['2:30pm', 'Be station-minded. Start moving toward Galway Station.'],
        ['3:05pm', 'Train departs Galway for Dublin.'],
        ['5:44pm', 'Arrive Dublin.']
      ],
      optional: [
        'McDonagh’s Fish & Chips Bar if timing is okay and the group wants the classic Galway bite.',
        'Merchant Bar if logistics are tight and the group wants a sit-down option close to the station.',
        'Jungle / Little Jungle, GBC, or Esquires if the group only needs coffee/snack speed.'
      ],
      watch: [
        'Use 1:30pm as the return anchor.',
        'No long Friday afternoon plan before Dublin.',
        'If the tour is late, skip seated lunch and go straight to station-side snacks.',
        'Rain/wind are packing notes unless Lally changes the plan.'
      ],
      variants: {
        low: 'Tour, Merchant Bar or Esquires, bags, platform. Zero extra sightseeing.',
        rain: 'Tour still likely runs. Bring waterproof shell, layers, and shoes with grip. Keep post-tour plan minimal.',
        lateReturn: 'If back after 1:45pm, skip McDonagh’s and use Merchant Bar / station-side coffee / grab-and-go.'
      },
      links: [
        ['HYDE Hotel meeting point', 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'],
        ['Lally Tours Cliffs Express', 'https://lallytours.com/tour/cliffs-of-moher-half-day-express/'],
        ['Irish Rail', 'https://www.irishrail.ie/en-ie/']
      ]
    }
  ],
  paths: [
    {
      id: 'pub-warm',
      name: 'Pub-Warm Galway',
      badge: 'Thursday default',
      best: 'Dinner reservation, compact Latin Quarter walk, one trad pub, optional final pint.',
      scores: { Stress: 2, 'Group fun': 9, Atmosphere: 10, Logistics: 8 },
      includes: ['Cava Bodega or Ard Bia dinner hold.', 'Spanish Arch / Long Walk if weather is decent.', 'Taaffes or Tig Coili for trad music.', 'Early night to protect the Cliffs tour.'],
      cuts: ['Late pub crawl.', 'Salthill.', 'Crane Bar unless the group specifically wants serious trad.'],
      why: 'This maximizes Galway atmosphere without risking the 7:45am HYDE meetup.',
      tradeoff: 'You will not do everything; you will get a concentrated Galway night.'
    },
    {
      id: 'scenic-social',
      name: 'Scenic Social',
      badge: 'Best weather version',
      best: 'Good weather: arrival walk to Spanish Arch / Long Walk, Cava dinner, then Tig Coili 9:30pm session.',
      scores: { Stress: 3, 'Group fun': 10, Atmosphere: 10, Logistics: 7 },
      includes: ['Eyre Square to Shop Street to Kirwan’s Lane to Quay Street to Spanish Arch to Long Walk.', 'Cava Bodega tapas dinner.', 'Tig Coili session after dinner.', 'Optional one round at Taaffes or Tigh Neachtain.'],
      cuts: ['Salthill.', 'The Crane unless the group wants the West End detour.', 'Any late-night crawl.'],
      why: 'Evening light on the Long Walk plus a social dinner is the strongest one-night Galway version.',
      tradeoff: 'Slightly more steps than the low-energy version.'
    },
    {
      id: 'food-first',
      name: 'Food-First Galway',
      badge: 'Best dinner version',
      best: 'Book a stronger restaurant and keep pubs to one easy stop afterward.',
      scores: { Stress: 3, 'Group fun': 8, Atmosphere: 9, Logistics: 7 },
      includes: ['Ard Bia', 'Cava Bodega', 'Kai', 'Dela', 'Oscar’s Seafood Bistro'],
      cuts: ['Multiple music pubs.', 'No-reservation dinner gamble.', 'Late Crane Bar session.'],
      why: 'Galway has excellent compact dining options, especially around Spanish Arch and the West End.',
      tradeoff: 'A West End dinner adds a little walking/taxi friction from the station/HYDE side.'
    },
    {
      id: 'low-energy',
      name: 'Low-Energy Arrival',
      badge: 'Rain / tired',
      best: 'Train arrives, bags down, simple dinner, one pint, bed by 10:30.',
      scores: { Stress: 1, 'Group fun': 6, Atmosphere: 7, Logistics: 10 },
      includes: ['McDonagh’s or Brasserie on the Corner for easier food logistics.', 'One pint at Tigh Neachtain or An Pucan.', 'Skip exposed walk if weather is bad.'],
      cuts: ['Extended pub hop.', 'Long Walk / Claddagh extension in bad weather.', '9:30pm session if exhausted.'],
      why: 'Protects the Friday morning Cliffs plan above all else.',
      tradeoff: 'Less big Galway night, but the trip still works.'
    }
  ],
  tour: {
    id: 'cliffs-half-day',
    title: 'From Galway: Cliffs of Moher Half-Day Express Trip',
    provider: 'Lally Tours',
    date: 'July 3, 2026',
    start: '8:00 AM',
    duration: '5.25 hours',
    travelers: '2 Adults (Age 18-64)',
    language: 'English',
    meetingPoint: 'Outside the HYDE Hotel, Forster Street',
    address: '10 Forster St, Galway, H91 TCP0, Ireland',
    arriveBy: '7:45 AM',
    returnAnchor: '~1:30 PM',
    note: 'Meet outside the HYDE Hotel on Forster Street at 7:45 AM. Look out for the Lally Tours team in their blue jackets. Treat the realistic Galway return as around 1:30pm.',
    link: 'https://lallytours.com/tour/cliffs-of-moher-half-day-express/',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=10%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'
  },
  logistics: [
    ['outbound-rail', 'Dublin to Galway train', 'Add', 'July 2 · 1:02pm-3:50pm. This is the fixed start of the Galway section.', 'Protect the departure time and keep luggage movement simple.', 'https://www.irishrail.ie/en-ie/'],
    ['return-rail', 'Galway to Dublin train', 'Add', 'July 3 · 3:05pm-5:44pm. Same train block shown at the top of the Dublin page.', 'Leave enough post-tour buffer for lunch, bags, and boarding.', 'https://www.irishrail.ie/en-ie/'],
    ['hyde-meetup', 'HYDE Hotel meeting point', 'Add', 'Tour meeting point is outside HYDE Hotel, Forster Street.', 'Arrive at 7:45am for the 8:00am departure.', 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'],
    ['tour-return-buffer', 'Tour return buffer', 'Protect', 'Use ~1:30pm as the operational return anchor.', 'Friday lunch is only a quick central bite before the 3:05pm train.', 'https://lallytours.com/tour/cliffs-of-moher-half-day-express/']
  ],
  restaurants: [
    { id: 'cava-bodega', rank: 1, name: 'Cava Bodega', role: 'Co-top Thursday dinner - best group-energy pick', verdict: 'Add', tags: 'central tapas groups sharing reservation latin-quarter', why: 'Spanish tapas on Middle Street, central and lively. Sharing-plate energy makes it ideal for four people who want a fun, social dinner rather than a formal meal.', booking: 'Book online or contact the restaurant. Official site lists Thursday opening from 5pm to close. Book early for July.', siteUrl: 'https://www.cavarestaurant.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cava%20Bodega%20Middle%20Street%20Galway%20H91%20AF89', sourceNote: 'Official Cava site checked 2026-05-21. Seasonal hours and availability should be verified closer to travel.' },
    { id: 'ard-bia-nimmos', rank: 2, name: 'Ard Bia at Nimmos', role: 'Co-top Thursday dinner - most atmospheric Galway pick', verdict: 'Add', tags: 'spanish-arch river atmospheric local reservation romantic', why: 'One of the most atmospheric Galway dinner choices: near Spanish Arch / Long Walk, cozy and distinctive, strong this-feels-like-Galway memory potential.', booking: 'Book dinner. Official reservation page lists dinner service Tuesday-Sunday from 6pm-9pm and says evening reservations are required.', siteUrl: 'https://www.ardbia.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ard%20Bia%20at%20Nimmos%20Spanish%20Arch%20Galway%20H91%20E9XA', sourceNote: 'Official Ard Bia site checked 2026-05-21. Reconfirm July 2026 hours and cancellation policy before booking.' },
    { id: 'ruibin', rank: 3, name: 'Ruibin', role: 'Modern central dinner backup', verdict: 'Add', tags: 'dockside seasonal cocktails bookable central', why: 'Excellent logistics-to-quality ratio: central by the docks, modern seasonal food, cocktails, and easier to sequence than deeper West End restaurants.', booking: 'Book online. Good backup if Cava / Ard Bia are full or the group wants a modern central dinner.', siteUrl: 'https://ruibin.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=R%C3%BAib%C3%ADn%201%20Dock%20Road%20Galway', sourceNote: 'Official site checked 2026-05-21. Verify July service windows closer in.' },
    { id: 'kai', rank: 4, name: 'Kai Restaurant', role: 'Foodie West End dinner', verdict: 'Add', tags: 'west-end modern-irish farm-to-table reservation', why: 'Great if the group wants one of Galway’s stronger food-scene picks and is willing to trade a little logistics simplicity for food quality.', booking: 'Dinner reservation essential. Better for a food-first version than the default pub-warm night.', siteUrl: 'https://www.kairestaurant.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kai%20Restaurant%2022%20Sea%20Road%20Galway', sourceNote: 'Official site checked 2026-05-21. West End location adds some walking/taxi friction.' },
    { id: 'dela', rank: 5, name: 'Dela', role: 'Lively modern casual dinner', verdict: 'Add', tags: 'west-end modern casual group-friendly reservation', why: 'Good balance of casual, polished, and social. Fits a four-person group that wants a lively dinner without going too formal.', booking: 'Book dinner for Thursday if choosing the West End / food-first route.', siteUrl: 'https://dela.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dela%2051%20Lower%20Dominick%20Street%20Galway', sourceNote: 'Official site checked 2026-05-21. Reconfirm July availability.' },
    { id: 'oscars-seafood', rank: 6, name: "Oscar's Seafood Bistro", role: 'Seafood / oyster dinner', verdict: 'Maybe', tags: 'seafood oysters west-end reservation local-fish', why: 'Best if the group specifically wants local seafood or oysters. More classic seafood bistro than pub-warm dinner.', booking: 'Reserve if seafood becomes the dinner theme.', siteUrl: 'https://oscarsgalway.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oscar%27s%20Seafood%20Bistro%20Dominick%20Street%20Galway', sourceNote: 'Official site checked 2026-05-21. Better for a seafood-focused group.' },
    { id: 'mcdonaghs', rank: 7, name: "McDonagh's Seafood House", role: 'Classic casual seafood fallback', verdict: 'Maybe', tags: 'quay-street seafood fish-and-chips casual classic', why: 'Galway institution on Quay Street. Useful if the group wants classic casual fish and chips instead of a reservation dinner.', booking: 'Treat as a casual fallback. Fast-format and no formal reservation, but summer queues are possible.', siteUrl: 'https://www.mcdonaghs.net/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=McDonagh%27s%20Seafood%20House%20Quay%20Street%20Galway', sourceNote: 'Official site checked 2026-05-21. Also useful as Friday lunch if timing works.' },
    { id: 'brasserie-corner', rank: 8, name: 'Brasserie on the Corner', role: 'Easy central steak / seafood fallback', verdict: 'Maybe', tags: 'central eyre-square steak seafood reservation-friendly', why: 'Less distinctive than Cava or Ard Bia, but very practical: central, polished, broad menu, and good for a group after travel.', booking: 'Use as reservation-friendly fallback if the higher-character restaurants are full.', siteUrl: 'https://brasseriegalway.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Brasserie%20on%20the%20Corner%20Eglinton%20Street%20Galway', sourceNote: 'Official site checked 2026-05-21.' },
    { id: 'dough-bros', rank: 9, name: 'The Dough Bros', role: 'Fast fun pizza fallback', verdict: 'Maybe', tags: 'pizza casual central walk-in group-safe', why: 'Best if everyone is tired, hungry, and wants guaranteed group happiness over a formal dinner.', booking: 'Use as a low-stress fallback rather than the primary Galway dinner.', siteUrl: 'https://www.thedoughbros.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=The%20Dough%20Bros%20Middle%20Street%20Galway', sourceNote: 'Official site checked 2026-05-21.' }
  ],
  bars: [
    ['taaffes', 1, 'Taaffes Bar', 'Early trad session / pre-dinner pint', 'Add', 'Classic Shop Street trad pub. Great as a 5:00/5:30pm pre-dinner music stop if arrival and check-in timing works. More tourist-facing than The Crane but extremely convenient and fun.', 'https://taaffesbar.ie/', 'https://www.google.com/maps/search/?api=1&query=Taaffes%20Bar%20Shop%20Street%20Galway'],
    ['tig-coili', 2, 'Tig Coili', 'Trad music anchor', 'Add', 'Best default post-dinner trad pub. Official site lists Monday-Friday sessions at 6pm and 9:30pm. Arrive early; it can be packed in summer.', 'https://www.tigchoiligalway.com/', 'https://www.google.com/maps/search/?api=1&query=Tig%20Coili%20Mainguard%20Street%20Galway'],
    ['tigh-neachtain', 3, 'Tigh Neachtain', 'Character pub / relaxed pint', 'Add', 'Historic, atmospheric corner pub in the Latin Quarter. Better for a snug final pint and Galway character than chasing guaranteed trad music.', 'https://www.tighneachtain.com/', 'https://www.google.com/maps/search/?api=1&query=Tigh%20Neachtain%20Cross%20Street%20Galway'],
    ['garavans', 4, "Garavan's", 'Whiskey / Irish coffee / calmer central pint', 'Maybe', 'Good if the group wants a polished whiskey or Irish coffee stop rather than a packed trad room.', 'https://garavans.ie/', 'https://www.google.com/maps/search/?api=1&query=Garavans%20Bar%20Galway'],
    ['an-pucan', 5, 'An Pucan', 'Convenient Forster Street pint', 'Maybe', 'Very convenient near HYDE Hotel / Forster Street. Useful as a low-friction nightcap or to pre-scout the tour morning area. Less atmospheric than the Latin Quarter pubs.', 'https://www.anpucan.ie/', 'https://www.google.com/maps/search/?api=1&query=An%20Pucan%20Forster%20Street%20Galway'],
    ['the-quays', 6, 'The Quays', 'Big tourist-energy music pub', 'Maybe', 'Historic, central, high-energy, and music-forward. Worth seeing for one pint if the group wants spectacle, but probably not the main stop.', 'https://quaysgalway.ie/', 'https://www.google.com/maps/search/?api=1&query=The%20Quays%20Bar%20Galway'],
    ['the-crane', 7, 'The Crane Bar', 'Serious trad / West End music', 'Maybe', 'Excellent for real traditional music and local credibility, but farther west and usually more of a serious 9:30pm session. Slightly risky before the early tour.', 'https://www.thecranebar.com/', 'https://www.google.com/maps/search/?api=1&query=The%20Crane%20Bar%20Sea%20Road%20Galway'],
    ['kings-head', 8, "The King's Head", 'Historic landmark pub / one pint', 'Maybe', 'Famous historic pub in the center. Better as a quick look / one pint than the core music stop.', 'https://www.thekingshead.ie/', 'https://www.google.com/maps/search/?api=1&query=The%20King%27s%20Head%20High%20Street%20Galway'],
    ['carrolls', 9, "Carroll's on Dominick Street", 'Fun late option / beer garden energy', 'Skip', 'Save for a longer or later Galway night. It risks turning Thursday into a crawl before the Cliffs tour.', 'https://www.google.com/maps/search/?api=1&query=Carroll%27s%20on%20Dominick%20Street%20Galway', 'https://www.google.com/maps/search/?api=1&query=Carroll%27s%20on%20Dominick%20Street%20Galway']
  ],
  lunch: [
    ['mcdonaghs-lunch', 1, "McDonagh's Fish & Chips Bar", 'Classic Friday quick lunch', 'Add', 'The best classic Galway bite if the tour returns on time. Fast-format fish and chips, central on Quay Street, but allow for summer queue risk.', 'https://www.mcdonaghs.net/', 'https://www.google.com/maps/search/?api=1&query=McDonagh%27s%20Seafood%20House%20Quay%20Street%20Galway'],
    ['merchant-bar', 2, 'The Merchant Bar at Eyre Square Hotel', 'Most logistics-safe seated lunch', 'Add', 'On Forster Street / Eyre Square side, very close to HYDE and Galway Station. Best if timing is tight but the group still wants to sit down.', 'https://www.eyresquarehotel.com/eat-drink/merchant-bar-restaurant/', 'https://www.google.com/maps/search/?api=1&query=Merchant%20Bar%20Eyre%20Square%20Hotel%20Forster%20Street%20Galway'],
    ['little-jungle', 3, 'Little Jungle / Jungle Cafe Forster Street', 'Fastest coffee / snack near HYDE', 'Add', 'Best if the tour returns late or the group only needs coffee, pastries, or a snack before the train.', 'https://www.junglecafegalway.com/', 'https://www.google.com/maps/search/?api=1&query=Little%20Jungle%20Forster%20Street%20Galway'],
    ['gbc', 4, 'GBC / Galway Bakery Company', 'Quick lunch near Eyre Square', 'Add', 'Central, practical, and fast. Good when train timing matters more than restaurant character.', 'https://www.discoverireland.ie/galway/galway-bakery-company-restaurant-and-coffee-shop', 'https://www.google.com/maps/search/?api=1&query=GBC%20Galway%20Bakery%20Company%20Galway'],
    ['esquires-eyre', 5, 'Esquires Coffee Eyre Square', 'Reliable station-side fallback', 'Add', 'Very logistics-safe all-day coffee / light lunch fallback near Eyre Square and the station.', 'https://www.esquirescoffee.ie/our-locations/esquires-galway-eyre-square/', 'https://www.google.com/maps/search/?api=1&query=Esquires%20Coffee%2011%20Eyre%20Square%20Galway'],
    ['coffeewerk', 6, 'Coffeewerk + Press', 'Specialty coffee / quick stop', 'Maybe', 'Great coffee/design stop on Quay Street, but better as a coffee stop than a guaranteed lunch plan.', 'https://coffeewerkandpress.com/', 'https://www.google.com/maps/search/?api=1&query=Coffeewerk%20%2B%20Press%204%20Quay%20Street%20Galway'],
    ['ruibin-lunch', 7, 'Ruibin lunch', 'Seated lunch only if everything runs perfectly', 'Maybe', 'Only do this if the tour returns on time, bags are solved, and everyone is comfortable with a tight timeline.', 'https://ruibin.ie/', 'https://www.google.com/maps/search/?api=1&query=R%C3%BAib%C3%ADn%201%20Dock%20Road%20Galway']
  ],
  activities: [
    { id: 'latin-quarter-walk', name: 'Latin Quarter / Spanish Arch / Long Walk', verdict: 'Add', why: 'The essential compact Galway arrival walk: pedestrian streets, pub energy, medieval texture, river edge, Spanish Arch, and the Long Walk photo moment without overcommitting the evening.', price: 'Free', time: '45-90 minutes', siteUrl: 'https://thelatinquarter.ie/', mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Galway%20Train%20Station&destination=The%20Long%20Walk%20Galway&travelmode=walking', variants: { rain: 'Skip the exposed Long Walk if it is windy/horizontal rain. Do Shop Street / Latin Quarter, then dinner.', lowEnergy: 'Station to Eyre Square to Shop Street to dinner. 20-30 minutes is enough if tired.', goodWeather: 'Add Spanish Arch, Long Walk, and a short Claddagh view extension.' } },
    { id: 'claddagh-extension', name: 'Claddagh Extension', verdict: 'Maybe', why: 'If weather and energy are good, cross toward the Claddagh for panoramic views back toward the Long Walk and Latin Quarter.', price: 'Free', time: '+20-30 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Claddagh%20Galway', variants: { rain: 'Skip; it is exposed waterfront.', lowEnergy: 'Skip; Spanish Arch is enough.' } },
    { id: 'galway-city-museum', name: 'Galway City Museum', verdict: 'Maybe', why: 'Useful only as a short rainy-day buffer near Spanish Arch. Free and central, but do not make it a major itinerary block.', price: 'Free', time: '20-40 minutes', siteUrl: 'https://galwaycitymuseum.ie/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20City%20Museum', variants: { rain: 'Good quick indoor option if open.', lowEnergy: 'Optional only; skip if it adds friction.' } }
  ],
  routes: [
    { id: 'arrival-standard', title: 'Thursday Arrival Walk - Standard', time: '60-75 minutes', stops: ['Galway Station', 'Eyre Square', 'Shop Street', 'Kirwan’s Lane', 'Quay Street', 'Spanish Arch', 'Long Walk'], note: 'Default route if weather is decent. Keep it optional and stop whenever dinner/pub timing calls.' },
    { id: 'arrival-compact', title: 'Thursday Arrival Walk - Compact / Low Energy', time: '20-30 minutes', stops: ['Galway Station', 'Eyre Square', 'Shop Street', 'Dinner'], note: 'Use if tired, rainy, or bags/check-in take longer than expected.' },
    { id: 'arrival-extended', title: 'Thursday Arrival Walk - Extended / Good Weather', time: '90-120 minutes', stops: ['Galway Station', 'Eyre Square', 'Shop Street / Kirwan’s Lane', 'Quay Street', 'Spanish Arch', 'Long Walk', 'Wolfe Tone Bridge', 'Claddagh quays', 'Return via Latin Quarter or Dominick Street'], note: 'Only attempt if energy and weather are genuinely good. Do not force it before dinner.' },
    { id: 'friday-lunch-safe-route', title: 'Friday Post-Tour Safe Lunch Route', time: '1:30-2:30pm', stops: ['HYDE Hotel / Forster Street', 'Merchant Bar or Jungle / Little Jungle', 'Galway Station'], note: 'Use this if the tour is late or everyone wants the lowest-stress lunch path.' }
  ],
  warnings: [
    ['aran-islands', 'Aran Islands', 'skip', 'Full-day ferry/island plan. Incompatible with the fixed Cliffs tour and 3:05pm Friday train.', 'https://www.google.com/maps/search/?api=1&query=Aran%20Islands'],
    ['connemara', 'Connemara / Kylemore Abbey', 'skip', 'Another full-day west-coast excursion. Not possible inside the 26-hour Galway stop.', 'https://www.google.com/maps/search/?api=1&query=Connemara%20National%20Park'],
    ['salthill', 'Salthill', 'skip', 'Nice coastal area, but too far to add as a real evening plan. The Claddagh / Long Walk gives enough water-view atmosphere inside the compact route.', 'https://www.google.com/maps/search/?api=1&query=Salthill%20Promenade%20Galway'],
    ['late-night-pub-crawl', 'Late-night pub crawl', 'skip', 'Galway pubs are tempting, but the Friday HYDE meetup is 7:45am. Do one session and one optional final pint, not a crawl.', ''],
    ['long-museum-block', 'Long museum block', 'skip', 'The Galway City Museum is fine as a short rain buffer. A planned museum afternoon does not fit this stay.', 'https://www.google.com/maps/search/?api=1&query=Galway%20City%20Museum'],
    ['aniar', 'Aniar tasting menu', 'skip', 'Michelin-style destination dinner is overkill for one short Galway night before an early Cliffs tour.', 'https://www.google.com/maps/search/?api=1&query=Aniar%20Restaurant%20Galway'],
    ['griffins-bakery', 'Griffins Bakery', 'skip', 'Older guides may mention it, but do not rely on it unless independently reverified. Treat as excluded from the planner.', 'https://www.google.com/maps/search/?api=1&query=Griffins%20Bakery%20Shop%20Street%20Galway'],
    ['ambitious-friday-lunch', 'Ambitious seated Friday lunch', 'skip', 'The realistic 1:30pm tour return leaves about 95 minutes before the 3:05pm train. Keep lunch fast and central.', '']
  ],
  weather: {
    galwayJuly: 'July is one of Galway’s better months, but Atlantic weather still means showers, wind, and cool-feeling cliff conditions are realistic.',
    cliffsPacking: ['Waterproof shell - mandatory.', 'Warm layer under the shell; cliffs can feel cold even in July.', 'Comfortable shoes with grip; avoid anything slippery or dressy.', 'Small dry bag or zip pocket for phones.', 'Expect fog or mist to affect visibility; cliffs can still be dramatic.'],
    cliffsTourRain: 'Treat rain/wind as a packing and expectation issue unless Lally or the Cliffs site changes operations.',
    galwayEveningRain: 'Light rain does not ruin Galway. Cut the exposed Long Walk / Claddagh portion and move into dinner or pubs earlier.',
    indoorFallbacks: ['Galway City Museum for a short free indoor buffer near Spanish Arch.', 'Ard Bia / Cava dinner earlier if table timing allows.', 'Tigh Neachtain, Taaffes, or Tig Coili for warm pub atmosphere.']
  },
  bookingTimeline: [
    ['Now / ASAP', 'Confirm lodging and bag logistics', 'high', ['Where are bags going after the 3:50pm arrival?', 'Can bags be stored after checkout during the Cliffs tour?', 'How long is the walk/taxi from lodging to HYDE Hotel?']],
    ['Now / ASAP', 'Book Thursday dinner hold', 'high', ['Primary 1A: Cava Bodega for group-energy tapas.', 'Primary 1B: Ard Bia at Nimmos for atmosphere near Spanish Arch.', 'Backup: Ruibin.', 'Foodie backups: Kai or Dela.', 'Seafood backup: Oscar’s.']],
    ['1-2 weeks before', 'Reconfirm tour, dinner, and weather', 'high', ['Lally departure still 8:00am?', 'Meeting point still outside HYDE Hotel?', 'Arrival still requested by 7:45am?', 'Tour return still best treated as ~1:30pm?', 'Restaurant reservation still confirmed?']],
    ['Week of', 'Packing and rain plan', 'medium', ['Waterproof shell.', 'Warm layer.', 'Comfortable shoes with grip.', 'Avoid umbrella reliance at the Cliffs if windy.', 'Set expectations for fog/mist.']],
    ['Day before', 'Set Thursday night cutoff and Friday route', 'medium', ['Pick one main pub and one optional final pint.', 'Aim out by ~11pm.', 'Set alarm.', 'Save HYDE Hotel map.', 'Charge phones / portable battery.']],
    ['Friday morning', 'Protect the tour', 'high', ['Leave lodging early enough to arrive HYDE by 7:45am.', 'Look for Lally Tours team in blue jackets.', 'Bring layers and rain shell.', 'Keep train tickets accessible.']],
    ['Friday 1:30-2:30pm', 'Fast lunch + station buffer', 'high', ['McDonagh’s if return is on time and queue looks manageable.', 'Merchant Bar / Jungle / GBC / Esquires if timing is tighter.', 'Be station-minded by 2:30pm.', 'Skip seated lunch if bus returns late.']]
  ],
  mapPins: [
    { id: 'station', label: 'Galway Station', note: 'Rail in/out anchor', category: 'logistics', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station' },
    { id: 'hyde-hotel', label: 'HYDE Hotel / Tour Start', note: '7:45am Lally meetup', category: 'logistics', mapUrl: 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0' },
    { id: 'eyre-square', label: 'Eyre Square', note: 'City anchor', category: 'walk', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Eyre%20Square%20Galway' },
    { id: 'shop-street', label: 'Shop Street', note: 'Pedestrian Galway energy', category: 'walk', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shop%20Street%20Galway' },
    { id: 'spanish-arch', label: 'Spanish Arch', note: 'Arrival walk / photo stop', category: 'walk', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Spanish%20Arch%20Galway' },
    { id: 'long-walk', label: 'The Long Walk', note: 'Golden-hour photo moment', category: 'walk', mapUrl: 'https://www.google.com/maps/search/?api=1&query=The%20Long%20Walk%20Galway' },
    { id: 'cava-bodega', label: 'Cava Bodega', note: 'Dinner 1A: group-energy tapas', category: 'restaurant', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cava%20Bodega%20Middle%20Street%20Galway' },
    { id: 'ard-bia', label: 'Ard Bia at Nimmos', note: 'Dinner 1B: atmosphere', category: 'restaurant', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ard%20Bia%20at%20Nimmos%20Spanish%20Arch%20Galway' },
    { id: 'mcdonaghs', label: "McDonagh's", note: 'Classic fish and chips / lunch', category: 'lunch', mapUrl: 'https://www.google.com/maps/search/?api=1&query=McDonagh%27s%20Seafood%20House%20Quay%20Street%20Galway' },
    { id: 'merchant-bar', label: 'Merchant Bar', note: 'Station-safe Friday lunch', category: 'lunch', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Merchant%20Bar%20Eyre%20Square%20Hotel%20Forster%20Street%20Galway' },
    { id: 'taaffes', label: 'Taaffes Bar', note: 'Early trad session', category: 'pub', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taaffes%20Bar%20Shop%20Street%20Galway' },
    { id: 'tig-coili', label: 'Tig Coili', note: 'Trad music anchor', category: 'pub', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tig%20Coili%20Mainguard%20Street%20Galway' },
    { id: 'tigh-neachtain', label: 'Tigh Neachtain', note: 'Relaxed character pint', category: 'pub', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tigh%20Neachtain%20Cross%20Street%20Galway' },
    { id: 'the-crane', label: 'The Crane Bar', note: 'Serious trad maybe', category: 'pub', mapUrl: 'https://www.google.com/maps/search/?api=1&query=The%20Crane%20Bar%20Sea%20Road%20Galway' }
  ],
  stamps: [
    ['rail-west', 'Dublin to Galway', '1:02pm westbound'],
    ['galway-pubs', 'First Galway pint', 'Thursday evening trad session'],
    ['spanish-arch', 'Spanish Arch / Long Walk', 'Thursday golden-hour walk'],
    ['hyde-meetup', 'HYDE Hotel, blue jackets', '7:45am sharp'],
    ['cliffs', 'Cliffs of Moher', 'Half-day express above the Atlantic'],
    ['fish-and-chips', 'Fish and chips before the rails', 'Friday post-tour'],
    ['rail-back', 'Galway to Dublin', '3:05pm return']
  ],
  sourceNotes: [
    { id: 'lally-tour', claim: 'Lally Half-Day Express should be treated as returning around 1:30pm for planning.', url: 'https://lallytours.com/tour/cliffs-of-moher-half-day-express/', accessed: '2026-05-21', note: 'Main page describes duration as 5.25 hours; Lally blog explicitly mentions 8am express returning to Galway at 1:30pm.' },
    { id: 'cava-hours', claim: 'Cava Bodega is open Thursday from 5pm to close and supports reservations/contact online.', url: 'https://www.cavarestaurant.ie/reservations', accessed: '2026-05-21', note: 'Verify July 2026 availability closer to booking.' },
    { id: 'ard-bia-reservations', claim: 'Ard Bia dinner is reservation-based, with dinner service listed Tuesday-Sunday 6-9pm.', url: 'https://www.ardbia.com/reservations', accessed: '2026-05-21', note: 'Verify seasonal details / cancellation policy before booking.' },
    { id: 'tig-coili-sessions', claim: 'Tig Coili lists Monday-Friday music sessions at 6pm and 9:30pm.', url: 'https://www.tigchoiligalway.com/', accessed: '2026-05-21', note: 'Great post-dinner trad anchor; arrive early in summer.' },
    { id: 'taaffes-sessions', claim: 'Taaffes is a central traditional pub with daily music sessions; commonly listed around early evening and later evening.', url: 'https://taaffesbar.ie/', accessed: '2026-05-21', note: 'Use as early/pre-dinner option; exact session times should be rechecked close to travel.' }
  ]
};
