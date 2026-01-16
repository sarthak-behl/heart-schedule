// Quick setup verification script
// Run with: npx tsx scripts/check-setup.ts

import { prisma } from '../lib/prisma'

async function checkSetup() {
  console.log('🔍 Checking HeartSchedule setup...\n')

  // Check environment variables
  console.log('📋 Environment Variables:')
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set (optional for now)' : '⚠️  Not set (needed for AI features)',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Set (optional for now)' : '⚠️  Not set (needed for email sending)',
  }

  Object.entries(envVars).forEach(([key, status]) => {
    console.log(`  ${key}: ${status}`)
  })

  // Check database connection
  console.log('\n💾 Database Connection:')
  try {
    await prisma.$connect()
    console.log('  ✅ Connected to database')

    // Check if tables exist
    const userCount = await prisma.user.count()
    const messageCount = await prisma.message.count()

    console.log(`  ✅ Users table exists (${userCount} users)`)
    console.log(`  ✅ Messages table exists (${messageCount} messages)`)

    await prisma.$disconnect()
  } catch (error: any) {
    console.log('  ❌ Database connection failed')
    console.log(`  Error: ${error.message}`)
    console.log('\n💡 Tip: Make sure you:')
    console.log('  1. Updated DATABASE_URL in .env.local')
    console.log('  2. Ran: npx prisma db push')
    process.exit(1)
  }

  console.log('\n✨ Setup looks good! You can now:')
  console.log('  1. Run: npm run dev')
  console.log('  2. Visit: http://localhost:3000')
  console.log('  3. Click "Get Started" to create an account')
}

checkSetup()
