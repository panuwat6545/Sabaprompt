export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const { text, user } = req.body || {};

    if (!text) {
        return res.status(400).json({ error: 'Feedback text is required' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log(`[Mock Feedback Redirect] User: ${user}, Feedback: ${text}`);
        return res.status(200).json({ success: true, message: 'Feedback logged to server console (Webhook URL not set)' });
    }

    try {
        const payload = {
            embeds: [
                {
                    title: "📩 SABA PROMPT - New Feedback",
                    color: 16348950, // Amber orange color in decimal
                    fields: [
                        { name: "👤 User Account", value: user || "Guest Mode", inline: true },
                        { name: "💬 Message Suggestions", value: text }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord returned status ${response.status}`);
        }

        return res.status(200).json({ success: true, message: 'Feedback sent successfully to Discord Webhook!' });
    } catch (error) {
        console.error('Feedback webhook error:', error);
        return res.status(500).json({ error: 'Failed to deliver feedback to gateway', details: error.message });
    }
}
