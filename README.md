# ⊙ Phish Finder

AI-powered Phish show recommendation engine. Search by vibe, energy, era, and more.
Powered by the Phish.net API and Claude AI.

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Create a GitHub account (skip if you have one)
1. Go to [github.com](https://github.com) and click **Sign Up**
2. Follow the prompts to create a free account

### Step 2: Create a new GitHub repository
1. Once logged in, click the **+** button in the top-right corner → **New repository**
2. Name it `phish-finder`
3. Make sure **Public** is selected
4. Check the box for **"Add a README file"** (we'll replace it)
5. Click **Create repository**

### Step 3: Upload all the project files
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop ALL the files and folders from this project
   - Make sure you include the `src/` folder with all its subfolders
   - Include `package.json`, `next.config.js`, `vercel.json`, `.gitignore`
3. Click **"Commit changes"**

**Important:** The folder structure should look like this in your repo:
```
phish-finder/
├── package.json
├── next.config.js
├── vercel.json
├── .gitignore
├── .env.example
└── src/
    ├── lib/
    │   └── phishnet.js
    └── app/
        ├── layout.js
        ├── page.js
        ├── globals.css
        └── api/
            ├── shows/
            │   └── route.js
            ├── setlists/
            │   └── route.js
            ├── jamcharts/
            │   └── route.js
            └── songs/
                └── route.js
```

### Step 4: Sign up for Vercel
1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Choose **"Continue with GitHub"** — this connects your accounts
3. Select the **Hobby** (free) plan

### Step 5: Deploy your app
1. In Vercel, click **"Add New..."** → **"Project"**
2. You should see your `phish-finder` repo listed — click **"Import"**
3. Vercel will auto-detect it's a Next.js project
4. **Before clicking Deploy**, expand **"Environment Variables"**
5. Add this variable:
   - **Name:** `PHISHNET_API_KEY`
   - **Value:** Your Phish.net API key (the one starting with `84D2...`)
6. Click **"Deploy"**

### Step 6: You're live! 🎉
Vercel will build and deploy your app in about 1-2 minutes.
You'll get a URL like `phish-finder-yourusername.vercel.app`.

That's it — your Phish Finder is live on the internet!

## How It Works

- **Frontend:** React (Next.js) — the UI you see
- **Backend API routes:** Run on Vercel's servers — these call the Phish.net API using your secret key (no CORS issues!)
- **Curated data:** 20+ legendary shows are pre-loaded with vibe tags, energy ratings, and descriptions
- **Live data:** Click "Load Live Shows" to pull real-time data from Phish.net for any year
- **AI Search:** Uses Claude to interpret natural language queries against your loaded show database

## Features

- 🔥 Filter by vibe: raging, funky, dark, blissful, exploratory, ambient, melodic, celebratory, transcendent
- 📅 Filter by era (1.0–4.0), year range, minimum rating
- 🎵 Search by song name
- ⭐ Sort by rating, jam charts, reviews, date, energy
- 📋 Load real setlists and jam chart data from Phish.net
- ✨ AI-powered natural language search via Claude
- 🔗 Direct links to phish.net for every show

## Get Your Phish.net API Key

1. Go to [phish.net/api/keys](https://phish.net/api/keys)
2. Log in or create a free account
3. Request an API key — it's instant
4. Use the **API key** (not the Public key)
