# HeartSchedule - Quick Setup Guide

## ✅ Step 1: Get Supabase Database Connection String

You have project: `ssxlezyhrfrevuwlnmjt`

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/ssxlezyhrfrevuwlnmjt/settings/database)
2. Click **"Database"** in left sidebar
3. Scroll to **"Connection String"** section
4. Select **"Transaction"** mode (NOT Session mode)
5. Click **"Copy"** - it will look like:
   ```
   postgresql://postgres.ssxlezyhrfrevuwlnmjt:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

## ✅ Step 2: Update .env.local

Open `.env.local` and replace the DATABASE_URL line with your copied connection string:

```bash
DATABASE_URL="postgresql://postgres.ssxlezyhrfrevuwlnmjt:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Note:** Make sure to keep `?pgbouncer=true&connection_limit=1` at the end!

The NextAuth secret has already been generated for you:
```bash
NEXTAUTH_SECRET="R1U4cx6ev3iPQH2Ly7pZb99RiZsDtEXbd8DfSVE0h08="
```

## ✅ Step 3: Push Database Schema

Once you've updated the DATABASE_URL, run:

```bash
npx prisma db push
```

This creates the `users` and `messages` tables in your Supabase database.

## ✅ Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

## ✅ Step 5: Test Authentication

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click **"Get Started"**
3. Create an account with:
   - Name: Your name (optional)
   - Email: Your email
   - Password: At least 8 characters
4. You'll be automatically logged in!

## 🎉 What Happens Next

Once authentication is working, I'll build:

### Phase 1: Dashboard (Next)
- View all your scheduled messages
- See stats (messages scheduled, sent)
- "Create New Message" button

### Phase 2: Message Creation Wizard
- **Step 1:** Choose occasion (Birthday, Anniversary, etc.)
- **Step 2:** Enter recipient details
- **Step 3:** Write or AI-generate message
- **Step 4:** Schedule date/time
- **Step 5:** Review and confirm

### Phase 3: Integration
- OpenAI for AI message generation
- Resend for email sending
- Cron jobs for automatic scheduling

## 🔍 Troubleshooting

### Connection Error?
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check Supabase dashboard shows database is active
- Verify you copied the **Transaction** mode connection string

### Can't find password?
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ssxlezyhrfrevuwlnmjt/settings/database)
2. Click **"Reset database password"**
3. Copy new password and update `.env.local`

### "MODULE_NOT_FOUND" error?
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Optional: Get API Keys (for later)

### OpenAI (for AI message generation)
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Add to `.env.local`: `OPENAI_API_KEY="sk-..."`

### Resend (for email sending)
1. Go to [resend.com](https://resend.com)
2. Sign up free
3. Get API key from dashboard
4. Add to `.env.local`: `RESEND_API_KEY="re_..."`

---

Need help? Let me know what step you're on!
