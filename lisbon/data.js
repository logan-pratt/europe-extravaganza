window.LISBON_DATA = {
  meta: {
    title: 'Lisbon: River Light, Old Streets & One Great Sintra Day',
    dates: 'June 25-30, 2026',
    tagline: 'River light, old streets, one edited Sintra day.',
    subtitle: 'A warm, practical, romantic Lisbon planner for Logan, Emily, Ashley, and Max.',
    base: {
      name: 'Rua da Madalena 214',
      area: 'Baixa / Alfama edge',
      address: 'Rua da Madalena 214, Lisbon 1100-204, Portugal',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon%201100-204%20Portugal'
    }
  },
  quickFacts: [
    ['Home base', 'Rua da Madalena 214', 'Excellent for Baixa, Alfama, Chiado, Rossio, and Praça do Comércio.', 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon%201100-204%20Portugal'],
    ['Arrival', 'Thu Jun 25', 'Ashley and Max arrive around 10:00am. Logan and Emily land at 11:50am.', 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'],
    ['Departure', 'Tue Jun 30', '6:00am flight to Dublin. Leave around 3:30-3:45am.', 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'],
    ['Big day', 'Sunday Sintra', 'Default: Regaleira + Monserrate + Cascais sunset/dinner if energy holds.', 'https://www.google.com/maps/search/?api=1&query=Quinta%20da%20Regaleira%20Sintra%20Portugal'],
    ['Main caution', 'Monday discipline', 'Pack before dinner, early meal, one drink max, airport plan confirmed.', 'https://www.google.com/maps/search/?api=1&query=Prado%20Wine%20Bar%20Lisbon']
  ],
  verdicts: [
    { status: 'Add', title: 'Alfama golden hour', text: 'Sé Cathedral, Santa Luzia, Portas do Sol, and Alfama lanes are the first real Lisbon spell.' },
    { status: 'Add', title: 'One seafood feast', text: 'Ramiro if logistics work; otherwise Rosamar, Sea Me, Solar dos Presuntos, or Cascais seafood.' },
    { status: 'Add', title: 'Sintra, edited hard', text: 'Regaleira + Monserrate is the default. Pena is the iconic alternate, not an automatic add-on.' },
    { status: 'Protect', title: 'Monday night discipline', text: 'Pack before dinner, eat early, one drink max, and pre-book the 3:30am airport move.' },
    { status: 'Skip', title: 'Fake must-dos', text: 'Tram 28 lines, Santa Justa Lift lines, Belém Tower interior, Pink Street as destination, and Sintra+Cascais+Cabo da Roca.' }
  ],
  chapters: [
    { dayId: 'thu', title: 'Soft Landing', subtitle: 'Bags, riverfront, Chiado, easy wine, early bed', stamp: 'Arrival glow' },
    { dayId: 'fri', title: 'Classic Lisbon', subtitle: 'Alfama, viewpoints, Chiado, one great dinner', stamp: 'Old streets' },
    { dayId: 'sat', title: 'Waterfront + Big Night', subtitle: 'Belém, LX Factory, seafood, rooftops, optional Rock in Rio', stamp: 'Atlantic light' },
    { dayId: 'sun', title: 'Sintra + Cascais', subtitle: 'Regaleira, Monserrate, coast if energy survives', stamp: 'Big adventure' },
    { dayId: 'mon', title: 'Final Beautiful Day', subtitle: 'Souvenirs, nata, early dinner, airport discipline', stamp: 'Final toast' }
  ],
  days: [
    {
      id: 'thu',
      day: 'Thursday',
      date: 'June 25',
      title: 'Arrival / Soft Landing',
      mood: 'Low-pressure first Lisbon walk, easy dinner, early-ish night.',
      image: '../assets/lisbon.jpg',
      scores: { Stress: 3, Romance: 7, 'Group fun': 7, Food: 7 },
      timeline: [
        ['10:00am', 'Ashley and Max arrive and head toward Baixa / Rua da Madalena. Ask about bag drop.'],
        ['11:50am', 'Logan and Emily land at LIS, then taxi/Bolt/Uber to Rua da Madalena.'],
        ['Early afternoon', 'Bag drop or luggage storage near Baixa/Rossio. Keep logistics gentle.'],
        ['Lunch', 'First group lunch near Baixa/Chiado: Pica-Pau, Cantinho do Avillez, Bairro do Avillez, or By The Wine.'],
        ['Late afternoon', 'Rua da Madalena → Praça do Comércio → Ribeira das Naus → Chiado/Carmo.'],
        ['Evening', 'By The Wine, Prado Wine Bar, Pica-Pau, or Cantinho. Pavilhão Chinês or Lumi only if everyone has energy.']
      ],
      optional: ['São Pedro de Alcântara first view if energy allows.', 'Hotel do Chiado / Bar Entretanto or Lumi rooftop for views.'],
      watch: ['Do not start with Ramiro, a fado dinner, or major nightlife after transatlantic travel.'],
      variants: { low: 'River walk + simple dinner + early bed.', rain: 'Chiado, Carmo, wine bar, Airbnb snacks.' },
      links: [
        ['Home base', 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon%20Portugal'],
        ['Praça do Comércio', 'https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a%20do%20Com%C3%A9rcio%20Lisbon'],
        ['By The Wine', 'https://www.bythewine.pt/en/index.html'],
        ['Prado Wine Bar', 'https://pradowinebar.com/']
      ]
    },
    {
      id: 'fri',
      day: 'Friday',
      date: 'June 26',
      title: 'Classic Lisbon / Alfama + Chiado + Bairro Alto',
      mood: 'The fall-in-love-with-Lisbon day.',
      image: '../assets/lisbon-friday-santa-luzia.jpg',
      scores: { Stress: 4, Romance: 9, 'Group fun': 8, Food: 9 },
      timeline: [
        ['Morning', 'Rua da Madalena → Sé Cathedral → Santa Luzia → Portas do Sol → Alfama lanes.'],
        ['Optional', 'Castelo de São Jorge if the group wants views/history and the heat is reasonable.'],
        ['Lunch', 'O Velho Eurico if booked or early; Zé da Mouraria if hungry; casual Mouraria/Alfama fallback.'],
        ['Afternoon', 'Carmo, Chiado, Bertrand, A Vida Portuguesa. See Santa Justa Lift from below; do not wait.'],
        ['Reset', 'Airbnb pause before dinner.'],
        ['Dinner/night', 'Prado, Ofício, Bar Alimentar, Taberna da Rua das Flores, or A Nossa Casa. Pavilhão Chinês, fado, Bairro Alto, or cocktails depending energy.']
      ],
      optional: ['Clube de Fado or Mesa de Frades if everyone wants a proper fado experience.', 'Red Frog / Monkey Mash for cocktail-quality night.'],
      watch: ['Do not let Tram 28 become the plan.', 'Taberna da Rua das Flores means door-list patience.'],
      variants: { low: 'Alfama morning + Chiado afternoon + one great dinner, skip nightlife.', rain: 'Carmo, Bertrand, A Vida Portuguesa, long lunch, wine bar.' },
      links: [
        ['Sé Cathedral', 'https://www.google.com/maps/search/?api=1&query=S%C3%A9%20Cathedral%20Lisbon'],
        ['Santa Luzia', 'https://www.google.com/maps/search/?api=1&query=Miradouro%20de%20Santa%20Luzia%20Lisbon'],
        ['Portas do Sol', 'https://www.google.com/maps/search/?api=1&query=Miradouro%20das%20Portas%20do%20Sol%20Lisbon'],
        ['Prado', 'https://www.pradorestaurante.com/']
      ]
    },
    {
      id: 'sat',
      day: 'Saturday',
      date: 'June 27',
      title: 'Belém / Waterfront / Big Group Night',
      mood: 'Relaxed weekend day, optional big night.',
      image: '../assets/lisbon-saturday-jeronimos.jpg',
      scores: { Stress: 5, Romance: 8, 'Group fun': 9, Food: 9 },
      timeline: [
        ['Morning/midday', 'Belém waterfront, Pastéis de Belém if line is sane, Jerónimos exterior/church if lines are reasonable.'],
        ['Photo stop', 'Belém Tower exterior only unless official access reopens closer to the trip.'],
        ['Afternoon', 'MAAT exterior/river walk, LX Factory if the group wants shops/bookstore/drinks, then downtime.'],
        ['Sunset', 'Park Bar, Santa Catarina, São Pedro de Alcântara, Lumi, or Hotel Mundial rooftop.'],
        ['Dinner', 'Canalha, Ramiro, Rosamar, Sea Me, Solar dos Presuntos, or Ponto Final if logistics and reservation work.'],
        ['Night', 'Príncipe Real cocktails → Bairro Alto roam → Pink Street pass-through only if nearby and energy remains.']
      ],
      optional: ['Rock in Rio only if the lineup is irresistible and it replaces the night.', 'Ponto Final for sunset meal if reservation/logistics work.'],
      watch: ['Pink Street is a pass-through, not the destination.', 'Rock in Rio is not an add-on after a full Lisbon night.'],
      variants: { low: 'Belém photo walk, nata, LX Factory drink, easy dinner, bed.', rain: 'MAAT, LX Factory, Canalha, wine/cocktails under cover.' },
      links: [
        ['Pastéis de Belém', 'https://pasteisdebelem.pt/en/'],
        ['Jerónimos', 'https://www.google.com/maps/search/?api=1&query=Jer%C3%B3nimos%20Monastery%20Lisbon'],
        ['MAAT', 'https://www.maat.pt/en'],
        ['Canalha', 'https://www.canalha.pt/homepage/']
      ]
    },
    {
      id: 'sun',
      day: 'Sunday',
      date: 'June 28',
      title: 'Sintra + Cascais Big Day',
      mood: 'Big adventure, curated carefully so it feels worth it instead of chaotic.',
      image: '../assets/lisbon-sunday-regaleira.jpg',
      scores: { Stress: 8, Romance: 10, 'Group fun': 9, Food: 8 },
      timeline: [
        ['6:45-7:15am', 'Leave Airbnb for Rossio Station or private transfer.'],
        ['8:00ish', 'Arrive Sintra and get moving before the worst crowds.'],
        ['9:00-11:15', 'Quinta da Regaleira. Book directly. This is the anchor.'],
        ['11:30-12:30', 'Sintra town snack/lunch; Casa Piriquita for travesseiros if desired.'],
        ['1:00-3:00', 'Monserrate Palace and gardens. Calmer, greener, more romantic than Pena.'],
        ['3:30-4:30', 'Transfer toward Cascais. Consider Bolt/Uber/private transfer for this annoying middle leg.'],
        ['5:00-8:00', 'Cascais beach/old town/marina walk, drinks, dinner.'],
        ['8:30-9:30', 'Train/Bolt/Uber back to Lisbon. No major nightlife required.']
      ],
      optional: ['Iconic alternate: Regaleira + Pena + Cascais, only if the group really wants Pena.', 'Fallback: Regaleira + Monserrate + Sintra town, relaxed dinner back near the Airbnb.'],
      watch: ['Do not add Cabo da Roca unless the group explicitly wants a long scenic detour.', 'Do not attempt Pena + Regaleira + Monserrate + Cascais.'],
      variants: { low: 'Regaleira + Monserrate + Sintra town, then dinner back in Lisbon.', rain: 'Decide morning-of: Regaleira if tolerable, otherwise Lisbon museums/wine/long lunch.' },
      links: [
        ['Regaleira tickets', 'https://www.regaleira.pt/en/visits'],
        ['Monserrate', 'https://www.parquesdesintra.pt/en/parks-monuments/park-and-palace-of-monserrate/'],
        ['Pena Palace', 'https://www.parquesdesintra.pt/en/parks-monuments/park-and-national-palace-of-pena/'],
        ['Hífen Cascais', 'https://www.hifenrestaurant.com/']
      ]
    },
    {
      id: 'mon',
      day: 'Monday',
      date: 'June 29',
      title: 'Final Lisbon Day / Early Special Night',
      mood: 'One last beautiful day, souvenir run, early dinner, disciplined night.',
      image: '../assets/lisbon-monday-senhora-monte.jpg',
      scores: { Stress: 4, Romance: 8, 'Group fun': 6, Food: 8 },
      timeline: [
        ['Morning', 'Graça / Senhora do Monte if the group wants one last big view.'],
        ['Midday', 'Alfama or Baixa wander near the Airbnb.'],
        ['Souvenirs', 'Conserveira de Lisboa, Loja das Conservas, A Vida Portuguesa, Bertrand/Chiado.'],
        ['Nata', 'Manteigaria in Chiado is the definitely-do nata stop.'],
        ['Afternoon', 'Keep flexible. Do not plan anything far away or hard to unwind from.'],
        ['Before dinner', 'Pack before dinner. Confirm 3:30-3:45am airport move.'],
        ['Early dinner', 'Prado Wine Bar, By The Wine, Prado, Ofício, Da Noi, or Time Out only as emergency fallback.'],
        ['Night', 'One viewpoint toast or cocktail. Back to Airbnb by 10:00-10:30pm.']
      ],
      optional: ['Loja das Conservas for tinned-fish gifts.', 'Lumi or São Pedro de Alcântara for one final toast.'],
      watch: ['No Bairro Alto, midnight fado, second bottle of wine, or hard-to-control dinner far from the Airbnb.'],
      variants: { low: 'Nata, souvenirs, pack, Prado Wine Bar, home early.', rain: 'Shopping, Bertrand, wine bar, early dinner, pack.' },
      links: [
        ['Conserveira de Lisboa', 'https://www.google.com/maps/search/?api=1&query=Conserveira%20de%20Lisboa'],
        ['Manteigaria Chiado', 'https://manteigaria.com/en/'],
        ['Prado Wine Bar', 'https://pradowinebar.com/'],
        ['Lisbon Airport', 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport']
      ]
    }
  ],
  paths: [
    {
      id: 'romantic-scenic',
      name: 'Romantic / Scenic',
      badge: 'Golden light default',
      best: 'Alfama golden hour, Santa Luzia, Portas do Sol, atmospheric dinner, and one beautiful drink.',
      scores: { Stress: 3, Romance: 10, 'Group fun': 7, Atmosphere: 10, 'Food/drink': 8, Logistics: 8 },
      includes: ['Alfama golden hour', 'Santa Luzia / Portas do Sol', 'Prado / Ofício / Bar Alimentar / A Nossa Casa', 'Pavilhão Chinês / Lumi / fado'],
      cuts: ['Tram 28 line', 'Santa Justa line', 'Pink Street as plan'],
      why: 'It makes Lisbon feel cinematic without turning the day into logistics.',
      tradeoff: 'Less big sightseeing volume.'
    },
    {
      id: 'fun-social',
      name: 'Fun / Social',
      badge: 'Best group energy',
      best: 'Belém or LX Factory, seafood or loud tavern dinner, Bairro Alto if the night has legs.',
      scores: { Stress: 5, Romance: 7, 'Group fun': 10, Atmosphere: 8, 'Food/drink': 9, Logistics: 7 },
      includes: ['LX Factory', 'Canalha / Ramiro / O Velho Eurico / Sea Me', 'Bairro Alto', 'Pink Street pass-through only'],
      cuts: ['Formal dinner', 'overpacked museums', 'late night before Dublin'],
      why: 'It gives the four-person trip momentum and shared-table energy.',
      tradeoff: 'Busier and less restful.'
    },
    {
      id: 'low-energy',
      name: 'Low-Energy / Jet Lag',
      badge: 'Soft landing',
      best: 'Praça do Comércio, riverfront, Chiado coffee/nata, wine bar, early bed.',
      scores: { Stress: 1, Romance: 7, 'Group fun': 5, Atmosphere: 8, 'Food/drink': 7, Logistics: 10 },
      includes: ['Riverfront', 'Chiado coffee/nata', 'By The Wine / Pica-Pau / Prado Wine Bar', 'early bed'],
      cuts: ['Ramiro wait', 'fado dinner', 'major nightlife'],
      why: 'It protects the first day and keeps the trip from starting tired.',
      tradeoff: 'Less first-night spectacle.'
    },
    {
      id: 'big-adventure',
      name: 'Big Adventure',
      badge: 'Sintra day',
      best: 'Early Sintra, Regaleira, Monserrate or Pena, Cascais sunset/dinner if energy holds.',
      scores: { Stress: 8, Romance: 10, 'Group fun': 9, Atmosphere: 10, 'Food/drink': 7, Logistics: 5 },
      includes: ['Regaleira', 'Monserrate default', 'Cascais sunset/dinner', 'no major nightlife afterward'],
      cuts: ['Cabo da Roca', 'Pena + Monserrate stack', 'full beach day'],
      why: 'It creates the trip’s biggest Portugal memory while staying honest about transit.',
      tradeoff: 'Requires early wakeup and strong group discipline.'
    },
    {
      id: 'rain-heat',
      name: 'Rain / Heat Backup',
      badge: 'Weather pivot',
      best: 'Carmo, Tile Museum or Gulbenkian, wine bar, long lunch, rooftop only if weather clears.',
      scores: { Stress: 3, Romance: 6, 'Group fun': 6, Atmosphere: 7, 'Food/drink': 8, Logistics: 8 },
      includes: ['Carmo Convent', 'Tile Museum / Gulbenkian', 'long lunch', 'wine bar'],
      cuts: ['exposed viewpoint stack', 'long hot queues'],
      why: 'It keeps the day pretty and comfortable instead of stubborn.',
      tradeoff: 'Less outdoor Lisbon magic.'
    },
    {
      id: 'final-night',
      name: 'Final Night / Pre-Dublin',
      badge: 'Protect the flight',
      best: 'Pack before dinner, early special meal, one toast, home by 10:00-10:30pm.',
      scores: { Stress: 2, Romance: 8, 'Group fun': 5, Atmosphere: 8, 'Food/drink': 8, Logistics: 10 },
      includes: ['Prado Wine Bar / Prado / Ofício / By The Wine', 'airport transfer plan', 'one viewpoint toast'],
      cuts: ['Bairro Alto', 'midnight fado', 'second bottle of wine'],
      why: 'A 6:00am flight turns Monday night into logistics with candlelight.',
      tradeoff: 'No heroic final-night chaos.'
    }
  ],
  restaurants: [
    { id: 'o-velho-eurico', rank: 1, name: 'O Velho Eurico', role: 'Best overall Lisbon personality', verdict: 'Add', tags: 'top group traditional walkable', why: 'Lively neo-tasca within minutes of the Airbnb. Loud, local-feeling, memorable.', booking: 'Hard booking; Tue-Sat signals. Do not plan Sunday/Monday unless hours change.', siteUrl: 'https://www.instagram.com/ovelhoeurico/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=O%20Velho%20Eurico%20Lisbon%20Portugal' },
    { id: 'canalha', rank: 2, name: 'Canalha', role: 'Belém day anchor', verdict: 'Add', tags: 'top group modern seafood belem', why: 'Chef-driven modern Portuguese that perfectly anchors the Saturday Belém day.', booking: 'Reserve early; best when paired with Belém.', siteUrl: 'https://www.canalha.pt/homepage/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Canalha%20Lisbon%20Portugal' },
    { id: 'bar-alimentar', rank: 3, name: 'Bar Alimentar', role: 'Stylish buzzy sharing dinner', verdict: 'Add', tags: 'top romantic group wine modern', why: 'Candlelit, buzzy, shareable, and not stiff. Very strong four-person fit.', booking: 'UMAI reservations; treat Sunday/Monday as closed until verified.', siteUrl: 'https://reservation.umai.io/widget/bar-alimentar', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bar%20Alimentar%20Lisbon%20Portugal' },
    { id: 'prado', rank: 4, name: 'Prado', role: 'Modern Portuguese occasion dinner', verdict: 'Add', tags: 'top romantic modern final', why: 'Serious farm-to-table dinner with strong atmosphere and occasion feel.', booking: 'Reserve early for Friday or Monday if choosing it.', siteUrl: 'https://www.pradorestaurante.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Prado%20Restaurant%20Lisbon%20Portugal' },
    { id: 'oficio', rank: 5, name: 'Ofício', role: 'Central modern Portuguese / wine', verdict: 'Add', tags: 'top group romantic modern final', why: 'Creative, fun, group-friendly, and central enough to use as a polished default.', booking: 'Reserve for prime dinner.', siteUrl: 'https://www.oficio.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Of%C3%ADcio%20Lisbon%20Portugal' },
    { id: 'taberna-rua-flores', rank: 6, name: 'Taberna da Rua das Flores', role: 'Top-3 vibe if patience exists', verdict: 'Add', tags: 'top romantic group traditional wine', why: 'Tiny old Lisbon room, sharing plates, wine, loud/fun energy, no pretension.', booking: 'No reservations. Arrive around 7:45pm, put name down, drink wine nearby.', siteUrl: 'https://taberneiros.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20da%20Rua%20das%20Flores%20Lisbon%20Portugal' },
    { id: 'a-nossa-casa', rank: 7, name: 'A Nossa Casa', role: 'Intimate Portuguese-Brazilian sharing plates', verdict: 'Add', tags: 'romantic group modern', why: 'Personal, intimate, discovery-feeling dinner with strong sharing energy.', booking: 'Essential; phone/Instagram. Sunday/Monday not safe until verified.', siteUrl: 'https://www.instagram.com/anossacasa.restaurante/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=A%20Nossa%20Casa%20Lisbon%20Portugal' },
    { id: 'taberna-sal-grosso', rank: 8, name: 'Taberna Sal Grosso', role: 'Practical neo-taberna backup', verdict: 'Add', tags: 'group traditional backup lunch', why: 'Modern tavern experience with strong value and less fuss than harder no-reservation classics.', booking: 'Book ahead; verify Alfama vs São Bento location.', siteUrl: 'https://tabernasalgrosso.pt/en/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20Sal%20Grosso%20Lisbon%20Portugal' },
    { id: 'ramiro', rank: 9, name: 'Ramiro', role: 'Iconic seafood feast', verdict: 'Add', tags: 'top group seafood traditional', why: 'Famous for a reason. Better as a deliberate seafood blowout than a casual first-night idea.', booking: 'Manage wait/reservation expectations.', siteUrl: 'https://www.cervejariaramiro.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cervejaria%20Ramiro%20Lisbon%20Portugal' },
    { id: 'rosamar', rank: 10, name: 'Rosamar', role: 'Stylish seafood / oyster bar', verdict: 'Add', tags: 'romantic group seafood wine', why: 'More stylish and date-night-friendly than the classic seafood rooms.', booking: 'Reserve, especially weekend.', siteUrl: 'https://reservation.umai.io/en/widget/rosamar', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rosamar%20Lisbon%20Portugal' },
    { id: 'prado-wine-bar', rank: 11, name: 'Prado Wine Bar', role: 'Arrival or final-night utility pick', verdict: 'Add', tags: 'top romantic wine final arrival walkable', why: 'Perfect near-home-base wine and small plates for soft landing or disciplined final night.', booking: 'Reserve/call; small space.', siteUrl: 'https://pradowinebar.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Prado%20Wine%20Bar%20Lisbon%20Portugal' },
    { id: 'by-the-wine', rank: 12, name: 'By The Wine', role: 'Easy central wine and snacks', verdict: 'Add', tags: 'wine final arrival backup group', why: 'Low-friction Chiado wine option, easier and roomier than some top-tier spots.', booking: 'Reserve for dinner; easier for drinks.', siteUrl: 'https://www.bythewine.pt/en/index.html', mapUrl: 'https://www.google.com/maps/search/?api=1&query=By%20The%20Wine%20Lisbon%20Portugal' },
    { id: 'sea-me', rank: 13, name: 'Sea Me', role: 'Polished seafood fallback', verdict: 'Maybe/Add', tags: 'seafood group backup', why: 'Convenient, polished seafood if Ramiro/Rosamar logistics are annoying.', booking: 'Reserve if making it dinner.', siteUrl: 'https://www.peixariamoderna.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sea%20Me%20Lisbon%20Portugal' },
    { id: 'solar-presuntos', rank: 14, name: 'Solar dos Presuntos', role: 'Old-school Portuguese institution', verdict: 'Maybe/Add', tags: 'traditional seafood group backup', why: 'Classic Lisbon institution with broad appeal and useful seafood/meat range.', booking: 'Reserve for four.', siteUrl: 'https://solardospresuntos.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Solar%20dos%20Presuntos%20Lisbon%20Portugal' },
    { id: 'o-frade', rank: 15, name: 'O Frade', role: 'Relaxed destination Portuguese', verdict: 'Maybe/Add', tags: 'traditional modern romantic group', why: 'Excellent Portuguese/Alentejo/petiscos lane; relaxed but still destination-worthy.', booking: 'Reserve if choosing it.', siteUrl: 'https://www.ofrade.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=O%20Frade%20Lisbon%20Portugal' },
    { id: 'pica-pau', rank: 16, name: 'Pica-Pau', role: 'Arrival small plates', verdict: 'Maybe/Add', tags: 'arrival group traditional casual', why: 'Portuguese small plates that fit a first lunch/dinner without overcommitting.', booking: 'Useful arrival fallback.', siteUrl: 'https://www.picapau.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pica-Pau%20Lisbon%20Portugal' },
    { id: 'cantinho-avillez', rank: 17, name: 'Cantinho do Avillez', role: 'Polished central fallback', verdict: 'Maybe', tags: 'arrival group backup', why: 'Easy and central, but less personality than the top picks.', booking: 'Reserve if needed.', siteUrl: 'https://www.bairrodoavillez.pt/en/cantinho-do-avillez', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cantinho%20do%20Avillez%20Lisbon%20Portugal' },
    { id: 'da-noi', rank: 18, name: 'Da Noi', role: 'Fun non-Portuguese night-out backup', verdict: 'Maybe', tags: 'romantic group backup final', why: 'Stylish cocktail-forward option if the group wants a break from Portuguese food.', booking: 'Mon-Sat; Sunday closed in current signals.', siteUrl: 'https://www.danoilisboa.com/reservations', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Da%20Noi%20Lisbon%20Portugal' },
    { id: 'a-obra', rank: 19, name: 'A Obra', role: 'Green Street wine/snacks backup', verdict: 'Maybe', tags: 'wine backup casual modern', why: 'Attractive low-pressure natural-wine and seasonal plates stop.', booking: 'Verify reservation path directly.', siteUrl: 'https://www.instagram.com/a_obra_21/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=A%20Obra%20Lisbon%20Portugal' },
    { id: 'faz-frio', rank: 20, name: 'Faz Frio', role: 'Historic drinks/snacks backup', verdict: 'Maybe', tags: 'traditional wine backup drinks', why: 'Atmospheric historic Príncipe Real room; better as backup/drinks than destination dinner.', booking: 'Reserve or verify walk-in capacity.', siteUrl: 'https://www.instagram.com/fazfrio/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Faz%20Frio%20Lisbon%20Portugal' },
    { id: 'frade-dos-mares', rank: 21, name: 'Frade dos Mares', role: 'Backup seafood', verdict: 'Maybe', tags: 'seafood traditional backup', why: 'Reliable seafood if the higher-ceiling choices fail.', booking: 'TheFork/booking signals; verify.', siteUrl: 'https://www.facebook.com/Frade.dos.Mares12/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Frade%20dos%20Mares%20Lisbon%20Portugal' },
    { id: 'frangasqueira', rank: 22, name: 'Frangasqueira Nacional', role: 'Casual takeaway chicken', verdict: 'Maybe', tags: 'casual backup lunch', why: 'Cheap, satisfying piri-piri chicken if nearby. Not a sit-down dinner.', booking: 'Walk-up only; verify same day.', siteUrl: 'https://www.instagram.com/frangasqueiranacional/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Frangasqueira%20Nacional%20Lisbon%20Portugal' },
    { id: 'time-out-market', rank: 23, name: 'Time Out Market Lisboa', role: 'Emergency no-reservation fallback', verdict: 'Skip/Backup', tags: 'backup casual arrival', why: 'Solves group logistics, but crowded and not a curated dinner.', booking: 'No reservations.', siteUrl: 'https://www.timeout.com/time-out-market-lisboa', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Time%20Out%20Market%20Lisboa%20Portugal' },
    { id: 'hifen', rank: 24, name: 'Hífen Cascais', role: 'Default Cascais group dinner', verdict: 'Add', tags: 'cascais group seafood top', why: 'Best overall Cascais fit: central, fun, cocktail-friendly, shareable.', booking: 'Reserve for Sunday if doing Cascais.', siteUrl: 'https://www.hifenrestaurant.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hifen%20Cascais%20Portugal' },
    { id: 'o-pescador', rank: 25, name: 'O Pescador Cascais', role: 'Classic Cascais seafood', verdict: 'Add', tags: 'cascais seafood traditional', why: 'Best classic central Cascais fish/seafood dinner.', booking: 'Reserve; verify Sunday dinner.', siteUrl: 'https://www.restaurantepescador.com/en/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=O%20Pescador%20Cascais%20Portugal' },
    { id: 'moules-gin', rank: 26, name: 'Moules & Gin Cascais', role: 'Casual fun Cascais fallback', verdict: 'Maybe', tags: 'cascais group backup casual', why: 'Mussels + gin is easy, casual, and good if the group is tired.', booking: 'TheFork reservations; verify Sunday.', siteUrl: 'https://moules.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Moules%20and%20Gin%20Cascais%20Portugal' },
    { id: 'mar-do-inferno', rank: 27, name: 'Mar do Inferno Cascais', role: 'Cliffside seafood splurge', verdict: 'Maybe', tags: 'cascais seafood romantic splurge', why: 'Scenic shellfish drama near Boca do Inferno, pricier and less central.', booking: 'Reserve terrace/window timing.', siteUrl: 'https://www.mardoinferno.pt/en', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mar%20do%20Inferno%20Cascais%20Portugal' },
    { id: 'furnas-guincho', rank: 28, name: 'Furnas do Guincho', role: 'Atlantic-view seafood splurge', verdict: 'Maybe', tags: 'cascais seafood romantic splurge', why: 'Dramatic ocean setting, but requires extra Uber logistics after Sintra.', booking: 'Reserve and verify hours.', siteUrl: 'https://www.furnasdoguincho.pt/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Furnas%20do%20Guincho%20Cascais%20Portugal' },
    { id: 'monte-mar', rank: 29, name: 'Monte Mar Cascais', role: 'Polished ocean-view backup', verdict: 'Maybe', tags: 'cascais seafood romantic splurge backup', why: 'Elegant seafood-by-the-Atlantic option; less convenient than Hífen/O Pescador.', booking: 'Reserve and verify hours.', siteUrl: 'https://www.montemar.pt/en/Cascais', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Monte%20Mar%20Cascais%20Portugal' },
    { id: 'mariscaria-cascais', rank: 30, name: 'Mariscaria Cascais', role: 'Emergency central seafood fallback', verdict: 'Skip/Backup', tags: 'cascais seafood backup', why: 'Convenient if O Pescador is full; lower ceiling.', booking: 'Verify booking/hours.', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mariscaria%20Cascais%20Portugal' }
  ],
  bars: [
    ['pavilhao-chines', 1, 'Pavilhão Chinês', 'Memorable first/Friday bar', 'Add', 'Quirky old-world cocktail-room experience.', 'https://www.google.com/maps/search/?api=1&query=Pavilh%C3%A3o%20Chin%C3%AAs%20Lisbon%20Portugal', 'https://www.google.com/maps/search/?api=1&query=Pavilh%C3%A3o%20Chin%C3%AAs%20Lisbon%20Portugal'],
    ['lumi-rooftop', 2, 'Lumi Rooftop', 'Sunset drinks/views', 'Add', 'Polished skyline moment; go for drinks more than dinner.', 'https://www.thelumiares.com/eat-and-drink/lumi-rooftop/', 'https://www.google.com/maps/search/?api=1&query=Lumi%20Rooftop%20Lisbon%20Portugal'],
    ['park-bar', 3, 'Park Bar', 'Saturday sunset if seats happen', 'Maybe/Add', 'Arrive early for best shot; useful fun/social rooftop.', 'https://www.google.com/maps/search/?api=1&query=Park%20Bar%20Lisbon%20Portugal', 'https://www.google.com/maps/search/?api=1&query=Park%20Bar%20Lisbon%20Portugal'],
    ['o-faia', 4, 'O Faia - Casa de Fado', 'Premium fado dinner/show', 'Maybe/Add', 'Turns dinner into a full cultural evening; expensive and longer commitment.', 'https://www.ofaia.com/', 'https://www.google.com/maps/search/?api=1&query=O%20Faia%20Casa%20de%20Fado%20Lisbon%20Portugal'],
    ['clube-de-fado', 5, 'Clube de Fado', 'Proper fado experience', 'Maybe', 'Choose only if the group actively wants a fado night.', 'https://www.clube-de-fado.com/', 'https://www.google.com/maps/search/?api=1&query=Clube%20de%20Fado%20Lisbon%20Portugal'],
    ['mesa-frades', 6, 'Mesa de Frades', 'Atmospheric fado room', 'Maybe', 'Beautiful tile-room fado option; verify times and booking.', 'https://www.google.com/maps/search/?api=1&query=Mesa%20de%20Frades%20Lisbon%20Portugal', 'https://www.google.com/maps/search/?api=1&query=Mesa%20de%20Frades%20Lisbon%20Portugal'],
    ['red-frog', 7, 'Red Frog', 'Cocktail-quality night', 'Maybe', 'Use if the group wants serious cocktails instead of roaming.', 'https://www.redfrog.pt/', 'https://www.google.com/maps/search/?api=1&query=Red%20Frog%20Lisbon%20Portugal'],
    ['monkey-mash', 8, 'Monkey Mash', 'Fun cocktail backup', 'Maybe', 'Cocktail-quality night with more playful energy.', 'https://www.monkeymash.pt/', 'https://www.google.com/maps/search/?api=1&query=Monkey%20Mash%20Lisbon%20Portugal'],
    ['rocco', 9, 'Rocco', 'Glam interiors / drinks only', 'Maybe', 'Gorgeous hotel bar moment; do not rank as dinner priority.', 'https://www.rocco.pt/en/homepage', 'https://www.google.com/maps/search/?api=1&query=Rocco%20The%20Ivens%20Lisbon%20Portugal'],
    ['manteigaria', 10, 'Manteigaria Chiado', 'Definitely-do nata stop', 'Add', 'Primary pastel de nata recommendation: central, excellent, production visible through glass.', 'https://manteigaria.com/en/', 'https://www.google.com/maps/search/?api=1&query=Manteigaria%20Rua%20do%20Loreto%202%20Lisbon%20Portugal'],
    ['pasteis-belem', 11, 'Pastéis de Belém', 'Tradition stop if line is sane', 'Maybe/Add', 'Worth doing during Belém, but Manteigaria is the easier definitely-do.', 'https://pasteisdebelem.pt/en/', 'https://www.google.com/maps/search/?api=1&query=Past%C3%A9is%20de%20Bel%C3%A9m%20Lisbon%20Portugal'],
    ['fabrica-coffee', 12, 'Fábrica Coffee Roasters', 'Morning coffee utility pin', 'Maybe', 'Reliable specialty coffee near the base depending branch.', 'https://fabricacoffeeroasters.com/', 'https://www.google.com/maps/search/?api=1&query=F%C3%A1brica%20Coffee%20Roasters%20Lisbon%20Portugal']
  ],
  activities: [
    { id: 'alfama', name: 'Alfama golden-hour walk', verdict: 'Add', why: 'Sé Cathedral → Santa Luzia → Portas do Sol → Alfama lanes.', price: 'Free', time: '90-150 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alfama%20Lisbon%20Portugal' },
    { id: 'regaleira', name: 'Quinta da Regaleira', verdict: 'Add', why: 'Sintra anchor: weird, romantic, memorable, and worth booking directly.', price: 'Book direct', time: '2-2.5 hours', siteUrl: 'https://www.regaleira.pt/en/visits', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Quinta%20da%20Regaleira%20Sintra%20Portugal' },
    { id: 'monserrate', name: 'Monserrate Palace', verdict: 'Add', why: 'Calmer, greener, more romantic second Sintra stop than Pena for this group.', price: 'Timed ticket useful', time: '90-120 minutes', siteUrl: 'https://www.parquesdesintra.pt/en/parks-monuments/park-and-palace-of-monserrate/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Monserrate%20Palace%20Sintra%20Portugal' },
    { id: 'pena', name: 'Pena Palace', verdict: 'Maybe', why: 'Iconic/photo-famous alternate if the group wants the colorful palace moment.', price: 'Timed entry essential', time: '2-3 hours', siteUrl: 'https://www.parquesdesintra.pt/en/parks-monuments/park-and-national-palace-of-pena/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pena%20Palace%20Sintra%20Portugal' },
    { id: 'cascais', name: 'Cascais sunset/dinner', verdict: 'Maybe/Add', why: 'Good add-on only as sunset/dinner, not a full second sightseeing day.', price: 'Dinner reservation', time: '3-4 hours', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cascais%20Portugal' },
    { id: 'belem-waterfront', name: 'Belém waterfront', verdict: 'Add', why: 'Nata, monastery exterior/church if lines are sane, tower exterior, MAAT river walk.', price: 'Mostly free', time: '3-5 hours', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bel%C3%A9m%20Lisbon%20Portugal' },
    { id: 'lx-factory', name: 'LX Factory', verdict: 'Maybe/Add', why: 'Shops, bookstore, casual drinks, easy Saturday afternoon pivot.', price: 'Free entry', time: '60-120 minutes', siteUrl: 'https://lxfactory.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=LX%20Factory%20Lisbon%20Portugal' },
    { id: 'senhora-monte', name: 'Senhora do Monte', verdict: 'Maybe', why: 'One last big Lisbon view if Monday energy is good.', price: 'Free', time: '30-60 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Miradouro%20da%20Senhora%20do%20Monte%20Lisbon' },
    { id: 'conserveira', name: 'Conserveira de Lisboa', verdict: 'Add', why: 'Beautiful tinned-fish souvenirs two minutes from the Airbnb.', price: 'Souvenirs', time: '15-30 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Conserveira%20de%20Lisboa%20Rua%20dos%20Bacalhoeiros%2034' },
    { id: 'loja-conservas', name: 'Loja das Conservas', verdict: 'Maybe/Add', why: 'Another strong tinned-fish gift/souvenir stop.', price: 'Souvenirs', time: '15-30 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Loja%20das%20Conservas%20Rua%20do%20Arsenal%20130%20Lisbon' },
    { id: 'a-vida-portuguesa', name: 'A Vida Portuguesa', verdict: 'Maybe/Add', why: 'Design/home/gift browsing for the final day.', price: 'Souvenirs', time: '30-60 minutes', siteUrl: 'https://www.avidaportuguesa.com/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=A%20Vida%20Portuguesa%20Lisbon' },
    { id: 'bertrand', name: 'Bertrand / Chiado', verdict: 'Maybe', why: 'Bookish/literary stop if the group wants it.', price: 'Free browsing', time: '20-45 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Livraria%20Bertrand%20Chiado%20Lisbon' },
    { id: 'carmo', name: 'Carmo Convent', verdict: 'Rainy Add', why: 'Good heat/rain pivot near Chiado.', price: 'Ticketed', time: '30-60 minutes', siteUrl: '', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Carmo%20Convent%20Lisbon' },
    { id: 'tile-museum', name: 'Tile Museum', verdict: 'Rainy Maybe', why: 'Rain/heat backup if the group wants a museum.', price: 'Ticketed', time: '60-90 minutes', siteUrl: 'https://www.museudoazulejo.gov.pt/en-GB/Default.aspx', mapUrl: 'https://www.google.com/maps/search/?api=1&query=National%20Tile%20Museum%20Lisbon' },
    { id: 'gulbenkian', name: 'Gulbenkian', verdict: 'Rainy Maybe', why: 'Strong museum backup, but farther from the core.', price: 'Ticketed', time: '60-120 minutes', siteUrl: 'https://gulbenkian.pt/museu/en/', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Calouste%20Gulbenkian%20Museum%20Lisbon' }
  ],
  warnings: [
    ['tram-28', 'Tram 28 as a plan', 'skip', 'Iconic, but likely crowded and hot. Photograph it or ride only if timing is magically easy.', 'https://www.google.com/maps/search/?api=1&query=Tram%2028%20Lisbon'],
    ['santa-justa', 'Santa Justa Lift line', 'skip', 'See it from below or access Carmo/Chiado via nearby streets/elevators.', 'https://www.google.com/maps/search/?api=1&query=Santa%20Justa%20Lift%20Lisbon'],
    ['belem-tower', 'Belém Tower interior', 'maybe', 'Exterior/photo stop only unless official access reopens closer to the trip.', 'https://www.google.com/maps/search/?api=1&query=Bel%C3%A9m%20Tower%20Lisbon'],
    ['sintra-combo', 'Sintra + Cascais + Cabo da Roca combo day', 'skip', 'Too much transit, not enough joy. Cascais is dinner/sunset only if added.', 'https://www.google.com/maps/search/?api=1&query=Cabo%20da%20Roca%20Portugal'],
    ['pink-street', 'Pink Street as the main night', 'skip', 'Pass through if nearby, then move on.', 'https://www.google.com/maps/search/?api=1&query=Pink%20Street%20Lisbon'],
    ['monday-chaos', 'Monday night chaos', 'skip', 'No Bairro Alto, midnight fado, second bottle, or far-away hard-to-control dinner.', 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport']
  ],
  events: [
    ['rock-in-rio-jun27', 'Rock in Rio Lisboa', 'Sat Jun 27', 'Maybe', 'Parque Tejo', 'Rod Stewart, Cyndi Lauper, Shaggy, 4 Non Blondes, Joss Stone, etc. Treat as a replacement for a Lisbon night.', 'https://rockinriolisboa.pt/', 'https://www.google.com/maps/search/?api=1&query=Parque%20Tejo%20Lisbon'],
    ['rock-in-rio-jun28', 'Rock in Rio Lisboa', 'Sun Jun 28', 'Maybe', 'Parque Tejo', '21 Savage, Central Cee, Rema, Lola Índigo, CeeLo Green, etc. Conflicts with Sintra/Cascais recovery.', 'https://rockinriolisboa.pt/', 'https://www.google.com/maps/search/?api=1&query=Parque%20Tejo%20Lisbon']
  ],
  routes: [
    { id: 'arrival-river', title: 'Arrival River Walk', stops: ['Rua da Madalena', 'Praça do Comércio', 'Ribeira das Naus', 'Chiado', 'Carmo'], note: 'Best first afternoon spine if bags are handled.' },
    { id: 'alfama-gold', title: 'Alfama Golden Hour', stops: ['Rua da Madalena', 'Sé Cathedral', 'Santa Luzia', 'Portas do Sol', 'Alfama lanes'], note: 'Do this slowly. No Tram 28 line required.' },
    { id: 'belem-water', title: 'Belém Waterfront', stops: ['Pastéis de Belém', 'Jerónimos exterior/church', 'Belém Tower exterior', 'MAAT', 'LX Factory'], note: 'Saturday default if heat/lines are manageable.' },
    { id: 'sintra-cascais', title: 'Sintra + Cascais Controlled Big Day', stops: ['Rossio/private transfer', 'Quinta da Regaleira', 'Sintra town', 'Monserrate', 'Cascais dinner', 'Return Lisbon'], note: 'Cascais is sunset/dinner, not a second full sightseeing day.' },
    { id: 'final-night', title: 'Final Night Discipline', stops: ['Souvenir run', 'Manteigaria', 'Pack', 'Prado Wine Bar / early dinner', 'one toast', 'home by 10:30'], note: 'The 6:00am Dublin flight is the boss.' }
  ],
  mapPins: [
    ['base', 'Rua da Madalena', 50, 55, '#quick-facts'],
    ['alfama', 'Alfama / Santa Luzia', 61, 43, '#plan'],
    ['chiado', 'Chiado / Carmo', 38, 56, '#plan'],
    ['belem', 'Belém', 12, 68, '#plan'],
    ['lx', 'LX Factory', 22, 63, '#plan'],
    ['sintra', 'Sintra', 16, 18, '#plan'],
    ['cascais', 'Cascais', 8, 88, '#plan'],
    ['airport', 'Airport', 82, 18, '#booking'],
    ['river', 'Praça do Comércio', 49, 69, '#routes']
  ],
  stamps: [
    ['riverfront', 'First river walk', 'Praça do Comércio glow'],
    ['alfama', 'Alfama golden hour', 'Santa Luzia / Portas do Sol'],
    ['nata', 'Manteigaria nata', 'Chiado sugar high'],
    ['seafood', 'Seafood feast', 'Ramiro / Rosamar / Cascais'],
    ['regaleira', 'Regaleira well', 'Sintra anchor'],
    ['monserrate', 'Monserrate gardens', 'calmer palace magic'],
    ['cascais', 'Cascais sunset', 'coast after Sintra'],
    ['final-toast', 'Final toast', 'home before 10:30']
  ],
  bookingTimeline: [
    ['Now / ASAP', 'Top Lisbon dinners', 'high', ['Try O Velho Eurico, Canalha, Bar Alimentar, Prado, Ofício, or Taberna strategy.', 'Do not rely on Sunday/Monday for independent favorites until verified.']],
    ['Now / ASAP', 'Sintra tickets', 'high', ['Book Quinta da Regaleira directly.', 'Choose Monserrate default or Pena alternate before timed-entry planning.']],
    ['Now / ASAP', 'Cascais dinner hold', 'medium', ['Reserve Hífen default or O Pescador classic seafood if doing Cascais.', 'Keep an easy Lisbon fallback if the group tires out.']],
    ['2-4 weeks ahead', 'Rooftop / fado choice', 'medium', ['Reserve Lumi sunset or O Faia/Clube/Mesa only if the group actually wants it.', 'Do not stack fado onto the Sintra night.']],
    ['Week of', 'Hours sanity check', 'high', ['Verify Sunday/Monday closures.', 'Check Belém Tower access and weather.']],
    ['Sunday/Monday', 'Airport discipline', 'high', ['Pre-book or confirm 3:30-3:45am airport transfer.', 'Pack before Monday dinner.']]
  ]
};
