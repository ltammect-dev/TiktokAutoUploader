# YouTube Cookies Setup

To avoid YouTube bot detection errors, you need to provide cookies from a logged-in YouTube session.

## Option 1: Export Cookies from Browser (Recommended)

### Using Chrome Extension:

1. Install "Get cookies.txt LOCALLY" extension:
   - Chrome: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc

2. Go to https://www.youtube.com and make sure you're logged in

3. Click the extension icon and click "Export" for youtube.com

4. Save the file as `youtube_cookies.txt` in the project root directory

### Using Firefox Extension:

1. Install "cookies.txt" extension:
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/

2. Go to https://www.youtube.com and make sure you're logged in

3. Click the extension icon and save cookies

4. Save the file as `youtube_cookies.txt` in the project root directory

## Option 2: Use Browser Cookies Directly (Local Only)

If running locally with Chrome installed, the script will automatically try to use cookies from your Chrome browser. This only works on your local machine, not on Railway.

## For Railway Deployment:

You need to upload the `youtube_cookies.txt` file to Railway:

### Method 1: Add to Repository (Not Recommended for Public Repos)

```bash
# Add cookies file
cp ~/Downloads/youtube_cookies.txt .
git add youtube_cookies.txt
git commit -m "Add YouTube cookies"
git push
```

**⚠️ Warning:** Don't do this if your repo is public! Cookies are sensitive.

### Method 2: Use Railway Environment Variable

1. Convert cookies file to base64:
   ```bash
   base64 youtube_cookies.txt > cookies_base64.txt
   ```

2. Add to Railway environment variables:
   - Variable name: `YOUTUBE_COOKIES_BASE64`
   - Value: [paste base64 content]

3. The app will decode and create the file automatically (need to add this feature)

### Method 3: Use Railway Volume (Recommended)

Railway doesn't support volumes yet, so use Method 1 with a private repo.

## Verify Setup

After adding cookies, restart the monitor and check logs for:
```
🍪 Using cookies from youtube_cookies.txt
```

If you see this, cookies are being used successfully!
