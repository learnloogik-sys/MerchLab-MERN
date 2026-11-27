# MerchLab | MERN final project
A teaching-oriented e-commerce application with catalog search, customer authentication,
cart, cash-on-delivery checkout, order history, admin catalog CRUD (archive instead of
hard delete), and sequential fulfillment status. No payment gateway, stock reservations,
shipping or taxes are implemented. Do not use this as a production retail system.

## Local setup
Install Node.js 22.12+ (or a compatible newer LTS), Git and VS Code. Create a MongoDB
Atlas database user and allow your local IP. Copy `server/.env.example` to `server/.env`
and fill all values. Generate a secret using `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
Copy `client/.env.example` to `client/.env`.
In terminal 1: `cd server`, `npm install`, `npm run seed`, `npm run dev`.
In terminal 2: `cd client`, `npm install`, `npm run dev`.
Open http://localhost:5173. Health: http://localhost:5000/api/health.
Register a separate admin test account; in Atlas Data Explorer > merchlab > users,
edit ONLY that user's role to `admin`. Sign out and back in. Never expose a public admin promotion endpoint.

## Deploy
Push the project to your own GitHub repository (never commit .env). Render: Node Web
Service, root `server`, build `npm ci` after committing generated package-lock.json
(or `npm install` without lock), start `npm start`, health path `/api/health`.
Set MONGODB_URI, JWT_SECRET and CLIENT_ORIGIN. Allow appropriate Render outbound
IP ranges in Atlas. Vercel: root `client`, Vite preset, build `npm run build`, output
`dist`, VITE_API_URL=https://YOUR-SERVICE.onrender.com/api. After deployment set
CLIENT_ORIGIN to the exact Vercel production origin (no trailing slash) and redeploy
backend. `client/vercel.json` supports SPA routes. Use HTTPS; verify live flows.

## Learning boundaries
JWT is stored in sessionStorage for classroom simplicity; an XSS flaw could steal it.
Production needs secure HttpOnly cookie/session design with CSRF controls as applicable,
robust authorization, validation, distributed rate limiting, inventory transactions,
payment provider webhooks, monitoring, accessibility and security review. In this demo
prices are integer rupees; production use integer minor units. Cart prices are estimates.
No real payments are collected. Replace placeholder imagery with licensed images.

## Official docs
https://nodejs.org/en/download
https://vite.dev/guide/
https://react.dev/learn
https://reactrouter.com/
https://expressjs.com/
https://mongoosejs.com/docs/guide.html
https://www.mongodb.com/docs/atlas/connect-to-database-deployment/
https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/
https://docs.github.com/en/get-started
https://render.com/docs/deploy-node-express-app
https://vercel.com/docs/frameworks/frontend/vite
