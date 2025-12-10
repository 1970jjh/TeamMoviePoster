import React from 'react';
import { GeneratedPoster } from '../types';

interface PosterDisplayProps {
  poster: GeneratedPoster | null;
  isGenerating: boolean;
  error: string | null;
  isDarkMode: boolean;
}

const PosterDisplay: React.FC<PosterDisplayProps> = ({ poster, isGenerating, error, isDarkMode }) => {
  const handleDownload = () => {
    if (!poster?.imageUrl) return;

    const link = document.createElement('a');
    link.href = poster.imageUrl;
    link.download = `team-poster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-purple-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-pink-500 border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className={`mt-6 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          AI가 포스터를 생성하고 있습니다...
        </p>
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          약 30초~1분 정도 소요됩니다
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className={`p-6 rounded-xl max-w-md text-center ${
          isDarkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <span className="text-4xl">⚠️</span>
          <h3 className={`mt-3 font-bold text-lg ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
            오류가 발생했습니다
          </h3>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-red-200' : 'text-red-600'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (poster?.imageUrl) {
    return (
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 flex items-center justify-center">
          <img
            src={poster.imageUrl}
            alt="Generated Team Poster"
            className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            포스터 다운로드
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="text-6xl mb-4">🎬</div>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          포스터 미리보기
        </h3>
        <p className="text-sm">
          왼쪽에서 정보를 입력하고<br />
          포스터를 생성해보세요!
        </p>
      </div>
    </div>
  );
};

export default PosterDisplay;
