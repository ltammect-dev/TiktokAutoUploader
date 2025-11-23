# GenLogin/GoLogin Integration Guide

Kết hợp TikTok Auto Uploader với GenLogin để quản lý nhiều accounts an toàn.

## Kiến trúc

```
GenLogin Profiles (Browser Fingerprints)
    ↓ Export Cookies
TikTok Auto Uploader (Upload Engine)
    ↓ Schedule & Upload
TikTok Accounts (Isolated & Safe)
```

## Setup Workflow

### 1. Tạo Profiles trong GenLogin

1. Mở GenLogin
2. Tạo profile mới cho mỗi TikTok account
3. Đặt tên: `tiktok_account1`, `tiktok_account2`, etc.
4. Gán proxy riêng cho mỗi profile
5. Login vào TikTok trong mỗi profile

### 2. Export Cookies từ GenLogin

#### Method A: Manual Export (Đơn giản)

1. Mở profile trong GenLogin
2. Vào TikTok và login
3. Dùng extension "EditThisCookie" hoặc "Get cookies.txt"
4. Export cookies → save as `CookiesDir/account1.cookie`
5. Lặp lại cho tất cả accounts

#### Method B: GenLogin API (Tự động)

```python
import requests
import json

GENLOGIN_API = "http://localhost:50325"
PROFILE_ID = "your-profile-id"

# Get profile cookies
response = requests.get(f"{GENLOGIN_API}/browser/cookies/{PROFILE_ID}")
cookies = response.json()

# Save cookies
with open(f"CookiesDir/{PROFILE_ID}.cookie", "w") as f:
    json.dump(cookies, f)
```

#### Method C: Selenium + GenLogin (Advanced)

```python
from selenium import webdriver
import json

# GenLogin profile path
profile_path = "/path/to/genlogin/profile"

options = webdriver.ChromeOptions()
options.add_argument(f"user-data-dir={profile_path}")

driver = webdriver.Chrome(options=options)
driver.get("https://www.tiktok.com")

# Get cookies
cookies = driver.get_cookies()

# Save for TikTok uploader
with open("CookiesDir/account.cookie", "w") as f:
    json.dump(cookies, f)
```

### 3. Cấu trúc Cookies Directory

```
CookiesDir/
├── account1.cookie  (GenLogin Profile 1)
├── account2.cookie  (GenLogin Profile 2)
├── account3.cookie  (GenLogin Profile 3)
└── ...
```

### 4. Upload với nhiều accounts

```bash
# Upload to account 1
python cli.py upload --user account1 -v "video.mp4" -t "Title"

# Upload to account 2
python cli.py upload --user account2 -v "video.mp4" -t "Title"

# Upload to account 3
python cli.py upload --user account3 -v "video.mp4" -t "Title"
```

## Tự động hóa với Channels Config

### 1. Setup channels_config.json

```json
{
  "channels": [
    {
      "youtube_url": "https://www.youtube.com/@channel1",
      "tiktok_account": "account1",
      "genlogin_profile": "profile-id-1"
    },
    {
      "youtube_url": "https://www.youtube.com/@channel2",
      "tiktok_account": "account2",
      "genlogin_profile": "profile-id-2"
    }
  ]
}
```

### 2. Script tự động sync cookies

```python
#!/usr/bin/env python3
"""
Sync cookies from GenLogin profiles to TikTok uploader
"""

import json
import requests
import time
from pathlib import Path

GENLOGIN_API = "http://localhost:50325"
COOKIES_DIR = Path("CookiesDir")

def sync_genlogin_cookies():
    """Sync cookies from all GenLogin profiles"""
    
    with open("channels_config.json") as f:
        config = json.load(f)
    
    for channel in config["channels"]:
        profile_id = channel["genlogin_profile"]
        account = channel["tiktok_account"]
        
        print(f"🔄 Syncing {account} from GenLogin profile {profile_id}")
        
        try:
            # Get cookies from GenLogin API
            response = requests.get(
                f"{GENLOGIN_API}/browser/cookies/{profile_id}"
            )
            
            if response.ok:
                cookies = response.json()
                
                # Save to cookies directory
                cookie_file = COOKIES_DIR / f"{account}.cookie"
                with open(cookie_file, "w") as f:
                    json.dump(cookies, f, indent=2)
                
                print(f"  ✓ Synced {len(cookies)} cookies")
            else:
                print(f"  ❌ Failed to get cookies: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        time.sleep(1)

if __name__ == "__main__":
    sync_genlogin_cookies()
```

### 3. Cron job để sync định kỳ

```bash
# Sync cookies mỗi 6 giờ
0 */6 * * * cd /path/to/project && python sync_genlogin_cookies.py
```

## Best Practices

### ✅ DO:
- Dùng proxy riêng cho mỗi GenLogin profile
- Sync cookies thường xuyên (mỗi 6-12 giờ)
- Đặt tên profiles có hệ thống
- Backup cookies định kỳ
- Test login trước khi upload hàng loạt

### ❌ DON'T:
- Dùng chung proxy cho nhiều accounts
- Upload quá nhiều videos cùng lúc
- Share cookies giữa các profiles
- Upload cùng content lên nhiều accounts ngay lập tức

## Troubleshooting

### Cookies hết hạn?
```bash
# Re-export cookies từ GenLogin
# Hoặc tự động refresh với script trên
```

### GenLogin không chạy?
```bash
# Kiểm tra GenLogin API
curl http://localhost:50325/health

# Start GenLogin trước khi chạy script
```

### Upload bị fail?
```bash
# Kiểm tra cookies còn valid không
python cli.py show -c

# Test login lại trong GenLogin profile
```

## Advanced: Full Automation

### Script upload qua GenLogin API

```python
def upload_via_genlogin(profile_id, video_path, title):
    """Upload video using GenLogin profile"""
    
    # 1. Start GenLogin profile
    start_response = requests.post(
        f"{GENLOGIN_API}/browser/start/{profile_id}"
    )
    
    # 2. Get WebDriver endpoint
    selenium_port = start_response.json()["selenium_port"]
    
    # 3. Upload using Selenium
    from selenium import webdriver
    options = webdriver.ChromeOptions()
    options.add_experimental_option(
        "debuggerAddress", f"localhost:{selenium_port}"
    )
    
    driver = webdriver.Chrome(options=options)
    
    # ... TikTok upload logic ...
    
    # 4. Close profile
    requests.post(f"{GENLOGIN_API}/browser/stop/{profile_id}")
```

## Kết luận

Kết hợp GenLogin + TikTok Auto Uploader cho phép:

✅ Quản lý hàng chục/hàng trăm TikTok accounts an toàn
✅ Tự động hóa hoàn toàn từ YouTube → TikTok
✅ Tránh bị detect và ban accounts
✅ Scale dễ dàng với nhiều channels

**Recommended Stack:**
- GenLogin: Browser fingerprinting & cookies
- This Project: Download & Upload engine
- Cron/Scheduler: Automation timing
