(function initTripSchedule(root) {
  const lisbonBase = {
    name: 'Rua da Madalena 214',
    area: 'Baixa / Alfama edge',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20da%20Madalena%20214%20Lisbon%201100-204%20Portugal'
  };

  const marlin = {
    name: 'Marlin Hotel Dublin',
    area: 'St Stephen’s Green / South Great George’s Street',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Marlin%20Hotel%20Dublin%2011%20Bow%20Lane%20East'
  };

  const kimpton = {
    name: 'Kimpton Fitzroy London',
    area: 'Bloomsbury / Russell Square',
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
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        },
        {
          time: '4:50pm',
          sortTime: '16:50',
          type: 'meeting',
          title: 'Meet under Rua Augusta Arch',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20Augusta%20Arch%20R.%20Augusta%202%20Lisboa%201100-053'
        },
        {
          time: '5:00-9:00pm',
          sortTime: '17:00',
          type: 'booking',
          title: 'Oh! My Cod: 17 Tastings Lisbon Food Tour',
          status: 'confirmed',
          critical: true,
          siteUrl: 'https://www.ohmycodtours.com/food-tours/lisbon-food-tour/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rua%20Augusta%20Arch%20R.%20Augusta%202%20Lisboa%201100-053'
        }
      ],
      prep: ['Keep lunch small before 17 tastings.', 'Wear comfortable shoes for the four-hour walking tour.']
    },
    {
      date: '2026-06-27',
      city: 'lisbon',
      dayId: 'sat',
      label: 'Lisbon · Belem + Taberna',
      lodging: lisbonBase,
      anchors: [
        {
          time: '9:45am',
          sortTime: '09:45',
          type: 'transfer',
          title: 'Leave Baixa for Belem by Uber/Bolt',
          status: 'tentative',
          mapUrl: 'https://www.google.com/maps/dir/?api=1&origin=Rua%20da%20Madalena%20214%20Lisbon&destination=Jer%C3%B3nimos%20Monastery%20Lisbon&travelmode=driving'
        },
        {
          time: '10:15-11:45am',
          sortTime: '10:15',
          type: 'sightseeing',
          title: 'Jeronimos Monastery as the one real sight',
          status: 'tentative',
          siteUrl: 'https://www.mosteirojeronimos.gov.pt/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jer%C3%B3nimos%20Monastery%20Lisbon'
        },
        {
          time: '11:45am-12:15pm',
          sortTime: '11:45',
          type: 'snack',
          title: 'Pastéis de Belem: one pastel each, coffee, maybe one extra to split',
          status: 'tentative',
          siteUrl: 'https://pasteisdebelem.pt/en/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Past%C3%A9is%20de%20Bel%C3%A9m%20Lisbon'
        },
        {
          time: '12:30/12:45pm',
          sortTime: '12:30',
          type: 'food',
          title: 'Preferred lunch: Canalha, if booked',
          status: 'tentative',
          siteUrl: 'https://www.canalha.pt/homepage/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Canalha%20Lisbon%20Portugal'
        },
        {
          time: '2:15-3:15pm',
          sortTime: '14:15',
          type: 'sightseeing',
          title: 'River walk + Monument to the Discoveries exterior',
          status: 'tentative',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Padr%C3%A3o%20dos%20Descobrimentos%20Lisbon'
        },
        {
          time: '3:15-4:00pm',
          sortTime: '15:15',
          type: 'sightseeing',
          title: 'Belem Tower exterior/photo stop',
          status: 'tentative',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bel%C3%A9m%20Tower%20Lisbon'
        },
        {
          time: 'Optional 4:00-4:45pm',
          sortTime: '16:00',
          type: 'optional',
          title: 'MAAT rooftop / quick AC stop only if energy is good',
          status: 'tentative',
          siteUrl: 'https://www.maat.pt/en',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=MAAT%20Lisbon'
        },
        {
          time: '4:45-5:15pm',
          sortTime: '16:45',
          type: 'transfer',
          title: 'Head back to Baixa for shower/rest/reset',
          status: 'tentative',
          mapUrl: lisbonBase.mapUrl
        },
        {
          time: '7:15-7:30pm',
          sortTime: '19:15',
          type: 'reservation',
          title: 'Put name down at Taberna da Rua das Flores',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20da%20Rua%20das%20Flores%20Lisbon'
        },
        {
          time: 'While waiting',
          sortTime: '19:30',
          type: 'bar',
          title: 'Drink nearby while waiting; do not arrive starving',
          status: 'planned'
        },
        {
          time: 'Dinner',
          sortTime: '20:00',
          type: 'reservation',
          title: 'Taberna da Rua das Flores dinner',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Taberna%20da%20Rua%20das%20Flores%20Lisbon'
        }
      ],
      prep: ['Book Canalha for 12:30 or 12:45 if choosing it over O Vinhaca.', 'Consider buying Jeronimos cloister tickets ahead.', 'Order lunch like Taberna still matters later: shared starters, 2-3 mains for four, wine but not a long boozy lunch.', 'Treat Taberna as a walk-up logistics plan: arrive early, put the name down, then wait nearby.']
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
          title: 'Pena Palace timed entry',
          status: 'confirmed',
          critical: true,
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
          title: 'Quinta da Regaleira timed entry',
          status: 'confirmed',
          critical: true,
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
      label: 'Lisbon · Sunset cruise + pack',
      lodging: lisbonBase,
      anchors: [
        {
          time: 'Daytime',
          sortTime: '11:00',
          type: 'open',
          title: 'TBD final Lisbon day',
          status: 'tbd'
        },
        {
          time: 'Before dinner',
          sortTime: '17:30',
          type: 'prep',
          title: 'Pack before heading to the cruise',
          status: 'confirmed',
          critical: true,
          note: 'Cruise ends 9:00-9:30pm — packing has to be done before you leave.'
        },
        {
          time: '6:10pm',
          sortTime: '18:10',
          type: 'transfer',
          title: 'Request Bolt/Uber',
          status: 'planned',
          critical: true,
          note: 'Doca de Alcântara is ~15-20 min by car from Rua da Madalena.'
        },
        {
          time: '6:15pm',
          sortTime: '18:15',
          type: 'transfer',
          title: 'Leave Rua da Madalena (latest preferred)',
          status: 'planned',
          critical: true,
          leaveBy: '6:15pm',
          mapUrl: lisbonBase.mapUrl
        },
        {
          time: '6:40-6:45pm',
          sortTime: '18:40',
          type: 'arrival',
          title: 'Arrive Doca de Alcântara meeting point (Gate 2)',
          status: 'planned',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Doca%20de%20Alc%C3%A2ntara%20Gate%202%20R.%20da%20Cintura%20do%20Porto%20de%20Lisboa%201350-355%20Lisboa',
          note: 'R. da Cintura do Porto de Lisboa 1350, Gate 2. Arrive 15 min before departure or lose the slot.'
        },
        {
          time: '7:00pm',
          sortTime: '19:00',
          type: 'booking',
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
          title: 'Confirm 3:30-3:45am airport move',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        }
      ],
      prep: ['Pack before the cruise — you land back at 9:00-9:30pm with a 3:30am airport move.', 'Eat a small late lunch or snack pre-cruise; plan a light bite after if hungry.', 'One drink max if the 6:00am flight is still the plan.'],
      prepPreviousNight: ['Protect the final Lisbon day from late-night plans.', 'Re-check cruise meeting point: Doca de Alcântara, Gate 2.']
    },
    {
      date: '2026-06-30',
      city: 'kilkea',
      dayId: null,
      label: 'Lisbon to Kilkea',
      lodging: {
        name: 'Kilkea Castle',
        area: 'County Kildare',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kilkea%20Castle%20Kildare%20Ireland'
      },
      anchors: [
        {
          time: '3:30-3:45am',
          sortTime: '03:30',
          type: 'transfer',
          title: 'Leave for Lisbon Airport',
          status: 'confirmed',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lisbon%20Airport'
        },
        {
          time: '6:00am',
          sortTime: '06:00',
          type: 'flight',
          title: 'LIS to Dublin flight',
          status: 'confirmed',
          critical: true,
          leaveBy: '3:30am',
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
      prepPreviousNight: ['Pack before dinner.', 'Confirm the airport ride.', 'Put passports and flight documents somewhere obvious.']
    },
    {
      date: '2026-07-01',
      city: 'kilkea',
      dayId: null,
      label: 'Kilkea · Wedding day',
      lodging: {
        name: 'Kilkea Castle',
        area: 'County Kildare',
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
          title: 'Dublin Heuston to Galway train',
          status: 'confirmed',
          critical: true,
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
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galway%20Train%20Station'
        }
      ],
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
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=HYDE%20Hotel%2010%20Forster%20St%20Galway%20H91%20TCP0%20Ireland'
        },
        {
          time: '8:00am-~1:30pm',
          sortTime: '08:00',
          type: 'tour',
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
          title: 'Galway to Dublin train',
          status: 'confirmed',
          critical: true,
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
          mapUrl: marlin.mapUrl
        }
      ],
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
          title: 'Guinness Storehouse tour',
          status: 'confirmed',
          critical: true,
          siteUrl: 'https://www.guinness-storehouse.com/en/booking',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Guinness%20Storehouse%20Dublin'
        }
      ],
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
          title: 'Fly Dublin to London',
          status: 'planned',
          critical: true,
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dublin%20Airport'
        },
        {
          time: 'Arrival',
          sortTime: '15:00',
          type: 'lodging',
          title: 'Check in at Kimpton Fitzroy London',
          status: 'planned',
          mapUrl: kimpton.mapUrl
        }
      ],
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
          title: 'Wimbledon day',
          status: 'confirmed',
          critical: true,
          siteUrl: 'https://www.wimbledon.com/en_GB/tickets/the_queue',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Wimbledon%20All%20England%20Lawn%20Tennis%20Club'
        }
      ],
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
          siteUrl: 'https://tfl.gov.uk/plan-a-journey/',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Heathrow%20Airport'
        }
      ],
      prep: ['Do not get cute with the airport morning.']
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis.window);
