# Dashboard Integration Setup

Connect your WhatsApp bot to the web dashboard for real-time monitoring.

## Quick Start

1. **Start API Server**
   ```bash
   cd api-server && npm install && npm start
   ```

2. **Enable Bot Integration**
   Add to `.env`: `ENABLE_DASHBOARD_API=true`

3. **Start Dashboard**
   ```bash
   cd dashboard && npm install && npm run dev
   ```

4. **Start Bot**
   ```bash
   npm start
   ```

Visit `http://localhost:3000` to see your dashboard! 