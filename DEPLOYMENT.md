# Get Your Friday - Deployment Guide

## Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

### Required (Telegram Notifications)
```
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
TELEGRAM_CHAT_ID=<your_telegram_chat_id>
```

### Optional (Notion Storage)
```
NOTION_API_KEY=<your_notion_api_key>
NOTION_DATABASE_ID=<your_database_id>
```

> **Note:** Get actual values from `.env.local` (not committed to git)

### App Config
```
NEXT_PUBLIC_APP_URL=https://getyourfriday.com
```

## Setting up Notion Database (Optional)

1. Go to https://notion.so and create a new database
2. Add these properties:
   - **Email** (Title)
   - **Signed Up** (Date)
   - **Source** (Select: website, referral, social)
   - **Status** (Select: waitlist, contacted, converted)
   - **Notes** (Text)

3. Share the database with your integration:
   - Click "..." menu → "Connect to" → Select your integration
   
4. Get the database ID from the URL:
   - URL format: `https://notion.so/<workspace>/<DATABASE_ID>?v=...`
   - Copy the `DATABASE_ID` part

5. Add `NOTION_DATABASE_ID` to Vercel environment variables

## How It Works

### Priority System
1. **Telegram notification** (required) - Jedi gets instant notification
2. **Notion storage** (optional) - Saves to database if configured
3. **Duplicate checking** - Prevents duplicate signups

### Success Criteria
- ✅ Signup succeeds if Telegram notification is sent
- ✅ Notion storage is a bonus, not required
- ✅ Users get success message immediately

### Error Handling
- Invalid email → User sees error message
- Duplicate email → User sees "already registered" message
- Telegram fails → User sees error, admin gets console log
- Notion fails → Silent fallback, Telegram still works

## Testing Locally

1. Copy `.env.example` to `.env.local`
2. Fill in the credentials
3. Run `npm run dev`
4. Go to `http://localhost:3000/#waitlist`
5. Submit an email
6. Check Telegram for notification

## Deployment

Push to GitHub → Vercel auto-deploys → Set environment variables in Vercel dashboard.

## Monitoring

Check for issues:
- Vercel logs (Functions → waitlist function)
- Telegram messages (should receive notification for each signup)
- Notion database (if configured)
