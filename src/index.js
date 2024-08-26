import PostalMime from 'postal-mime';

export default {
    async email(message, env, ctx) {
        const parser = new PostalMime();
        const aEmail = await parser.parse(message.raw);

        const subject = message.headers.get('subject');
        const ffrom = message.from;
        const to = message.to;
        const date = message.headers.get('date');
        const body = aEmail.text;

        const simpleMessage = {
            text: `From: ${ffrom}, To: ${to}, Subject: ${subject}, Date: ${date}, Body: ${body}`
        };

        // Function to split text into chunks that fit within Slack's block limits
        function splitTextIntoBlocks(text, chunkSize = 3000) {
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }
            return chunks;
        }

        const bodyBlocks = splitTextIntoBlocks(body).map(chunk => ({
            type: "section",
            text: {
                type: "mrkdwn",
                text: chunk
            }
        }));

        const slackMessage = {
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Inbound Email Received*`
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*From:*\n${ffrom}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*To:*\n${to}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Subject:*\n${subject}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Date:*\n${date}`
                        },
                        {
                            type: "mrkdwn",
                            text: `\n\n*Body:*`
                        }
                    ]
                },
                // Insert the body blocks here
                ...bodyBlocks
            ]
        };

        const urlMap = {
            "food": env.FOOD_URL,
            "services": env.SERVICES_URL,
            "spam": env.SPAM_URL,
            "catchall": env.CATCHALL_URL
        };
        
        let url = urlMap["catchall"];  // Default to catchall
        for (const key in urlMap) {
            if (to.includes(key)) {
                url = urlMap[key];
                break;
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the correct content type
            },
            body: JSON.stringify(slackMessage)
        });

        console.log(`Slack response: ${response.status}`);
    }
}