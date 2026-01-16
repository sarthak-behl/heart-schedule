# GitHub Actions Cron Job Setup Guide

This guide explains how to set up the GitHub Actions workflow to automatically send scheduled emails every 5 minutes.

## How It Works

Instead of using Vercel's built-in cron jobs, we use GitHub Actions to periodically call our cron endpoint. This approach:

- ✅ **Free**: GitHub Actions provides 2,000 free minutes/month for public repos, unlimited for public repos
- ✅ **Reliable**: GitHub's infrastructure is highly reliable
- ✅ **Flexible**: Easy to adjust schedule or add additional checks
- ✅ **Works with any host**: Not tied to Vercel's platform

## Setup Steps

### 1. Deploy Your Application

First, deploy your HeartSchedule app to your hosting provider (Vercel, Railway, Render, etc.):

```bash
# Example: Deploy to Vercel
vercel --prod
```

After deployment, note your production URL (e.g., `https://heartschedule.vercel.app`)

### 2. Add GitHub Secrets

Go to your GitHub repository settings and add the following secrets:

**Settings → Secrets and variables → Actions → New repository secret**

Add these two secrets:

#### Secret 1: `APP_URL`
- **Name**: `APP_URL`
- **Value**: Your production URL (without trailing slash)
- **Example**: `https://heartschedule.vercel.app`

#### Secret 2: `CRON_SECRET`
- **Name**: `CRON_SECRET`
- **Value**: The same value as in your `.env.local`
- **Current value**: `yKDFPLiXD5vR3ipkOqb6qkFQjki+yQQr9oEPJXqYL6g=`

### 3. Enable GitHub Actions

The workflow is already configured in `.github/workflows/send-scheduled-emails.yml`

It will automatically:
- Run every 5 minutes
- Call your deployed app's cron endpoint
- Send the CRON_SECRET for authentication
- Log the results

### 4. Verify It's Working

After setup, you can verify the cron job is running:

1. **Check GitHub Actions tab** in your repository
2. Look for "Send Scheduled Emails" workflow runs
3. Click on any run to see detailed logs
4. Successful runs will show "Cron job completed successfully"

### 5. Manual Testing

You can manually trigger the workflow for testing:

1. Go to **Actions** tab in GitHub
2. Click **Send Scheduled Emails** workflow
3. Click **Run workflow** dropdown
4. Click **Run workflow** button

This is useful for:
- Testing before waiting for the scheduled run
- Debugging issues
- Sending messages immediately if needed

## Schedule Configuration

The workflow runs every 5 minutes by default:

```yaml
schedule:
  - cron: '*/5 * * * *'
```

### Change the Schedule

To run at different intervals, update the cron expression in `.github/workflows/send-scheduled-emails.yml`:

| Interval | Cron Expression |
|----------|----------------|
| Every 1 minute | `'*/1 * * * *'` |
| Every 5 minutes | `'*/5 * * * *'` (current) |
| Every 10 minutes | `'*/10 * * * *'` |
| Every 15 minutes | `'*/15 * * * *'` |
| Every 30 minutes | `'*/30 * * * *'` |
| Every hour | `'0 * * * *'` |

**Important**: GitHub Actions scheduled workflows may have a delay of 3-10 minutes due to high load. For mission-critical timing, consider using a paid service.

## Troubleshooting

### Workflow Not Running

1. **Check repository settings**:
   - Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is enabled

2. **Verify secrets are set**:
   - Settings → Secrets and variables → Actions
   - Confirm `APP_URL` and `CRON_SECRET` are present

3. **Check workflow file syntax**:
   - Go to Actions tab
   - Look for any syntax errors in the workflow file

### Cron Job Failing

1. **Check logs in GitHub Actions**:
   - Actions tab → Click on failed run
   - Expand "Send scheduled emails" step
   - Look for error messages

2. **Common issues**:
   - **401 Unauthorized**: `CRON_SECRET` doesn't match
   - **404 Not Found**: `APP_URL` is incorrect
   - **500 Server Error**: Check your app's logs for errors

### Test Locally

Test your cron endpoint locally before deploying:

```bash
curl -X GET http://localhost:3000/api/cron/send-scheduled \
  -H "Authorization: Bearer yKDFPLiXD5vR3ipkOqb6qkFQjki+yQQr9oEPJXqYL6g="
```

## Production Checklist

Before going live, ensure:

- [ ] App deployed to production
- [ ] `APP_URL` secret set in GitHub
- [ ] `CRON_SECRET` secret set in GitHub (matches your env)
- [ ] `RESEND_API_KEY` configured in production environment
- [ ] GitHub Actions enabled for the repository
- [ ] Workflow manually tested and successful
- [ ] Test message scheduled and sent successfully

## Monitoring

Monitor your cron job execution:

1. **GitHub Actions Logs**:
   - Shows every execution attempt
   - Displays success/failure status
   - Includes detailed response from cron endpoint

2. **Application Logs**:
   - Check your hosting provider's logs
   - Look for "Cron job completed" messages
   - Monitor for any errors during email sending

3. **Database Checks**:
   - Messages should transition from "pending" to "sent"
   - Check `sentAt` timestamp is populated
   - Failed messages marked with "failed" status

## Cost

GitHub Actions is free for:
- **Public repositories**: Unlimited minutes
- **Private repositories**: 2,000 minutes/month

At 5-minute intervals:
- ~8,640 executions per month
- Each execution takes ~5-10 seconds
- Total usage: ~720-1,440 minutes/month

This fits comfortably within GitHub's free tier for private repos!

## Alternative Hosting Options

If you prefer not to use GitHub Actions, other options include:

1. **Vercel Cron** (if using Vercel):
   - Add `vercel.json` with cron configuration
   - Limited to specific plans

2. **Render Cron Jobs** (if using Render):
   - Configure cron jobs in Render dashboard
   - Free tier includes cron jobs

3. **Railway Cron** (if using Railway):
   - Use Railway's cron job feature
   - Configure in railway.json

4. **External Cron Services**:
   - [cron-job.org](https://cron-job.org) - Free tier available
   - [EasyCron](https://www.easycron.com) - Free for up to 100 jobs
   - Configure to hit your cron endpoint with auth header

---

## Quick Start Summary

```bash
# 1. Deploy your app
vercel --prod

# 2. Note your production URL
# Example: https://heartschedule.vercel.app

# 3. Add GitHub secrets:
# - APP_URL: https://heartschedule.vercel.app
# - CRON_SECRET: yKDFPLiXD5vR3ipkOqb6qkFQjki+yQQr9oEPJXqYL6g=

# 4. Push to GitHub
git add .
git commit -m "Add GitHub Actions cron job"
git push

# 5. Verify in Actions tab
# Look for "Send Scheduled Emails" workflow running every 5 minutes
```

Done! Your scheduled emails will now be sent automatically. 🎉
