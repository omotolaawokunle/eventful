import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingCreator = await prisma.user.findUnique({ where: { email: 'chidi@eventful.com' } });
  if (existingCreator) {
    console.log('Seed data already exists, skipping...');
    return;
  }

  const password = await bcrypt.hash('password123', 12);

  const creator = await prisma.user.create({
    data: {
      email: 'chidi@eventful.com',
      password,
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      role: 'CREATOR',
      phone: '+2348023456789',
    },
  });

  const eventee = await prisma.user.create({
    data: {
      email: 'amara@eventful.com',
      password,
      firstName: 'Amara',
      lastName: 'Obi',
      role: 'EVENTEE',
      phone: '+2348098765432',
    },
  });

  const events = [
    {
      title: 'Afro Nation Lagos 2025',
      description:
        'The biggest Afrobeats festival in Nigeria returns! Featuring Burna Boy, Wizkid, Davido, Tems, and a lineup of the finest artists from across the continent. Three days of non-stop music, culture, and unforgettable moments at the Eko Convention Centre.',
      date: new Date('2025-12-25T16:00:00Z'),
      endDate: new Date('2025-12-28T04:00:00Z'),
      venue: 'Eko Convention Centre',
      city: 'Lagos',
      category: 'FESTIVAL',
      totalTickets: 15000,
      price: 45000,
      bannerUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      reminderDays: 3,
    },
    {
      title: 'Sip & Paint: Evenings with African Art',
      description:
        'Unleash your inner artist at our monthly Sip & Paint event. Guided by renowned Nigerian painter Eseosa Edebiri, you will create your own masterpiece while enjoying fine wine and small chops. No experience needed — all materials provided.',
      date: new Date('2025-08-15T17:00:00Z'),
      endDate: new Date('2025-08-15T21:00:00Z'),
      venue: 'The Artisan Hub, Ikoyi',
      city: 'Lagos',
      category: 'WORKSHOP',
      totalTickets: 80,
      price: 15000,
      bannerUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
      reminderDays: 2,
    },
    {
      title: 'Lagos International Food Fair',
      description:
        'A culinary journey across Africa and beyond. Sample over 200 dishes from 50+ vendors, watch live cooking demonstrations by top chefs, and vote for your favourite street food. Jollof rice competition, curry showdown, and a dedicated dessert lane!',
      date: new Date('2025-09-20T10:00:00Z'),
      endDate: new Date('2025-09-22T22:00:00Z'),
      venue: 'Landmark Event Centre',
      city: 'Lagos',
      category: 'FESTIVAL',
      totalTickets: 5000,
      price: 8000,
      bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      reminderDays: 1,
    },
    {
      title: 'Accra Afrobeat Night',
      description:
        'An electrifying night of live Afrobeat music at the Labadi Beach Hotel. Featuring Sarkodie, King Promise, and special guest DJ Edu. Dance under the stars with the Atlantic Ocean as your backdrop. VIP tables available.',
      date: new Date('2025-10-05T19:00:00Z'),
      endDate: new Date('2025-10-06T02:00:00Z'),
      venue: 'Labadi Beach Hotel',
      city: 'Accra',
      category: 'CONCERT',
      totalTickets: 2000,
      price: 35000,
      bannerUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
      reminderDays: 2,
    },
    {
      title: 'Nairobi Tech Summit 2025',
      description:
        'East Africa\'s premier technology conference. Connect with 3000+ founders, engineers, VCs, and policymakers. Keynotes from industry leaders, hands-on workshops on AI/ML, blockchain, fintech, and a startup pitch competition with $100K in prizes.',
      date: new Date('2025-11-12T08:00:00Z'),
      endDate: new Date('2025-11-14T18:00:00Z'),
      venue: 'Kenyatta International Conference Centre',
      city: 'Nairobi',
      category: 'CONFERENCE',
      totalTickets: 3000,
      price: 25000,
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      reminderDays: 3,
    },
    {
      title: 'Cape Town Jazz & Wine Festival',
      description:
        'Experience the soul of South Africa at the stunning Vergelegen Wine Estate. World-class jazz performances paired with award-winning Cape wines. Featuring Jonathan Butler, Judith Sephuma, and international guests. Picnic baskets included.',
      date: new Date('2025-11-30T14:00:00Z'),
      endDate: new Date('2025-12-01T23:00:00Z'),
      venue: 'Vergelegen Wine Estate',
      city: 'Cape Town',
      category: 'FESTIVAL',
      totalTickets: 1500,
      price: 55000,
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      reminderDays: 2,
    },
    {
      title: 'Naija Stand-Up Comedy Show',
      description:
        'Nigeria\'s funniest comedians take the stage for one night only! Featuring Basketmouth, Bovi, Ali Baba, and the hilarious skit crew from Nemsa Studios. Expect three hours of non-stop laughter, roast sessions, and surprise celebrity appearances.',
      date: new Date('2025-10-20T18:00:00Z'),
      endDate: new Date('2025-10-20T23:00:00Z'),
      venue: 'TBS, Onikan',
      city: 'Lagos',
      category: 'THEATER',
      totalTickets: 3000,
      price: 10000,
      bannerUrl: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80',
      reminderDays: 1,
    },
    {
      title: 'Kigali Afro Fusion Dance Festival',
      description:
        'A vibrant celebration of African dance and music. Learn traditional Rwandan Intore dance, Afrobeat choreography, and contemporary fusion styles. Workshops for all levels, live drumming, and a grand showcase performance to close the festival.',
      date: new Date('2025-09-05T09:00:00Z'),
      endDate: new Date('2025-09-07T20:00:00Z'),
      venue: 'BK Arena',
      city: 'Kigali',
      category: 'WORKSHOP',
      totalTickets: 800,
      price: 12000,
      bannerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
      reminderDays: 3,
    },
    {
      title: 'Lagos Street Soccer Championship',
      description:
        'The ultimate grassroots football tournament returns! 32 teams from across Lagos battle it out for the championship trophy and a 5 million Naira prize. Family-friendly atmosphere with food stalls, live DJ, and a kids\' football clinic.',
      date: new Date('2025-12-12T08:00:00Z'),
      endDate: new Date('2025-12-14T20:00:00Z'),
      venue: 'Teslim Balogun Stadium',
      city: 'Lagos',
      category: 'SPORTS',
      totalTickets: 8000,
      price: 3000,
      bannerUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
      reminderDays: 1,
    },
    {
      title: 'Marrakech International Film Festival',
      description:
        'Seven days of cinema from across Africa and the Arab world. Red carpet screenings, masterclasses with acclaimed directors, and networking with industry insiders. Opening night features the premiere of a major Nollywood production.',
      date: new Date('2025-11-25T10:00:00Z'),
      endDate: new Date('2025-12-01T23:00:00Z'),
      venue: 'Palais des Congrès',
      city: 'Marrakech',
      category: 'CULTURAL',
      totalTickets: 5000,
      price: 20000,
      bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      reminderDays: 3,
    },
    {
      title: 'Afrobeats Yoga & Wellness Retreat',
      description:
        'A weekend of rejuvenation at the serene Eko Beach Resort. Morning yoga sessions to Afrobeat rhythms, meditation workshops, spa treatments, farm-to-table wellness meals, and sunset sound baths. Reconnect with your mind, body, and community.',
      date: new Date('2025-10-10T07:00:00Z'),
      endDate: new Date('2025-10-12T18:00:00Z'),
      venue: 'Eko Beach Resort',
      city: 'Lagos',
      category: 'WORKSHOP',
      totalTickets: 200,
      price: 45000,
      bannerUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      reminderDays: 5,
    },
    {
      title: 'Nollywood Meets Hollywood: Industry Mixer',
      description:
        'An exclusive networking event bridging African and global film industries. Meet producers, directors, and investors from both continents. Panel discussions on co-productions, distribution strategies, and the future of African cinema on the global stage.',
      date: new Date('2025-09-28T16:00:00Z'),
      endDate: new Date('2025-09-28T22:00:00Z'),
      venue: 'Four Points by Sheraton',
      city: 'Lagos',
      category: 'CONFERENCE',
      totalTickets: 500,
      price: 25000,
      bannerUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
      reminderDays: 2,
    },
  ];

  for (const eventData of events) {
    await prisma.event.create({
      data: {
        ...eventData,
        availableTickets: eventData.totalTickets,
        isPublished: true,
        creatorId: creator.id,
      },
    });
  }

  console.log(`Seed complete: 1 creator, 1 eventee, ${events.length} events created.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
