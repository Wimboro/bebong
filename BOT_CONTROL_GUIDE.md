# Bot Control Guide

## How to Start and Stop Your WhatsApp Bot from the Dashboard

### Overview
You can now remotely control your WhatsApp bot from the web dashboard. The system works through three components:

1. **WhatsApp Bot** - Your main bot application
2. **API Server** - Bridge between bot and dashboard (port 3001)
3. **Web Dashboard** - Control interface (port 3000)

### Setup Steps

1. **Start the API Server** (Required first):
   ```bash
   cd api-server
   node server.js
   ```
   Keep this running in a terminal.

2. **Start the Dashboard** (In another terminal):
   ```bash
   cd dashboard
   npm run dev
   ```
   Access at: http://localhost:3000

3. **Start the Bot** (In another terminal):
   ```bash
   # From project root
   node src/index.js
   # OR use the starter script
   node start-bot.js
   ```

### Using the Dashboard Controls

#### Start Bot Button
- **When to use**: When the bot is offline/stopped
- **What it does**: Sends a start command to the API server
- **Note**: You still need to manually start the bot process. The button is for future automation.

#### Stop Bot Button  
- **When to use**: When the bot is running and you want to stop it
- **What it does**: Sends a stop command that the running bot will receive
- **Result**: The bot will gracefully shutdown within 5 seconds

### Bot Status Indicators

- **🟢 Online**: Bot is running and connected
- **🔴 Offline**: Bot is stopped or disconnected

### How It Works

1. **Dashboard → API Server**: When you click Start/Stop, the dashboard sends a command to the API server
2. **API Server → Bot**: The running bot checks the API server every 5 seconds for commands
3. **Bot Response**: The bot executes the command (stop immediately, start notification only)

### Important Notes

- **API Server must be running first** - It's the communication bridge
- **Stop works immediately** - The bot will shutdown when it receives the stop command
- **Start is notification only** - You still need to manually start the bot process
- **Bot works independently** - Even if API server is down, the bot continues working

### Troubleshooting

**Bot won't stop from dashboard:**
- Check if API server is running on port 3001
- Check bot console for "🎮 Bot control listener started" message

**Start button doesn't work:**
- The start button currently only sends a notification
- You need to manually run `node src/index.js` to start the bot

**Dashboard shows offline but bot is running:**
- Check if bot is sending status updates to API server
- Restart the API server if needed

### Future Enhancements

The system is designed to support full automation where the dashboard can actually start/stop bot processes automatically. Currently, it provides remote stop functionality and start notifications. 