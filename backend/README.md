# KS Steel backend

TypeScript-only Node.js API backed by MongoDB.

## Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create a local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Make sure MongoDB is running locally, or replace `MONGODB_URI` in `.env`
   with a MongoDB Atlas connection string.

4. Start the development server:

   ```powershell
   npm run dev
   ```

The API listens on `http://localhost:4000` by default. Check
`http://localhost:4000/api/health` to verify both the API and MongoDB connection.

## Production build

```powershell
npm run build
npm start
```

The MongoDB client is created once and reused for the lifetime of the process.
Connection pool and timeout values intentionally use the official driver's
defaults until the deployment workload and MongoDB topology are known.
