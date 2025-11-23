'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Channel {
  id: string;
  youtube_url: string;
  tiktok_user: string;
  proxy: {
    enabled: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
  };
  enabled: boolean;
  proxyCountry?: string;
  proxyChecking?: boolean;
}

interface Config {
  channels: Channel[];
  settings: {
    check_interval: number;
    min_duration: number;
    max_duration: number;
    target_duration: number;
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: Config) => {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      
      if (res.ok) {
        setConfig(newConfig);
        setEditingChannel(null);
        setShowAddForm(false);
        alert('Cấu hình đã được lưu thành công!');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Lỗi khi lưu cấu hình!');
    } finally {
      setSaving(false);
    }
  };

  const handleAddChannel = () => {
    if (!config) return;
    
    const newChannel: Channel = {
      id: `channel_${Date.now()}`,
      youtube_url: '',
      tiktok_user: '',
      proxy: {
        enabled: false,
        host: '',
        port: 8080,
        username: '',
        password: '',
      },
      enabled: true,
    };
    
    const newChannels = [...config.channels, newChannel];
    setConfig({ ...config, channels: newChannels });
  };

  const handleSaveConfig = () => {
    if (!config) return;
    saveConfig(config);
  };

  const handleCheckProxy = async () => {
    if (!config) return;
    
    // Set all proxies to checking state
    const updatedChannels = config.channels.map(ch => ({
      ...ch,
      proxyChecking: ch.proxy.enabled,
      proxyCountry: undefined,
    }));
    setConfig({ ...config, channels: updatedChannels });

    // Check each proxy
    for (let i = 0; i < config.channels.length; i++) {
      const channel = config.channels[i];
      if (channel.proxy.enabled && channel.proxy.host) {
        try {
          const res = await fetch('/api/check-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              host: channel.proxy.host,
              port: channel.proxy.port,
              username: channel.proxy.username,
              password: channel.proxy.password,
            }),
          });

          const data = await res.json();
          
          // Update specific channel
          setConfig(prev => {
            if (!prev) return prev;
            const newChannels = [...prev.channels];
            newChannels[i] = {
              ...newChannels[i],
              proxyCountry: data.country || 'Unknown',
              proxyChecking: false,
            };
            return { ...prev, channels: newChannels };
          });
        } catch (error) {
          setConfig(prev => {
            if (!prev) return prev;
            const newChannels = [...prev.channels];
            newChannels[i] = {
              ...newChannels[i],
              proxyCountry: 'Error',
              proxyChecking: false,
            };
            return { ...prev, channels: newChannels };
          });
        }
      }
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    if (!config) return;
    if (!confirm('Bạn có chắc muốn xóa kênh này?')) return;

    const newChannels = config.channels.filter((ch) => ch.id !== channelId);
    saveConfig({ ...config, channels: newChannels });
  };

  const handleToggleChannel = (channelId: string) => {
    if (!config) return;

    const newChannels = config.channels.map((ch) =>
      ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
    );
    saveConfig({ ...config, channels: newChannels });
  };

  const exportConfig = () => {
    if (!config) return;
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'channels_config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setConfig(imported);
        alert('Import thành công!');
      } catch (error) {
        alert('File không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              TikTok Auto Uploader
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              YouTube to TikTok Automation Dashboard
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              📊 Dashboard
            </Link>
            <span className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
              🔴 Stopped
            </span>
          </div>
        </div>

        {/* Quản Lý Kênh */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Quản Lý Kênh
            </h2>
            <div className="flex gap-3">
              <label className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 cursor-pointer">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportConfig}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
              >
                📤 Export
              </button>
              <button
                onClick={handleCheckProxy}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                ✨ Check Proxy
              </button>
              <button
                onClick={handleAddChannel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                ➕ Thêm Kênh
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                💾 {saving ? 'Đang lưu...' : 'Lưu Cấu Hình'}
              </button>
            </div>
          </div>

          {/* Channels List */}
          {config?.channels.map((channel, index) => (
            <div
              key={channel.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kênh YouTube
                  </label>
                  <input
                    type="text"
                    value={channel.youtube_url}
                    onChange={(e) => {
                      const newChannels = [...config.channels];
                      newChannels[index].youtube_url = e.target.value;
                      setConfig({ ...config, channels: newChannels });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://www.youtube.com/@channel"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kênh #{index + 1} - ID: {channel.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    TikTok Username
                  </label>
                  <input
                    type="text"
                    value={channel.tiktok_user}
                    onChange={(e) => {
                      const newChannels = [...config.channels];
                      newChannels[index].tiktok_user = e.target.value;
                      setConfig({ ...config, channels: newChannels });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Proxy (host:port:user:pass)
                  </label>
                  <input
                    type="text"
                    value={`${channel.proxy.host}:${channel.proxy.port}:${channel.proxy.username}:${channel.proxy.password}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(':');
                      const newChannels = [...config.channels];
                      newChannels[index].proxy = {
                        enabled: channel.proxy.enabled,
                        host: parts[0] || '',
                        port: parseInt(parts[1]) || 8080,
                        username: parts[2] || '',
                        password: parts[3] || '',
                      };
                      setConfig({ ...config, channels: newChannels });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="proxy.com:8080:user:pass"
                  />
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={channel.proxy.enabled}
                      onChange={(e) => {
                        const newChannels = [...config.channels];
                        newChannels[index].proxy.enabled = e.target.checked;
                        setConfig({ ...config, channels: newChannels });
                      }}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Kích hoạt
                    </label>
                    {channel.proxyChecking && (
                      <span className="ml-3 text-sm text-blue-600 dark:text-blue-400">
                        🔄 Đang kiểm tra...
                      </span>
                    )}
                    {channel.proxyCountry && !channel.proxyChecking && (
                      <span className="ml-3 text-sm font-medium text-green-600 dark:text-green-400">
                        🌍 {channel.proxyCountry}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Hướng dẫn */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              📝 Hướng dẫn:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>
                • <strong>Lưu trữ:</strong> Cấu hình lưu trong browser
                (localStorage), không cần server
              </li>
              <li>
                • <strong>Export/Import:</strong> Download config dưới dạng JSON
                để backup hoặc chia sẻ
              </li>
              <li>
                • <strong>Check Proxy:</strong> Kiểm tra trạng thái và tốc độ
                của tất cả proxy
              </li>
              <li>
                • <strong>Multi-device:</strong> Export từ máy này và import
                sang máy khác
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
