
# Wrangler-CF-Email-Worker

Wrangler-CF-Email-Worker is a Cloudflare Workers project designed to handle and process incoming emails using Cloudflare's Email Routing. It parses the emails, formats them, and forwards the data to configured webhooks, such as Slack channels or other HTTP endpoints.

## Features

- **Email Parsing**: Utilizes the `PostalMime` library to accurately parse incoming emails, extracting essential components like sender, recipient, subject, and body content.
- **Webhook Integration**: Easily forward parsed email data to a specified webhook, such as a Slack channel or custom endpoint.
- **Customizable Routing**: Route emails to different webhooks based on the recipient's address.
- **Cloudflare Workers Integration**: Fully compatible with Cloudflare Workers, allowing for easy deployment and scalability.

## Prerequisites

Before setting up this project, ensure you have the following:

- [Node.js](https://nodejs.org/) installed on your machine (v16).
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started) installed for deploying to Cloudflare Workers.
- A [Cloudflare account](https://www.cloudflare.com/) with Workers and Email Routing configured.

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/natefoxr/Wrangler-CF-Email-Worker.git
cd Wrangler-CF-Email-Worker
```

### 2. Install Dependencies

Install the required Node.js dependencies:

```bash
npm install
```

### 3. Configure Cloudflare Worker

You need to configure the Cloudflare Worker using the `wrangler.toml` file.

#### Example `wrangler.toml`

The `wrangler.toml.example` file provides an example configuration. Copy it to `wrangler.toml` and update it with your settings:

```bash
cp wrangler.toml.example wrangler.toml
```

In `wrangler.toml`, you'll find settings like:

- **Environment Variables**: Set environment variables for URLs to which the worker will send processed email data.

#### Environment Variables

The environment variables section allows you to specify different URLs for different email categories (like `FOOD_URL`, `SERVICES_URL`, etc.). Update these values based on your requirements.

### 4. Implement Email Processing

The core email processing logic is implemented in `index.js`. This file uses `PostalMime` to parse incoming emails and then sends the parsed data to the appropriate webhook.

**Key sections of `index.js`:**

- **Parsing Email**: Extracts subject, sender, recipient, date, and body.
- **Formatting for Slack**: The email body is split into blocks that fit within Slack's message block limits.
- **Routing**: Emails are routed to different URLs based on the recipient's address (e.g., `food@example.com` goes to the `FOOD_URL`).

You can customize this logic based on your specific needs.

### 5. Deploy to Cloudflare

To deploy the worker to Cloudflare, use the Wrangler CLI:

```bash
wrangler deploy
```

This command deploys the worker to your configured Cloudflare account and makes it available for email processing.

## Usage

Once deployed, the worker will process incoming emails according to the routing rules you've set. The worker listens for incoming emails, parses them, and sends the formatted data to the specified webhook URL.

## Debug

Run a live logging session to catch traffic by using the following command in Wrangler CLI:

```bash
wrangler tail
```

### Customizing the Worker

You can customize the behavior of the worker by editing `index.js`:

- **Change the Webhook URL**: Modify the `urlMap` object to set different URLs for different email categories.
- **Format Messages Differently**: Adjust the `slackMessage` object to format the message as needed for your webhook.
- **Additional Processing**: Implement any additional processing logic required before forwarding the email data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
