# RoofMeasureGuys - Proxy Server Setup

This project includes a proxy server to handle Slack webhook notifications, solving CORS issues when sending notifications directly from the browser.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Proxy Server

```bash
# For development (with auto-restart on changes)
npm run dev

# For production
npm start
```

The server will start on `http://localhost:3000`

### 3. Test the Server

Visit `http://localhost:3000/health` to verify the server is running.

## 📡 API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Order Notifications
- **POST** `/api/slack/order`
- Body: `{ businessName, email, address }`
- Sends new order notifications to Slack

### Payment Notifications
- **POST** `/api/slack/payment` 
- Body: `{ businessName, email, address, paymentId, orderId }`
- Sends payment completion notifications to Slack

### Custom Notifications
- **POST** `/api/slack/notify`
- Body: `{ message }`
- Sends custom text messages to Slack

## 🔧 Configuration

### Environment Variables
You can optionally set these environment variables:

```bash
PORT=3000                    # Server port (default: 3000)
```

### Slack Webhook URL
The Slack webhook URL is currently hardcoded in `server.js`. To change it, edit the `SLACK_WEBHOOK_URL` variable:

```javascript
const SLACK_WEBHOOK_URL = 'your-slack-webhook-url-here';
```

## 🌐 Frontend Integration

The frontend (`index.html`) is configured to send requests to:
- `http://localhost:3000/api/slack/order` (for new orders)
- `http://localhost:3000/api/slack/payment` (for payment confirmations)

## 🔒 Security

- CORS is enabled for all origins (suitable for development)
- For production, configure CORS to only allow your domain
- Consider adding API key authentication for production use

## 📁 File Structure

```
RoofMeasureGuys/
├── index.html          # Frontend application
├── server.js           # Proxy server
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## 🚀 Deployment Options

### Local Development
Run `npm run dev` for local testing

### Production Deployment
Deploy `server.js` to any Node.js hosting platform:
- **Heroku**: `git push heroku main`
- **Netlify Functions**: Convert to serverless function
- **Vercel**: Deploy as API routes
- **Railway**: Deploy Node.js app
- **DigitalOcean App Platform**: Deploy from Git

### Update Frontend URL
When deploying, update the proxy URLs in `index.html`:

```javascript
// Change from:
const proxyUrl = 'http://localhost:3000/api/slack/order';

// To your deployed URL:
const proxyUrl = 'https://your-deployed-server.com/api/slack/order';
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure the proxy server is running
- Check that URLs in frontend match server endpoints

### Connection Refused
- Verify server is running on correct port
- Check firewall settings

### Slack Not Receiving Messages
- Verify Slack webhook URL is correct
- Check server logs for error messages
- Test webhook URL directly with curl

## 📝 Example Usage

### Test Order Notification
```bash
curl -X POST http://localhost:3000/api/slack/order \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Company",
    "email": "test@example.com",
    "address": "123 Test St, Test City, TC 12345"
  }'
```

### Test Payment Notification
```bash
curl -X POST http://localhost:3000/api/slack/payment \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Company",
    "email": "test@example.com", 
    "address": "123 Test St, Test City, TC 12345",
    "paymentId": "PAY-123456789",
    "orderId": "ORDER-123456789"
  }'
```

## ✅ Benefits of Proxy Server

- ✅ **Solves CORS Issues**: No more browser CORS errors
- ✅ **Server-Side Security**: Webhook URL hidden from frontend
- ✅ **Better Error Handling**: Centralized error logging
- ✅ **Scalable**: Easy to add more webhook integrations
- ✅ **Testable**: API endpoints can be tested independently
