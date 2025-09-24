const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Slack webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Proxy endpoint for Slack notifications
app.post('/api/slack/notify', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required',
                success: false 
            });
        }

        console.log('Received notification request:', message);

        // Send to Slack
        const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message })
        });

        if (!slackResponse.ok) {
            throw new Error(`Slack API error: ${slackResponse.status}`);
        }

        console.log('Successfully sent to Slack');
        
        res.json({ 
            success: true, 
            message: 'Notification sent to Slack successfully' 
        });

    } catch (error) {
        console.error('Error sending to Slack:', error);
        
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

// Endpoint for order notifications
app.post('/api/slack/order', async (req, res) => {
    try {
        const { businessName, email, address } = req.body;
        
        if (!businessName || !email || !address) {
            return res.status(400).json({ 
                error: 'businessName, email, and address are required',
                success: false 
            });
        }

        const message = `NEW ORDER RECEIVED - ${businessName}
Business: ${businessName}
Email: ${email}
Address: ${address}
Service: Standard Roof Report - $12.00
Status: Order Submitted - Awaiting Payment
Time: ${new Date().toLocaleString()}
Action: Customer needs to complete PayPal payment`;

        console.log('Sending order notification to Slack');

        // Send to Slack
        const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message })
        });

        if (!slackResponse.ok) {
            throw new Error(`Slack API error: ${slackResponse.status}`);
        }

        console.log('Order notification sent to Slack successfully');
        
        res.json({ 
            success: true, 
            message: 'Order notification sent to Slack successfully' 
        });

    } catch (error) {
        console.error('Error sending order notification to Slack:', error);
        
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

// Endpoint for payment notifications
app.post('/api/slack/payment', async (req, res) => {
    try {
        const { businessName, email, address, paymentId, orderId } = req.body;
        
        if (!businessName || !email || !address || !paymentId || !orderId) {
            return res.status(400).json({ 
                error: 'businessName, email, address, paymentId, and orderId are required',
                success: false 
            });
        }

        const message = `PAYMENT COMPLETED - ORDER READY FOR PROCESSING
Business: ${businessName}
Email: ${email}
Address: ${address}
Amount Paid: $12.00
Payment ID: ${paymentId}
Order ID: ${orderId}
Status: PAID - Ready for Processing
Payment Time: ${new Date().toLocaleString()}
Action Required: Generate and deliver roof measurement report to customer`;

        console.log('Sending payment notification to Slack');

        // Send to Slack
        const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message })
        });

        if (!slackResponse.ok) {
            throw new Error(`Slack API error: ${slackResponse.status}`);
        }

        console.log('Payment notification sent to Slack successfully');
        
        res.json({ 
            success: true, 
            message: 'Payment notification sent to Slack successfully' 
        });

    } catch (error) {
        console.error('Error sending payment notification to Slack:', error);
        
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`📩 Slack endpoints:`);
    console.log(`   - POST /api/slack/notify`);
    console.log(`   - POST /api/slack/order`);
    console.log(`   - POST /api/slack/payment`);
});

module.exports = app;
