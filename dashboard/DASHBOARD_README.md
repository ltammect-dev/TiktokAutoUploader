# TikTok Auto Uploader Dashboard

## 🎯 Overview
Web dashboard để quản lý và giám sát TikTok Auto Uploader tool.

## 🚀 Features

### 1. **Dashboard Tổng Quan**
- Hiển thị trạng thái script (Running/Stopped)
- Thống kê real-time: Videos processed, Success rate, Total time
- Charts: Upload history, Duration distribution

### 2. **Monitor Control**
- Start/Stop/Restart script
- View real-time logs
- Adjust check interval

### 3. **Video History**
- Danh sách videos đã xử lý
- Thông tin chi tiết: Title, Duration, Status, Timestamp
- Filter by date, status

### 4. **Settings**
- Configure YouTube channel
- Set duration filters (min/max)
- TikTok account settings
- Check interval adjustment

### 5. **Real-time Updates**
- WebSocket connection for live log streaming
- Auto-refresh statistics
- Notification cho video mới

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── history/page.tsx         # Video history
│   │   ├── settings/page.tsx        # Settings page
│   │   ├── layout.tsx               # Root layout
│   │   └── api/
│   │       ├── status/route.ts      # Get monitor status
│   │       ├── control/route.ts     # Start/Stop monitor
│   │       ├── logs/route.ts        # Get logs
│   │       ├── history/route.ts     # Get video history
│   │       └── stats/route.ts       # Get statistics
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── StatusCard.tsx       # Status display
│   │   │   ├── StatsCards.tsx       # Statistics cards
│   │   │   ├── LogViewer.tsx        # Real-time logs
│   │   │   ├── ControlPanel.tsx     # Start/Stop buttons
│   │   │   └── Charts.tsx           # Statistics charts
│   │   ├── history/
│   │   │   ├── VideoTable.tsx       # Video history table
│   │   │   └── VideoDetails.tsx     # Video detail modal
│   │   ├── settings/
│   │   │   ├── ChannelSettings.tsx  # YouTube channel
│   │   │   ├── FilterSettings.tsx   # Duration filters
│   │   │   └── AccountSettings.tsx  # TikTok account
│   │   └── ui/                      # shadcn/ui components
│   └── lib/
│       ├── api.ts                   # API client functions
│       ├── utils.ts                 # Utility functions
│       └── types.ts                 # TypeScript types
├── public/
└── package.json
```

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: React Hooks
- **API**: Next.js API Routes
- **Real-time**: Server-Sent Events (SSE) or WebSocket

## 📦 Installation

```bash
cd dashboard
npm install
```

## 🔧 Development

```bash
npm run dev
```

Dashboard sẽ chạy tại: `http://localhost:3000`

## 🌐 API Endpoints

### GET `/api/status`
Lấy trạng thái hiện tại của monitor script

**Response:**
```json
{
  "running": true,
  "pid": 12345,
  "uptime": "2h 30m",
  "lastCheck": "2025-11-23T16:30:00Z"
}
```

### POST `/api/control`
Điều khiển monitor (start/stop/restart)

**Request:**
```json
{
  "action": "start" | "stop" | "restart"
}
```

### GET `/api/logs`
Lấy logs gần đây

**Query params:**
- `lines`: Number of lines (default: 100)
- `follow`: Stream logs (SSE)

### GET `/api/history`
Lấy danh sách videos đã xử lý

**Query params:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status

### GET `/api/stats`
Lấy thống kê tổng quan

**Response:**
```json
{
  "totalProcessed": 125,
  "successRate": 98.4,
  "averageTime": 18.5,
  "todayUploads": 15
}
```

## 🎨 Components Overview

### StatusCard
Hiển thị trạng thái script với màu sắc:
- 🟢 Green: Running
- 🔴 Red: Stopped
- 🟡 Yellow: Processing

### StatsCards
4 cards hiển thị:
1. Total Videos
2. Success Rate
3. Average Time
4. Today's Uploads

### LogViewer
- Real-time log streaming
- Auto-scroll
- Color-coded log levels
- Search/filter capability

### ControlPanel
Buttons để:
- Start Monitor
- Stop Monitor
- Restart Monitor
- Clear History

### Charts
- Upload Timeline (Line chart)
- Success/Failure (Pie chart)
- Duration Distribution (Bar chart)

## 🔗 Integration với Python Script

Dashboard giao tiếp với Python script thông qua:

1. **Process Management**: Sử dụng `child_process` để start/stop Python script
2. **Log Reading**: Đọc file `youtube_monitor.log`
3. **History**: Đọc file `youtube_history.json`
4. **Status**: Check process bằng PID file

## 🚀 Next Steps

1. Install shadcn/ui components:
```bash
npx shadcn@latest add card button badge table chart
```

2. Create API routes để kết nối với Python script

3. Build UI components

4. Add real-time updates

5. Deploy (Vercel recommended)

## 📝 Notes

- Dashboard chạy độc lập với Python script
- Có thể truy cập từ bất kỳ device nào trong network
- Responsive design cho mobile/tablet
- Dark mode support

## 🎯 Future Enhancements

- [ ] Multi-channel support
- [ ] Email notifications
- [ ] Video preview
- [ ] Scheduled uploads
- [ ] Analytics dashboard
- [ ] User authentication
