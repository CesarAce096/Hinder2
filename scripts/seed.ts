import { db } from '@/lib/db'
import { users, profiles, interests, profileInterests, profilePhotos, swipes, matches, conversations, messages } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { DEFAULT_INTERESTS } from '@/lib/utils/constants'

async function seed() {
  console.log('Seeding database...')

  // Create interests
  const interestInserts = DEFAULT_INTERESTS.map(label => ({ label }))
  await db.insert(interests).values(interestInserts)
  console.log('Interests created')

  // Create demo users and profiles
  const demoUsers = [
    {
      email: 'alice@example.com',
      profile: {
        firstName: 'Alice',
        birthdate: '1995-05-15',
        bio: 'Love hiking and coffee',
        gender: 'female' as const,
        interestedIn: 'male' as const,
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        isComplete: true,
      },
      interests: ['Travel', 'Hiking', 'Coffee'],
      photos: ['alice1.jpg', 'alice2.jpg'],
    },
    {
      email: 'bob@example.com',
      profile: {
        firstName: 'Bob',
        birthdate: '1990-08-20',
        bio: 'Software engineer who loves gaming',
        gender: 'male' as const,
        interestedIn: 'female' as const,
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        isComplete: true,
      },
      interests: ['Gaming', 'Programming', 'Movies'],
      photos: ['bob1.jpg', 'bob2.jpg'],
    },
    {
      email: 'charlie@example.com',
      profile: {
        firstName: 'Charlie',
        birthdate: '1992-12-10',
        bio: 'Artist and musician',
        gender: 'male' as const,
        interestedIn: 'everyone' as const,
        city: 'Oakland',
        latitude: 37.8044,
        longitude: -122.2711,
        isComplete: true,
      },
      interests: ['Art', 'Music', 'Painting'],
      photos: ['charlie1.jpg'],
    },
    {
      email: 'diana@example.com',
      profile: {
        firstName: 'Diana',
        birthdate: '1998-03-25',
        bio: 'Yoga instructor and nature lover',
        gender: 'female' as const,
        interestedIn: 'everyone' as const,
        city: 'Berkeley',
        latitude: 37.8715,
        longitude: -122.2730,
        isComplete: true,
      },
      interests: ['Yoga', 'Nature', 'Meditation'],
      photos: ['diana1.jpg', 'diana2.jpg', 'diana3.jpg'],
    },
  ]

  for (const userData of demoUsers) {
    // Create user
    const userInsert = await db.insert(users).values({
      email: userData.email,
    }).returning()

    const user = userInsert[0]

    // Create profile
    const profileInsert = await db.insert(profiles).values({
      userId: user.id,
      ...userData.profile,
    }).returning()

    const profile = profileInsert[0]

    // Add interests
    const interestRecords = await db
      .select()
      .from(interests)
      .where(sql`${interests.label} IN ${userData.interests}`)

    const profileInterestInserts = interestRecords.map(interest => ({
      profileId: profile.id,
      interestId: interest.id,
    }))

    await db.insert(profileInterests).values(profileInterestInserts)

    // Add photos
    const photoInserts = userData.photos.map((path, index) => ({
      userId: user.id,
      storagePath: path,
      displayOrder: index,
      isPrimary: index === 0,
    }))

    await db.insert(profilePhotos).values(photoInserts)
  }

  console.log('Demo users created')

  // Create some swipes and matches
  const allUsers = await db.select().from(users)

  // Alice likes Bob
  await db.insert(swipes).values({
    swiperUserId: allUsers[0].id,
    targetUserId: allUsers[1].id,
    direction: 'like',
  })

  // Bob likes Alice
  await db.insert(swipes).values({
    swiperUserId: allUsers[1].id,
    targetUserId: allUsers[0].id,
    direction: 'like',
  })

  // Create match
  const matchInsert = await db.insert(matches).values({
    userAId: allUsers[0].id,
    userBId: allUsers[1].id,
  }).returning()

  const match = matchInsert[0]

  // Create conversation
  const conversationInsert = await db.insert(conversations).values({
    matchId: match.id,
  }).returning()

  const conversation = conversationInsert[0]

  // Add some messages
  await db.insert(messages).values([
    {
      conversationId: conversation.id,
      senderUserId: allUsers[0].id,
      body: 'Hey Bob! Saw we matched 😊',
    },
    {
      conversationId: conversation.id,
      senderUserId: allUsers[1].id,
      body: 'Hi Alice! Yeah, excited to chat. How are you?',
    },
    {
      conversationId: conversation.id,
      senderUserId: allUsers[0].id,
      body: 'Great! Love your profile. Want to grab coffee sometime?',
    },
  ])

  console.log('Demo interactions created')

  console.log('Seeding complete!')
}

seed().catch(console.error)