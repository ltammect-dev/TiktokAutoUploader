#!/usr/bin/env python3
"""
Sync cookies from GenLogin/GoLogin profiles to TikTok uploader
Run this periodically to keep cookies fresh
"""

import json
import requests
import time
import os
from pathlib import Path

# Configuration
GENLOGIN_API = os.getenv("GENLOGIN_API", "http://localhost:50325")
COOKIES_DIR = Path("CookiesDir")
CHANNELS_CONFIG = "channels_config.json"

def get_genlogin_cookies(profile_id):
    """Get cookies from GenLogin profile via API"""
    try:
        response = requests.get(
            f"{GENLOGIN_API}/browser/cookies/{profile_id}",
            timeout=10
        )
        
        if response.ok:
            return response.json()
        else:
            print(f"  ❌ API error: {response.status_code}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"  ❌ GenLogin not running on {GENLOGIN_API}")
        return None
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def convert_to_tiktok_format(genlogin_cookies):
    """Convert GenLogin cookie format to TikTok uploader format"""
    # GenLogin usually returns cookies in browser format
    # This uploader expects specific format
    converted = []
    
    for cookie in genlogin_cookies:
        converted.append({
            "name": cookie.get("name"),
            "value": cookie.get("value"),
            "domain": cookie.get("domain", ".tiktok.com"),
            "path": cookie.get("path", "/"),
            "secure": cookie.get("secure", True),
            "httpOnly": cookie.get("httpOnly", False),
            "sameSite": cookie.get("sameSite", "None")
        })
    
    return converted

def sync_genlogin_cookies():
    """Sync cookies from all GenLogin profiles"""
    
    if not os.path.exists(CHANNELS_CONFIG):
        print(f"❌ {CHANNELS_CONFIG} not found")
        print("Create it with GenLogin profile mappings")
        return
    
    COOKIES_DIR.mkdir(exist_ok=True)
    
    with open(CHANNELS_CONFIG) as f:
        config = json.load(f)
    
    if "channels" not in config:
        print("❌ No 'channels' found in config")
        return
    
    synced = 0
    failed = 0
    
    for channel in config["channels"]:
        if "genlogin_profile" not in channel:
            continue
            
        profile_id = channel["genlogin_profile"]
        account = channel["tiktok_account"]
        
        print(f"\n🔄 Syncing '{account}' from GenLogin profile '{profile_id}'")
        
        # Get cookies from GenLogin
        cookies = get_genlogin_cookies(profile_id)
        
        if not cookies:
            failed += 1
            continue
        
        # Convert to TikTok format
        converted_cookies = convert_to_tiktok_format(cookies)
        
        # Save to cookies directory
        cookie_file = COOKIES_DIR / f"{account}.cookie"
        with open(cookie_file, "w") as f:
            json.dump(converted_cookies, f, indent=2)
        
        print(f"  ✓ Synced {len(converted_cookies)} cookies to {cookie_file}")
        synced += 1
        
        time.sleep(0.5)
    
    print(f"\n{'='*50}")
    print(f"✅ Synced: {synced} accounts")
    print(f"❌ Failed: {failed} accounts")
    print(f"{'='*50}")

if __name__ == "__main__":
    print("🔄 GenLogin Cookie Sync")
    print("="*50)
    sync_genlogin_cookies()
