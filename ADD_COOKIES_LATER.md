# 🔑 Hướng dẫn thêm TikTok Cookies sau khi Deploy

## Tại sao cần cookies?

Cookies TikTok cần thiết để script có thể upload videos tự động lên tài khoản TikTok của bạn.

---

## 📝 Cách 1: Upload Cookies qua Railway Dashboard (Đơn giản nhất)

### Bước 1: Login TikTok trên máy local

```bash
# Activate virtual environment
source venv/bin/activate

# Login vào TikTok
python cli.py login -n japanese.207
```

Trình duyệt sẽ mở, đăng nhập TikTok. Sau khi login thành công, cookie sẽ được lưu tại:
```
CookiesDir/tiktok_session-japanese.207.cookie
```

### Bước 2: Encode cookie sang base64

```bash
# Tạo file base64
base64 -i CookiesDir/tiktok_session-japanese.207.cookie -o cookie_base64.txt
```

### Bước 3: Upload lên Railway

**Option A: Qua Railway Dashboard**

1. Vào https://railway.app/dashboard
2. Click vào project của bạn
3. Tab **"Variables"**
4. Add variable mới:
   - Name: `TIKTOK_COOKIE_BASE64`
   - Value: (paste nội dung từ `cookie_base64.txt`)

5. Update script để decode cookie khi start

**Option B: Qua Railway Shell**

```bash
# Mở Railway shell
railway shell

# Tạo thư mục
mkdir -p CookiesDir

# Copy file (mở terminal khác và chạy)
railway run bash -c "cat > CookiesDir/tiktok_session-japanese.207.cookie" < CookiesDir/tiktok_session-japanese.207.cookie

# Verify
ls -lh CookiesDir/
```

### Bước 4: Restart service

```bash
railway restart
```

---

## 📝 Cách 2: Dùng Railway Volumes (Recommended)

### Bước 1: Tạo Volume trên Railway

1. Railway Dashboard → Project
2. Service → **"Settings"**
3. **"Volumes"** → **"New Volume"**
4. Config:
   - Name: `cookies-storage`
   - Mount Path: `/app/CookiesDir`

### Bước 2: Upload cookies vào Volume

```bash
# Connect và upload
railway shell

# Copy cookies
# Sẽ cần manual paste hoặc dùng base64
```

---

## 📝 Cách 3: Tự động với Environment Variable

Update `start.sh` để tự động tạo cookie từ env variable:

```bash
#!/bin/bash

# Create directories
mkdir -p CookiesDir

# If cookie is in env variable, decode it
if [ ! -z "$TIKTOK_COOKIE_BASE64" ]; then
    echo "🔑 Decoding TikTok cookie from environment..."
    echo "$TIKTOK_COOKIE_BASE64" | base64 -d > CookiesDir/tiktok_session-japanese.207.cookie
    echo "✓ Cookie saved"
fi

# Start services...
```

Sau đó add env variable `TIKTOK_COOKIE_BASE64` trên Railway.

---

## ✅ Verify Cookie đã hoạt động

Sau khi upload cookies:

1. Check logs:
```bash
railway logs
```

2. Tìm messages:
```
✓ Cookie loaded successfully
```

3. Test upload:
```bash
railway run python cli.py show -u
```

Nếu thấy username `japanese.207` là OK!

---

## 🔄 Khi nào cần update cookies?

- Cookie hết hạn (thường sau 30-90 ngày)
- Đăng xuất TikTok trên browser
- Thay đổi mật khẩu TikTok
- TikTok yêu cầu verify lại

**Dấu hiệu cookie hết hạn:**
- Upload failed với error "Unauthorized"
- Script báo lỗi "Invalid session"

**Giải pháp:** Login lại và upload cookie mới theo các bước trên.

---

## 💡 Tips

1. **Backup cookies:** Lưu file cookie ở nơi an toàn
2. **Test local trước:** Chạy upload test trên máy local trước khi upload lên Railway
3. **Keep cookies updated:** Set reminder sau 60 ngày để refresh cookies

---

## 🆘 Troubleshooting

### Lỗi: "Cookie file not found"

**Nguyên nhân:** Chưa upload cookies hoặc path sai

**Giải pháp:**
```bash
railway run ls -la CookiesDir/
```

Nếu rỗng → Upload lại cookies

### Lỗi: "EOFError: Ran out of input"

**Nguyên nhân:** Cookie file corrupt hoặc rỗng

**Giải pháp:**
```bash
# Xóa file cũ
railway run rm CookiesDir/tiktok_session-japanese.207.cookie

# Upload lại
```

### Lỗi: "Upload failed - Unauthorized"

**Nguyên nhân:** Cookie hết hạn

**Giải pháp:** Login lại và upload cookie mới
