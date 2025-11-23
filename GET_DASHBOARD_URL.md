# 🌐 Hướng dẫn lấy URL Dashboard

## Cách 1: Qua Railway Dashboard (Đơn giản nhất)

1. Truy cập: https://railway.app/dashboard
2. Click vào project: **amused-renewal**
3. Click vào service **"worker"**
4. Tab **"Settings"**
5. Scroll xuống phần **"Networking"**
6. Click **"Generate Domain"**
7. Railway sẽ tạo URL dạng: `https://amused-renewal-production.up.railway.app`

## Cách 2: Qua Railway CLI

```bash
railway domain
```

## ✅ Truy cập Dashboard

Sau khi có URL, mở browser:

```
https://your-project-name.railway.app
```

Bạn sẽ thấy:
- 📊 Dashboard status
- 📈 Statistics
- 📋 Logs viewer
- ⚙️ Settings

## 🔧 Nếu chưa thấy gì

Railway có thể đang build. Kiểm tra:

```bash
# Xem deployment status
railway status

# Xem logs real-time
railway logs
```

## 📝 Lưu ý

**Không có cookies:** Dashboard vẫn hoạt động nhưng:
- ✅ Có thể xem UI
- ✅ Có thể xem settings
- ❌ Không thể upload videos (cần cookies)

**Để thêm cookies sau:** Xem file `ADD_COOKIES_LATER.md`
