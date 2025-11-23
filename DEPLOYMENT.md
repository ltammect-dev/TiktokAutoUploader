# 🚀 Deploy TikTok Auto Uploader lên Railway

## 📋 Tổng quan

Hướng dẫn deploy project lên Railway.app để chạy cả:
- ✅ Python YouTube Monitor (auto download & upload)
- ✅ Next.js Dashboard (web interface)

Deploy chỉ **3 bước**, **10 phút** hoàn thành!

---

## 🎯 Bước 1: Chuẩn bị

### 1.1. Tạo tài khoản Railway

1. Truy cập: https://railway.app
2. Click **"Start a New Project"**
3. Đăng nhập bằng **GitHub** (đơn giản nhất)

### 1.2. Upload TikTok Cookies

**Quan trọng:** Cần có cookies TikTok để upload được

1. Đảm bảo file cookies trong thư mục `CookiesDir/`:
   ```
   CookiesDir/
   └── tiktok_session-japanese.207.cookie
   ```

2. **Lưu ý:** Cookies sẽ được git ignore, cần upload thủ công sau khi deploy

---

## 🚀 Bước 2: Deploy lên Railway

### 2.1. Push code lên GitHub

```bash
# Commit các file mới
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### 2.2. Deploy trên Railway

1. Vào Railway Dashboard: https://railway.app/dashboard
2. Click **"New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository: **`TiktokAutoUploader`**
5. Railway sẽ tự động:
   - ✅ Detect language (Python + Node.js)
   - ✅ Install dependencies
   - ✅ Build Next.js dashboard
   - ✅ Deploy cả 2 services

### 2.3. Configure Environment Variables

Trong Railway Dashboard:

1. Click vào project vừa tạo
2. Tab **"Variables"**
3. Thêm các biến:

```env
YOUTUBE_CHANNEL_URL=https://www.youtube.com/@daile861
CHANNEL_ID=UCsF3f0SafJJw9Y_iv6tVBHg
TIKTOK_USERNAME=japanese.207
MIN_DURATION=45
MAX_DURATION=180
TARGET_DURATION=60
CHECK_INTERVAL=2
PORT=3000
NODE_ENV=production
```

4. Click **"Add"** → **"Redeploy"**

---

## 🔧 Bước 3: Upload Cookies & Test

### 3.1. Upload TikTok Cookies

**Option 1: Railway CLI (Khuyến nghị)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Upload cookies
railway run bash
mkdir -p CookiesDir
# Sau đó upload file cookie vào thư mục này
```

**Option 2: Through Dashboard Console**

1. Railway Dashboard → Project → **"Settings"**
2. Scroll xuống **"Service Settings"**
3. Click **"Terminal"** → Open terminal
4. Tạo thư mục và upload:
   ```bash
   mkdir -p CookiesDir
   # Upload file cookie qua SFTP hoặc paste content
   ```

### 3.2. Restart Services

```bash
railway restart
```

### 3.3. Kiểm tra Logs

```bash
# Xem logs real-time
railway logs

# Hoặc trên Dashboard
# Project → "Deployments" → Click vào deployment → "View Logs"
```

Logs thành công sẽ hiện:
```
🚀 Starting TikTok Auto Uploader...
📺 Starting YouTube Monitor...
Python Monitor started with PID: xxx
🎨 Starting Dashboard...
Dashboard started with PID: xxx
```

---

## 🌐 Bước 4: Truy cập Dashboard

### 4.1. Lấy Public URL

1. Railway Dashboard → Project
2. Tab **"Settings"**
3. Section **"Networking"**
4. Click **"Generate Domain"**
5. Railway sẽ tạo URL: `https://your-project-name.railway.app`

### 4.2. Truy cập Dashboard

Mở browser: `https://your-project-name.railway.app`

Bạn sẽ thấy:
- ✅ Dashboard status
- ✅ Video statistics
- ✅ Real-time logs
- ✅ Control panel (Start/Stop monitor)

---

## 📊 Monitoring & Management

### Xem Logs

```bash
# Railway CLI
railway logs --follow

# Hoặc Dashboard
Project → Deployments → View Logs
```

### Restart Service

```bash
# CLI
railway restart

# Hoặc Dashboard
Project → Settings → Restart
```

### Stop Service

```bash
# CLI
railway down

# Hoặc Dashboard
Project → Settings → Remove Service
```

---

## 💰 Chi phí

### Railway Free Tier:
- **$5 credit/tháng** (miễn phí)
- **500 hours** execution time
- **100GB** bandwidth
- **1GB** RAM

**Đủ cho project này!** ✅

### Nếu vượt limit:
- **Hobby Plan**: $5/tháng
- **Pro Plan**: $20/tháng

---

## 🔍 Troubleshooting

### Lỗi: "Build failed"

**Nguyên nhân:** Dependencies không install được

**Giải pháp:**
```bash
# Kiểm tra requirements.txt
# Đảm bảo có đầy đủ dependencies

# Hoặc xem logs build
railway logs --deployment <deployment-id>
```

### Lỗi: "Port already in use"

**Nguyên nhân:** Railway auto-assign PORT

**Giải pháp:** Đảm bảo Next.js dùng biến `PORT`:
```js
// dashboard/package.json
"start": "next start -p $PORT"
```

### Lỗi: "Cookie not found"

**Nguyên nhân:** Chưa upload cookies

**Giải pháp:**
```bash
railway run bash
mkdir -p CookiesDir
# Upload cookies file
railway restart
```

### Lỗi: "Python script not running"

**Nguyên nhân:** Script bị crash

**Giải pháp:**
```bash
# Xem logs chi tiết
railway logs | grep "youtube_monitor"

# Restart
railway restart
```

---

## 🎯 Alternative: Render.com

Nếu Railway không hoạt động, có thể dùng **Render.com** (tương tự):

### Render Setup:

1. Truy cập: https://render.com
2. Sign up với GitHub
3. **New** → **Web Service**
4. Connect repository
5. Configure:
   - **Build Command:** `cd dashboard && npm install && npm run build && cd .. && pip install -r requirements.txt`
   - **Start Command:** `bash start.sh`
6. Deploy!

**Free tier:** 750 hours/tháng

---

## 📝 Checklist Deploy

- [ ] Tạo tài khoản Railway
- [ ] Push code lên GitHub
- [ ] Deploy project từ GitHub
- [ ] Thêm Environment Variables
- [ ] Upload TikTok cookies
- [ ] Restart services
- [ ] Generate public domain
- [ ] Test dashboard
- [ ] Verify YouTube monitor hoạt động
- [ ] Check logs

---

## 🆘 Support

Nếu gặp vấn đề:

1. **Xem logs:** `railway logs`
2. **Check Railway docs:** https://docs.railway.app
3. **GitHub Issues:** Repository issues

---

## ✅ Xong!

Giờ project của bạn chạy 24/7 trên cloud:
- ✅ Tự động monitor YouTube
- ✅ Tự động download videos
- ✅ Tự động upload TikTok
- ✅ Dashboard để quản lý
- ✅ Không cần máy tính mở

**Enjoy!** 🎉
