import React, { useState } from 'react';
import { Download, Youtube, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';

interface ThumbnailOption {
  quality: string;
  resolution: string;
  url: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('maxresdefault');

  const thumbnailQualities = [
    { quality: 'Maximum', resolution: '1920x1080', id: 'maxresdefault' },
    { quality: 'High', resolution: '1280x720', id: 'hqdefault' },
    { quality: 'Medium', resolution: '640x480', id: 'mqdefault' },
    { quality: 'Standard', resolution: '480x360', id: 'sddefault' },
    { quality: 'Default', resolution: '120x90', id: 'default' },
  ];

  const getVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const getThumbnailOptions = (videoId: string): ThumbnailOption[] => {
    return thumbnailQualities.map(quality => ({
      quality: quality.quality,
      resolution: quality.resolution,
      url: `https://img.youtube.com/vi/${videoId}/${quality.id}.jpg`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoId('');
    setCopied(null);

    const id = getVideoId(url);
    if (!id) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setVideoId(id);
  };

  const handleDownload = (thumbnailUrl: string) => {
    const link = document.createElement('a');
    link.href = thumbnailUrl;
    link.download = `youtube-thumbnail-${videoId}-${selectedQuality}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async (thumbnailUrl: string) => {
    try {
      await navigator.clipboard.writeText(thumbnailUrl);
      setCopied(thumbnailUrl);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      setError('Failed to copy URL');
    }
  };

  const openYouTubeVideo = () => {
    if (videoId) {
      window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Youtube className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              YouTube Thumbnail Downloader
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Download high-quality thumbnails in multiple resolutions
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
                YouTube Video URL
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-2"
                >
                  Get Thumbnails
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {videoId && (
            <div className="mt-8 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Available Thumbnails</h2>
                <button
                  onClick={openYouTubeVideo}
                  className="text-gray-600 hover:text-red-600 flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Video
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getThumbnailOptions(videoId).map((option) => (
                  <div key={option.quality} className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="relative group">
                      <img
                        src={option.url}
                        alt={`${option.quality} thumbnail`}
                        className="w-full rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.parentElement?.classList.add('hidden');
                        }}
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleCopyUrl(option.url)}
                          className="bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 transition group-hover:scale-105"
                        >
                          {copied === option.url ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDownload(option.url)}
                          className="bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 transition group-hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{option.quality}</span>
                      <span className="text-sm text-gray-500">{option.resolution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-600 space-y-2">
          <p>All available thumbnail qualities will be shown automatically</p>
          <p className="text-sm">Some qualities might not be available for all videos</p>
        </footer>
      </div>
    </div>
  );
}

export default App;