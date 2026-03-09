# Reddit API Setup — Quick Guide

Follow these steps to generate your `Client ID` and `Client Secret` for use with n8n and the Pain Point Finder.

## 1. Access the Developer Portal
- Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) (ensure you are logged in).
- Scroll to the bottom and click the button: **"are you a developer? create an app..."**

## 2. Create the App
Fill in the following details:
- **Name**: `PainPointFinder` (or any name you prefer)
- **App Type**: Select **script**.
- **Description**: (Optional) e.g., "AI agent to find business pain points on Reddit."
- **About URL**: (Optional)
- **Redirect URI**: `http://localhost:5678/rest/oauth2-callback`
    - *Note: If your n8n is hosted elsewhere, use the webhook/oauth callback URL provided in the n8n Reddit node setup.*

## 3. Get Your Credentials
- Click **"create app"**.
- Your **Client ID** is the string of characters directly under the bold text **"personal use script"**.
- Your **Client Secret** is the string labeled **"secret"**.

## 4. Configure n8n / Environment
- In your n8n workflow, create a new **Reddit OAuth2** credential.
- Paste your **Client ID** and **Client Secret**.
- Alternatively, add them to your project's `.env` file:
  ```env
  REDDIT_CLIENT_ID=your_id_here
  REDDIT_CLIENT_SECRET=your_secret_here
  ```

---
*Created by Antigravity AI*
