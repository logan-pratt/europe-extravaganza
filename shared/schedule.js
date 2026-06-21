(function initTripSchedule(root) {
  const lisbonBase = {
    name: 'Rua da Madalena 214',
    area: 'Baixa / Alfama edge',
    address: 'Rua da Madalena 214, Lisbon 1100-204, Portugal',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon%201100-204%20Portugal'
  };

  const marlin = {
    name: 'Marlin Hotel Dublin',
    area: 'St Stephen’s Green / South Great George’s Street',
    address: "11 Bow Lane East, St Stephen’s Green, Dublin 2, D02 AY81, Ireland",
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Marlin%20Hotel%20Dublin%2011%20Bow%20Lane%20East'
  };

  const kimpton = {
    name: 'Kimpton Fitzroy London',
    area: 'Bloomsbury / Russell Square',
    address: 'Russell Square, London WC1B 5BE, United Kingdom',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kimpton%20Fitzroy%20London'
  };

  root.TRIP_SCHEDULE = [
    {
      date: '2026-06-25',
      city: 'lisbon',
      dayId: 'thu',
      label: 'Lisbon · Soft landing',
      lodging: lisbonBase,
      anchors: [
        {
          time: '11:50am',
          sortTime: '11:50',
          type: 'flight',
          title: 'Logan and Emily land at LIS',
          status: 'confirmed',
          critical: true,
          address: 'Aeroporto de Lisboa, 1749-078 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        },
        {
          time: 'Afternoon',
          sortTime: '15:00',
          type: 'lodging',
          title: 'Get to Rua da Madalena 214',
          status: 'planned',
          mapUrl: lisbonBase.mapUrl
        }
      ],
      suggest: {
        drink: ['pavilhao-chines', 'lumi-rooftop', 'park-bar'],
        dinner: ['prado-wine-bar', 'by-the-wine', 'pica-pau']
      },
      prep: ['Keep arrival day gentle.', 'Confirm bag-drop or luggage-storage plan if check-in timing is awkward.']
    },
    {
      date: '2026-06-26',
      city: 'lisbon',
      dayId: 'fri',
      label: 'Lisbon · Reunion + food tour',
      lodging: lisbonBase,
      anchors: [
        {
          time: 'Around 10:00am',
          sortTime: '10:00',
          type: 'arrival',
          title: 'Ashley and Max arrive',
          status: 'planned',
          address: 'Aeroporto de Lisboa, 1749-078 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        },
        {
          time: '4:50pm',
          sortTime: '16:50',
          type: 'meeting',
          title: 'Meet under Rua Augusta Arch',
          status: 'confirmed',
          critical: true,
          address: 'R. Augusta 2, 1100-053 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20Augusta%20Arch%20R.%20Augusta%202%20Lisboa%201100-053'
        },
        {
          time: '5:00-9:00pm',
          sortTime: '17:00',
          type: 'booking',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Oh! My Cod: 17 Tastings Lisbon Food Tour',
          status: 'confirmed',
          critical: true,
          walkMinutes: 1,
          walkMeters: 50,
          address: 'R. Augusta 2, 1100-053 Lisboa, Portugal',
          siteUrl: 'https://www.ohmycodtours.com/food-tours/lisbon-food-tour/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20Augusta%20Arch%20R.%20Augusta%202%20Lisboa%201100-053'
        }
      ],
      suggest: {
        lunch: ['frangasqueira', 'pica-pau', 'taberna-sal-grosso']
      },
      prep: ['Keep lunch small before 17 tastings.', 'Wear comfortable shoes for the four-hour walking tour.']
    },
    {
      date: '2026-06-27',
      city: 'lisbon',
      dayId: 'sat',
      label: 'Lisbon · Alfama + Taberna',
      lodging: lisbonBase,
      anchors: [
        {
          time: '9:30am',
          sortTime: '09:30',
          type: 'meal',
          title: 'Slow breakfast near Baixa',
          status: 'planned'
        },
        {
          time: '10:15am',
          sortTime: '10:15',
          type: 'transfer',
          title: 'Walk from Rua da Madalena to Sé Cathedral',
          status: 'planned',
          walkMinutes: 8,
          walkMeters: 600,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=S%C3%A9%20Cathedral%20Lisbon'
        },
        {
          time: '10:45am',
          sortTime: '10:45',
          type: 'sightseeing',
          title: 'Sé Cathedral quick stop, then continue uphill',
          status: 'planned',
          walkMinutes: 5,
          walkMeters: 350,
          address: 'Largo da Sé, 1100-585 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=S%C3%A9%20Cathedral%20Lisbon'
        },
        {
          time: '11:15am',
          sortTime: '11:15',
          type: 'sightseeing',
          title: 'Santa Luzia + Portas do Sol viewpoints',
          status: 'planned',
          walkMinutes: 6,
          walkMeters: 450,
          address: 'Largo das Portas do Sol, 1100-411 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Miradouro%20das%20Portas%20do%20Sol%20Lisbon'
        },
        {
          time: '11:45am',
          sortTime: '11:45',
          type: 'transfer',
          title: 'Walk from Portas do Sol to Castelo de São Jorge',
          status: 'planned',
          walkMinutes: 7,
          walkMeters: 500,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Castelo+de+S%C3%A3o+Jorge+Lisbon'
        },
        {
          time: '12:00-12:20pm',
          sortTime: '12:00',
          type: 'sightseeing',
          title: 'Castelo de São Jorge quick viewpoint stop',
          status: 'planned',
          critical: true,
          walkMinutes: 3,
          walkMeters: 200,
          address: 'R. de Santa Cruz do Castelo, 1100-129 Lisboa, Portugal',
          siteUrl: 'https://castelodesaojorge.pt/en/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Castelo+de+S%C3%A3o+Jorge+Lisbon'
        },
        {
          time: '12:30pm',
          sortTime: '12:30',
          type: 'reservation',
          title: 'O VINHAÇA: Tapas & Vinhos lunch',
          status: 'confirmed',
          critical: true,
          walkMinutes: 10,
          walkMeters: 700,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=O%20Vinhaca%20Tapas%20%26%20Vinhos%20Lisbon%20Portugal'
        },
        {
          time: '2:00pm',
          sortTime: '14:00',
          type: 'walk',
          title: 'Drift down through Alfama lanes after lunch',
          status: 'planned',
          walkMinutes: 8,
          walkMeters: 600
        },
        {
          time: '3:15pm',
          sortTime: '15:15',
          type: 'shopping',
          title: 'Souvenir loop: Conserveira, Loja das Conservas, A Vida Portuguesa, Bertrand',
          status: 'planned',
          walkMinutes: 12,
          walkMeters: 900,
          mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Conserveira+de+Lisboa&destination=Bertrand+Chiado&waypoints=Loja+das+Conservas%7CA+Vida+Portuguesa+Chiado'
        },
        {
          time: '4:30pm',
          sortTime: '16:30',
          type: 'snack',
          title: 'Manteigaria Chiado nata stop, then apartment reset',
          status: 'planned',
          walkMinutes: 5,
          walkMeters: 350,
          address: 'R. do Loreto 2, 1200-108 Lisboa, Portugal',
          siteUrl: 'https://manteigaria.com/en/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manteigaria%20Chiado%20Lisbon'
        },
        {
          time: '5:45pm',
          sortTime: '17:45',
          type: 'reservation',
          title: 'Walk to Taberna da Rua das Flores and put the name down',
          status: 'planned',
          critical: true,
          walkMinutes: 8,
          walkMeters: 600,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20da%20Rua%20das%20Flores%20Lisbon'
        },
        {
          time: '6:00-7:00pm',
          sortTime: '18:00',
          type: 'bar',
          title: 'Drink nearby in Chiado while waiting; pivot if 7:30pm looks ugly',
          status: 'planned',
          walkMinutes: 2,
          walkMeters: 150
        },
        {
          time: '7:00-9:00pm',
          sortTime: '19:00',
          type: 'reservation',
          title: 'Taberna da Rua das Flores dinner',
          status: 'planned',
          critical: true,
          walkMinutes: 1,
          walkMeters: 50,
          address: 'R. das Flores 103, 1200-193 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20da%20Rua%20das%20Flores%20Lisbon'
        }
      ],
      suggest: {
        lunch: ['o-vinhaca'],
        dinner: ['oficio', 'prado', 'a-nossa-casa']
      },
      prep: ['Skip Tram 28 and Santa Justa Lift lines — walk the hills.', 'O VINHAÇA is confirmed at 12:30pm, so keep the castle stop short.', 'Senhora do Monte is optional, not mandatory; protect legs for Sunday Sintra.', 'Taberna is walk-up: arrive ~5:45pm, put the name down, drink nearby, and set a hard pivot time.', 'Hold Ofício or Prado as a Saturday dinner backup if Taberna wait gets ugly.']
    },
    {
      date: '2026-06-28',
      city: 'lisbon',
      dayId: 'sun',
      label: 'Sintra + Cascais',
      lodging: lisbonBase,
      anchors: [
        {
          time: '6:45am',
          sortTime: '06:45',
          type: 'prep',
          title: 'Wake up',
          status: 'planned',
          critical: true,
          note: 'Grab-and-go breakfast only — no sit-down.'
        },
        {
          time: '7:25am',
          sortTime: '07:25',
          type: 'transfer',
          title: 'Leave Airbnb for Rossio Station',
          status: 'planned',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon',
          note: '~10 min walk; budget 10–15 min.'
        },
        {
          time: '7:35am',
          sortTime: '07:35',
          type: 'arrival',
          title: 'Arrive Rossio Station — buy/load CP tickets',
          status: 'planned',
          critical: true,
          address: 'Praça Dom Pedro IV, 1100-200 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rossio%20Station%20Lisbon',
          note: '~8 min to ticket, validate, and reach platform.'
        },
        {
          time: '7:45am',
          sortTime: '07:45',
          type: 'train',
          title: 'Train to Sintra (Rossio → Sintra)',
          status: 'planned',
          critical: true,
          leaveBy: '7:25am',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rossio%20Station%20Lisbon',
          note: 'CP Urbanos Linha de Sintra; backup 8:01am. Confirm destination Sintra (not Meleças).'
        },
        {
          time: 'Around 8:30am',
          sortTime: '08:30',
          type: 'transfer',
          title: 'Sintra Station → Pena (434 bus or Bolt)',
          status: 'planned',
          critical: true,
          note: 'If 434 line is long, switch to Bolt immediately — Pena entry is strict.'
        },
        {
          time: '10:00am',
          sortTime: '10:00',
          type: 'booking',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Pena Palace timed entry',
          status: 'confirmed',
          critical: true,
          address: 'Estrada da Pena, 2710-609 Sintra, Portugal',
          siteUrl: 'https://www.parquesdesintra.pt/en/parks-monuments/park-and-national-palace-of-pena/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pena%20Palace%20Sintra',
          note: 'Park entrance by 9:15am; Palace queue by 9:50am. Interior + terraces, then leave by 11:45am.'
        },
        {
          time: '11:35am',
          sortTime: '11:35',
          type: 'transfer',
          title: 'Pena → Quinta da Regaleira (walk, 434, or Bolt)',
          status: 'planned',
          critical: true,
          note: 'Walk 40–60 min (most reliable); 434 + walk 25–50 min w/ queue risk; Bolt 20–40 min if pickup works. Leave by 11:45am to walk; after 12:10pm taxi. Must be in by 1:30pm.'
        },
        {
          time: '12:30pm',
          sortTime: '12:30',
          type: 'booking',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Quinta da Regaleira timed entry',
          status: 'confirmed',
          critical: true,
          address: 'R. Barbosa du Bocage 5, 2710-567 Sintra, Portugal',
          siteUrl: 'https://www.regaleira.pt/en/visits',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Quinta%20da%20Regaleira%20Sintra',
          note: '1-hour grace period (in by 1:30pm). Hit Initiation Well + tunnels first.'
        },
        {
          time: '2:30pm',
          sortTime: '14:30',
          type: 'meal',
          title: 'Late lunch / snack in Sintra historic center',
          status: 'planned',
          note: 'No real lunch between Pena and Regaleira — eat after.'
        },
        {
          time: '~3:45pm',
          sortTime: '15:45',
          type: 'transfer',
          title: 'Sintra → Cascais/Guincho (Bolt/taxi)',
          status: 'planned',
          note: 'No good direct train — rideshare; do not loop through Lisbon.'
        },
        {
          time: '8:00pm',
          sortTime: '20:00',
          type: 'reservation',
          title: 'Furnas do Guincho dinner',
          status: 'confirmed',
          critical: true,
          leaveBy: 'Arrive 7:45pm',
          siteUrl: 'https://www.furnasdoguincho.pt/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Furnas%20do%20Guincho%20Cascais',
          address: 'Estrada do Guincho, 2750-642 Cascais, Portugal',
          booking: { confirmation: 'FG-2026-0628', reservedAs: 'Pratt', phone: '+351 21 487 0388' },
          note: 'On the Guincho coast — not central Cascais; budget extra transfer time.'
        },
        {
          time: '~10:30pm',
          sortTime: '22:30',
          type: 'train',
          title: 'Cascais → Cais do Sodré (CP Cascais line)',
          status: 'planned',
          note: 'Bolt from Furnas to Cascais Station; Bolt from Cais do Sodré back to Airbnb.'
        }
      ],
      prep: ['Buy or plan Sintra train timing the night before.', 'Assume rideshare/private transfer for the awkward Sintra to Guincho/Cascais leg.', 'Bring walking shoes, sunscreen, water, and a light layer.'],
      prepPreviousNight: ['Check Pena and Regaleira tickets.', 'Set early alarm for Sintra train timing.', 'Confirm how to get from Sintra to Furnas do Guincho.']
    },
    {
      date: '2026-06-29',
      city: 'lisbon',
      dayId: 'mon',
      label: 'Lisbon · Belém + sunset cruise',
      lodging: lisbonBase,
      anchors: [
        {
          time: '8:45am',
          sortTime: '08:45',
          type: 'meal',
          title: 'Breakfast near Baixa — start controlled',
          status: 'planned'
        },
        {
          time: '9:45am',
          sortTime: '09:45',
          type: 'prep',
          title: 'Pack Dublin flight bags before heading out',
          status: 'planned',
          critical: true,
          note: 'Stage passports, wedding clothes, chargers, meds, toiletries, airport outfits.'
        },
        {
          time: '10:45am',
          sortTime: '10:45',
          type: 'transfer',
          title: 'Bolt/taxi from Rua da Madalena to Belém',
          status: 'planned',
          mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Rua+da+Madalena+214,+Lisboa&destination=Past%C3%A9is+de+Bel%C3%A9m',
          note: '20–30 min drive; do not depend on tram timing.'
        },
        {
          time: '11:15am',
          sortTime: '11:15',
          type: 'sightseeing',
          title: 'Pastéis de Belém, then Jerónimos exterior photos',
          status: 'planned',
          address: 'R. de Belém 84-92, 1300-085 Lisboa, Portugal',
          siteUrl: 'https://pasteisdebelem.pt/en/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Past%C3%A9is%20de%20Bel%C3%A9m%20Lisbon',
          note: 'Jerónimos and Belém Tower interiors are Monday-closed.'
        },
        {
          time: '12:15pm',
          sortTime: '12:15',
          type: 'sightseeing',
          title: 'Waterfront walk: Monument to the Discoveries + Belém Tower exterior',
          status: 'planned',
          walkMinutes: 5,
          walkMeters: 400,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Padr%C3%A3o%20dos%20Descobrimentos%20Lisbon'
        },
        {
          time: '12:45pm',
          sortTime: '12:45',
          type: 'reservation',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Lunch at Canalha (main Monday meal)',
          status: 'confirmed',
          critical: true,
          walkMinutes: 8,
          walkMeters: 600,
          address: 'Av. de Brasília 202, 1400-038 Lisboa, Portugal',
          siteUrl: 'https://www.canalha.pt/homepage/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Canalha%20Lisbon%20Portugal'
        },
        {
          time: '3:15pm',
          sortTime: '15:15',
          type: 'optional',
          title: 'Optional MAAT or riverside coffee',
          status: 'tentative',
          walkMinutes: 4,
          walkMeters: 300,
          address: 'Av. de Brasília, Central Tejo, 1300-598 Lisboa, Portugal',
          siteUrl: 'https://www.maat.pt/en/plan-a-visit',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=MAAT%20Lisbon'
        },
        {
          time: '4:30pm',
          sortTime: '16:30',
          type: 'transfer',
          title: 'Bolt/taxi back to Rua da Madalena',
          status: 'planned',
          mapUrl: lisbonBase.mapUrl,
          note: 'Build in late-afternoon traffic buffer.'
        },
        {
          time: '5:05pm',
          sortTime: '17:05',
          type: 'prep',
          title: 'Apartment reset: finish packing, change for cruise, stage airport bags',
          status: 'planned',
          critical: true
        },
        {
          time: '6:00pm',
          sortTime: '18:00',
          type: 'transfer',
          title: 'Bolt/taxi to Doca de Alcântara, Gate 2',
          status: 'planned',
          critical: true,
          leaveBy: '6:00pm',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Doca%20de%20Alc%C3%A2ntara%20Gate%202%20R.%20da%20Cintura%20do%20Porto%20de%20Lisboa%201350-355%20Lisboa'
        },
        {
          time: '6:30pm',
          sortTime: '18:30',
          type: 'arrival',
          title: 'Arrive Doca de Alcântara meeting point (Gate 2)',
          status: 'planned',
          critical: true,
          address: 'R. da Cintura do Porto de Lisboa 1350, 1350-355 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Doca%20de%20Alc%C3%A2ntara%20Gate%202%20R.%20da%20Cintura%20do%20Porto%20de%20Lisboa%201350-355%20Lisboa',
          note: 'R. da Cintura do Porto de Lisboa 1350, Gate 2. Arrive 15 min before departure or lose the slot.'
        },
        {
          time: '7:00pm',
          sortTime: '19:00',
          type: 'booking',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Sunset boat cruise departs',
          status: 'confirmed',
          critical: true,
          siteUrl: 'https://l4ab.adj.st/bookings/7AVYZVOUS96LR63QR3EOIP97B6APFR1V/details?adj_t=6oimkb3_lut0srj&adj_deep_link=gyg%3A%2F%2Fbookings%2F7AVYZVOUS96LR63QR3EOIP97B6APFR1V%2Fdetails%3Fvisitor_id%3D3ATNRN99QG36BQY57XJ308TLSJJGUF6E%26utm_source%3Dgetyourguide%26utm_medium%3Demail_transactional%26utm_campaign%3Dshopping_cart_confirmation_v2%26utm_content%3Dbooking_summary_activity_details_move_v3&adj_fallback=https%3A%2F%2Fwww.getyourguide.com%2Fbooking%2F7AVYZVOUS96LR63QR3EOIP97B6APFR1V%3Fvisitor_id%3D3ATNRN99QG36BQY57XJ308TLSJJGUF6E%26utm_source%3Dgetyourguide%26utm_medium%3Demail_transactional%26utm_campaign%3Dshopping_cart_confirmation_v2%26utm_content%3Dbooking_summary_activity_details_move_v3&adj_redirect=https%3A%2F%2Fwww.getyourguide.com%2Fbooking%2F7AVYZVOUS96LR63QR3EOIP97B6APFR1V%3Fvisitor_id%3D3ATNRN99QG36BQY57XJ308TLSJJGUF6E%26utm_source%3Dgetyourguide%26utm_medium%3Demail_transactional%26utm_campaign%3Dshopping_cart_confirmation_v2%26utm_content%3Dbooking_summary_activity_details_move_v3&visitor_id=3ATNRN99QG36BQY57XJ308TLSJJGUF6E&utm_source=getyourguide&utm_medium=email_transactional&utm_campaign=shopping_cart_confirmation_v2&utm_content=booking_summary_activity_details_move_v3',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Doca%20de%20Alc%C3%A2ntara%20Gate%202%20R.%20da%20Cintura%20do%20Porto%20de%20Lisboa%201350-355%20Lisboa'
        },
        {
          time: '9:00-9:30pm',
          sortTime: '21:00',
          type: 'arrival',
          title: 'Cruise ends — Bolt back to Baixa',
          status: 'planned',
          mapUrl: lisbonBase.mapUrl
        },
        {
          time: 'Night',
          sortTime: '21:30',
          type: 'prep',
          title: '3:00am airport car driver is booked',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        }
      ],
      prep: ['Pack before leaving for Belém — you land back from the cruise at 9:00-9:30pm with a 3:00am airport driver booked.', 'Canalha is the Monday Belém lunch anchor; do not pivot to O Vinhaca.', 'Jerónimos and Belém Tower interiors are Monday-closed — exterior-first day.', 'Leave the apartment for the cruise by 6:00pm and skip any post-cruise dinner chase.', 'One drink max because of the 6:00am flight.'],
      prepPreviousNight: ['Protect Sunday recovery so Monday starts clean.', 'Re-check cruise meeting point: Doca de Alcântara, Gate 2.', 'Canalha is confirmed for 12:45pm.']
    },
    {
      date: '2026-06-30',
      city: 'kilkea',
      dayId: null,
      label: 'Lisbon to Kilkea',
      lodging: {
        name: 'Kilkea Castle',
        area: 'County Kildare',
        address: 'Kilkea, Castledermot, Co. Kildare, R14 XR82, Ireland',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kilkea%20Castle%20Kildare%20Ireland'
      },
      anchors: [
        {
          time: '3:00am',
          sortTime: '03:00',
          type: 'transfer',
          title: 'Car driver to Lisbon Airport',
          status: 'confirmed',
          critical: true,
          note: 'Booked driver pickup for the 6:00am LIS to Dublin flight.',
          address: 'Aeroporto de Lisboa, 1749-078 Lisboa, Portugal',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        },
        {
          time: '6:00am',
          sortTime: '06:00',
          type: 'flight',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'LIS to Dublin flight',
          status: 'confirmed',
          critical: true,
          leaveBy: '3:00am',
          address: 'Dublin Airport, Co. Dublin, K67 K8X0, Ireland',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dublin%20Airport'
        },
        {
          time: 'After landing',
          sortTime: '10:30',
          type: 'transfer',
          title: 'Dublin Airport to Kilkea Castle',
          status: 'planned',
          mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Dublin%20Airport&destination=Kilkea%20Castle%20Kildare%20Ireland&travelmode=driving'
        }
      ],
      prep: ['Keep passports and flight documents accessible.', 'Expect this day to be logistics-first.'],
      prepPreviousNight: ['Pack before dinner.', 'Car driver is booked for 3:00am.', 'Put passports and flight documents somewhere obvious.']
    },
    {
      date: '2026-07-01',
      city: 'kilkea',
      dayId: null,
      label: 'Kilkea · Wedding day',
      lodging: {
        name: 'Kilkea Castle',
        area: 'County Kildare',
        address: 'Kilkea, Castledermot, Co. Kildare, R14 XR82, Ireland',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kilkea%20Castle%20Kildare%20Ireland'
      },
      anchors: [
        {
          time: 'Wedding day',
          sortTime: '12:00',
          type: 'wedding',
          title: 'Taylor and Austin’s wedding',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kilkea%20Castle%20Kildare%20Ireland'
        }
      ],
      prep: ['Confirm ceremony timing, dress code, and transportation on site.']
    },
    {
      date: '2026-07-02',
      city: 'galway',
      dayId: 'thu',
      label: 'Kilkea to Galway',
      lodging: {
        name: 'Galway lodging',
        area: 'Galway city',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20Ireland'
      },
      anchors: [
        {
          time: 'Morning',
          sortTime: '10:00',
          type: 'transfer',
          title: 'Kilkea checkout and move toward Dublin Heuston',
          status: 'planned',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dublin%20Heuston'
        },
        {
          time: '1:02pm',
          sortTime: '13:02',
          type: 'train',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Dublin Heuston to Galway train',
          status: 'confirmed',
          critical: true,
          address: 'Dublin Heuston Station, Dublin 8, D08 HW07, Ireland',
          siteUrl: 'https://www.irishrail.ie/en-ie/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dublin%20Heuston'
        },
        {
          time: '3:50pm',
          sortTime: '15:50',
          type: 'arrival',
          title: 'Arrive Galway',
          status: 'confirmed',
          critical: true,
          address: 'Galway Ceannt Station, Eyre Square, Galway, H91 FHN3, Ireland',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station'
        }
      ],
      suggest: {
        drink: ['taaffes', 'tig-coili', 'tigh-neachtain'],
        dinner: ['cava-bodega', 'ard-bia-nimmos', 'ruibin']
      },
      prep: ['Keep luggage movement simple.', 'Set Friday Cliffs alarm before going out.'],
      prepPreviousNight: ['Confirm route from Kilkea to Dublin Heuston.', 'Keep train tickets handy.']
    },
    {
      date: '2026-07-03',
      city: 'dublin',
      dayId: 'fri',
      secondaryCity: 'galway',
      secondaryDayId: 'fri',
      label: 'Cliffs to Dublin',
      lodging: marlin,
      anchors: [
        {
          time: '7:45am',
          sortTime: '07:45',
          type: 'meeting',
          title: 'Meet Lally Tours outside HYDE Hotel',
          status: 'confirmed',
          critical: true,
          address: '10 Forster St, Galway, H91 TCP0, Ireland',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'
        },
        {
          time: '8:00am-~1:30pm',
          sortTime: '08:00',
          type: 'tour',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Cliffs of Moher half-day express',
          status: 'confirmed',
          critical: true,
          siteUrl: 'https://lallytours.com/tour/cliffs-of-moher-half-day-express/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cliffs%20of%20Moher'
        },
        {
          time: '3:05pm',
          sortTime: '15:05',
          type: 'train',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Galway to Dublin train',
          status: 'confirmed',
          critical: true,
          address: 'Galway Ceannt Station, Eyre Square, Galway, H91 FHN3, Ireland',
          siteUrl: 'https://www.irishrail.ie/en-ie/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station'
        },
        {
          time: '5:44pm',
          sortTime: '17:44',
          type: 'arrival',
          title: 'Arrive Dublin and transfer to Marlin',
          status: 'confirmed',
          critical: true,
          address: marlin.address,
          mapUrl: marlin.mapUrl
        }
      ],
      suggest: {
        dinner: ['mister-s', 'delahunt', 'library-street']
      },
      prep: ['Waterproof shell and grip-friendly shoes for the Cliffs.', 'Keep Friday lunch fast and station-minded.'],
      prepPreviousNight: ['Set HYDE Hotel alarm.', 'Pack layers and rain shell.', 'Know where bags go during the tour.']
    },
    {
      date: '2026-07-04',
      city: 'dublin',
      dayId: 'sat',
      label: 'Dublin · Guinness anchor',
      lodging: marlin,
      anchors: [
        {
          time: '12:00pm',
          sortTime: '12:00',
          type: 'tour',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Guinness Storehouse tour',
          status: 'confirmed',
          critical: true,
          address: 'St James Gate, Dublin 8, D08 VF8H, Ireland',
          siteUrl: 'https://www.guinness-storehouse.com/en/booking',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Guinness%20Storehouse%20Dublin'
        }
      ],
      suggest: {
        drink: ['cobblestone', 'long-hall', 'kehoes'],
        dinner: ['delahunt', 'library-street', 'mister-s']
      },
      prep: ['Build the day around Guinness rather than trying to squeeze it in.', 'Pick one evening direction after the tour: central pubs, dinner, or trad.']
    },
    {
      date: '2026-07-05',
      city: 'london',
      dayId: 'sun',
      secondaryCity: 'dublin',
      secondaryDayId: 'sun',
      label: 'Dublin to London',
      lodging: kimpton,
      anchors: [
        {
          time: 'Travel day',
          sortTime: '10:00',
          type: 'flight',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Fly Dublin to London',
          status: 'planned',
          critical: true,
          address: 'Dublin Airport, Co. Dublin, K67 K8X0, Ireland',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dublin%20Airport'
        },
        {
          time: 'Arrival',
          sortTime: '15:00',
          type: 'lodging',
          title: 'Check in at Kimpton Fitzroy London',
          status: 'planned',
          address: kimpton.address,
          mapUrl: kimpton.mapUrl
        }
      ],
      suggest: {
        dinner: ["The Harrison", "Noble Rot Lamb's Conduit", "Ciao Bella"]
      },
      prep: ['Keep the London arrival night soft.', 'Confirm exact flight time and airport route once booked.'],
      prepPreviousNight: ['Confirm Dublin airport departure timing.', 'Pack for London transfer.']
    },
    {
      date: '2026-07-06',
      city: 'london',
      dayId: 'mon',
      label: 'London · Wimbledon',
      lodging: kimpton,
      anchors: [
        {
          time: 'Morning',
          sortTime: '07:00',
          type: 'event',
          // TODO: booking — Pratt, confirm # ____, phone ____
          title: 'Wimbledon day',
          status: 'confirmed',
          critical: true,
          address: 'All England Lawn Tennis Club, Church Rd, London SW19 5AG, United Kingdom',
          siteUrl: 'https://www.wimbledon.com/en_GB/tickets/the_queue',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Wimbledon%20All%20England%20Lawn%20Tennis%20Club'
        }
      ],
      suggest: {
        dinner: ["Trullo", "The Tamil Prince", "Noble Rot Lamb's Conduit"]
      },
      prep: ['Hydrate, sunscreen, portable battery.', 'Expect transport crowds leaving Wimbledon.'],
      prepPreviousNight: ['Check Wimbledon ticket/queue plan.', 'Lay out sunscreen, hats, water, and portable battery.']
    },
    {
      date: '2026-07-07',
      city: 'london',
      dayId: 'tue',
      label: 'London · Open day',
      lodging: kimpton,
      anchors: [
        {
          time: 'Daytime',
          sortTime: '10:00',
          type: 'open',
          title: 'TBD London day',
          status: 'tbd'
        }
      ],
      options: ['Bath day trip candidate', 'Central London wandering', 'Food-forward London day'],
      suggest: {
        lunch: ["Noble Rot Lamb's Conduit", "Andrew Edmunds", "Honey & Co"],
        dinner: ["Andrew Edmunds", "Clos Maggiore", "Trullo"]
      },
      prep: ['Bath can move here if you still want it and train/spa timing works.']
    },
    {
      date: '2026-07-08',
      city: 'london',
      dayId: 'wed',
      label: 'London · Final full day',
      lodging: kimpton,
      anchors: [
        {
          time: 'Daytime',
          sortTime: '10:00',
          type: 'open',
          title: 'TBD final London day',
          status: 'tbd'
        }
      ],
      options: ['Bath day trip candidate', 'Mousetrap / Covent Garden finale', 'Borough to St Paul’s walk', 'Sir John Soane’s Museum'],
      suggest: {
        lunch: ["Noble Rot Lamb's Conduit", "Honey & Co", "Fortitude Bakehouse"],
        dinner: ["Clos Maggiore", "Andrew Edmunds", "Noble Rot Lamb's Conduit"]
      },
      prep: ['Protect this from becoming overstuffed.']
    },
    {
      date: '2026-07-09',
      city: 'london',
      dayId: 'thu',
      label: 'London · Departure',
      lodging: kimpton,
      anchors: [
        {
          time: 'Morning',
          sortTime: '09:00',
          type: 'departure',
          title: 'Coffee, last look, airport buffer',
          status: 'planned',
          critical: true,
          address: 'Heathrow Airport, Longford, Hounslow TW6 1QG, United Kingdom',
          siteUrl: 'https://tfl.gov.uk/plan-a-journey/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Heathrow%20Airport'
        }
      ],
      prep: ['Do not get cute with the airport morning.']
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis.window);
