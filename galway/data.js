window.GALWAY_DATA = {
  meta: {
    title: 'Galway: Rails, Pubs & Cliffs',
    dates: 'July 2-3, 2026',
    tagline: 'Galway, with one clean Cliffs mission.',
    subtitle: 'A short west-coast Ireland chapter for Logan, Emily, Ashley, and Max: rail in, Galway night, Cliffs of Moher half-day tour, rail back to Dublin.',
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
  verdicts: [
    { status: 'Add', title: 'Protect the rails', text: 'The Galway chapter is bounded by the 1:02pm Dublin departure and 3:05pm Galway return.' },
    { status: 'Add', title: 'Tour is the anchor', text: 'The July 3 Lally Tours Cliffs of Moher half-day express trip is the main event.' },
    { status: 'Maybe', title: 'Keep night one flexible', text: 'Add pubs and dinner later, but keep Thursday evening low-friction after travel.' },
    { status: 'Protect', title: 'Arrive by 7:45am', text: 'The tour note says to meet outside HYDE Hotel 15 minutes before the 8:00am departure.' }
  ],
  chapters: [
    { dayId: 'thu', title: 'Rail West', subtitle: 'Dublin train, Galway arrival, easy evening', stamp: '1:02pm train' },
    { dayId: 'fri', title: 'Cliffs Run', subtitle: 'HYDE Hotel meetup, Lally Tours, back by early afternoon', stamp: '8:00am tour' },
    { dayId: 'fri', title: 'Capital Return', subtitle: 'Galway to Dublin, same rail beat as the Dublin page', stamp: '3:05pm train' }
  ],
  days: [
    {
      id: 'thu',
      day: 'Thursday',
      date: 'July 2',
      title: 'Dublin to Galway, then keep the evening open',
      mood: 'West-coast arrival without overplanning the first night.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Galway_City%2C_The_Long_Walk%2C_2018.jpg/1280px-Galway_City%2C_The_Long_Walk%2C_2018.jpg',
      scores: { Logistics: 9, 'Group ease': 8, Food: 4, Scenery: 7 },
      timeline: [
        ['1:02-3:50pm', 'Train Dublin to Galway. This is the fixed arrival spine for the chapter.'],
        ['3:50-4:30pm', 'Arrive Galway, get bags sorted, and keep the transfer simple.'],
        ['Evening', 'Dinner, pubs, or a short walk to be researched and added later.'],
        ['Before bed', 'Set the morning plan: HYDE Hotel meetup at 7:45am for the Cliffs tour.']
      ],
      watch: ['Do not make Thursday night complicated before the early tour.', 'Confirm where bags are going before adding dinner/pub reservations.', 'Keep the next morning’s meetup details visible.'],
      variants: {
        low: 'Arrive, check in / drop bags, simple dinner, one pint, bed.',
        rain: 'Taxi or shortest luggage route, indoor dinner, early night.'
      },
      links: [['Galway station map', 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station']]
    },
    {
      id: 'fri',
      day: 'Friday',
      date: 'July 3',
      title: 'Cliffs of Moher tour, then train to Dublin',
      mood: 'A clean half-day scenic mission with no logistics fog.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Cliffs_of_Moher_2018.jpg/1280px-Cliffs_of_Moher_2018.jpg',
      scores: { Logistics: 10, Scenery: 10, 'Group ease': 7, Buffer: 8 },
      timeline: [
        ['7:45am', 'Arrive outside the HYDE Hotel, Forster Street. Look for the Lally Tours team in blue jackets.'],
        ['8:00am', 'From Galway: Cliffs of Moher Half-Day Express Trip departs.'],
        ['8:00am-1:00pm', 'Tour window: 5 hours, English, 2 adults listed on the booking.'],
        ['1:00-2:30pm', 'Return to Galway, quick lunch / bags / buffer.'],
        ['3:05-5:44pm', 'Train Galway to Dublin. This matches the arrival rail card at the top of the Dublin page.']
      ],
      watch: ['Be at HYDE Hotel by 7:45am.', 'Keep lunch short enough to protect the 3:05pm train.', 'Do not add a long afternoon plan before Dublin.'],
      variants: {
        low: 'Tour, simple lunch, station buffer, Dublin train.',
        rain: 'Tour still runs unless operator changes it; bring layers and keep the post-tour plan minimal.'
      },
      links: [['HYDE Hotel meeting point', 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland']]
    }
  ],
  tour: {
    id: 'cliffs-half-day',
    title: 'From Galway: Cliffs of Moher Half-Day Express Trip',
    provider: 'Lally Tours',
    date: 'July 3, 2026',
    start: '8:00 AM',
    duration: '5 hours',
    travelers: '2 Adults (Age 18-64)',
    language: 'English',
    meetingPoint: 'Outside the HYDE Hotel, Forster Street',
    address: '10 Forster St, Galway, H91 TCP0, Ireland',
    arriveBy: '7:45 AM',
    note: 'Meet outside the HYDE Hotel on Forster Street at 7:45 AM. Look out for the Lally Tours team in their blue jackets.',
    link: 'https://www.google.com/maps/search/?api=1&query=10%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'
  },
  logistics: [
    ['outbound-rail', 'Dublin to Galway train', 'Add', 'July 2 · 1:02pm-3:50pm. This is the fixed start of the Galway section.', 'Protect the departure time and keep luggage movement simple.', 'https://www.irishrail.ie/en-ie/'],
    ['return-rail', 'Galway to Dublin train', 'Add', 'July 3 · 3:05pm-5:44pm. Same train block shown at the top of the Dublin page.', 'Leave enough post-tour buffer for lunch, bags, and boarding.', 'https://www.irishrail.ie/en-ie/'],
    ['hyde-meetup', 'HYDE Hotel meeting point', 'Add', 'Tour meeting point is outside HYDE Hotel, Forster Street.', 'Arrive at 7:45am for the 8:00am departure.', 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland']
  ],
  ideas: [
    ['restaurants', 'Restaurants to research', 'Maybe', 'Add dinner and lunch candidates here once the Galway food research is ready.', 'Leave room for a Thursday dinner and a quick Friday post-tour lunch.', ''],
    ['pubs', 'Pubs to research', 'Maybe', 'Galway pub ideas can be added later without changing the fixed transport/tour spine.', 'Thursday night should stay easy because of the early tour.', ''],
    ['walks', 'Short Galway walk', 'Maybe', 'A compact city walk can fill the arrival evening if energy is good.', 'Keep it short and central.', '']
  ],
  stamps: [
    ['rail-west', 'Dublin to Galway train', '1:02pm westbound'],
    ['galway-night', 'First Galway night', 'Pubs / dinner TBD'],
    ['hyde', 'HYDE Hotel meetup', '7:45am sharp'],
    ['cliffs', 'Cliffs of Moher', 'Half-day express'],
    ['return-rail', 'Galway to Dublin train', '3:05pm return']
  ]
};
