import React from 'react';
import { GeneratedPoster } from '../types';

interface PosterDisplayProps {
  poster: GeneratedPoster | null;
  isGenerating: boolean;
  error: string | null;
  isDarkMode: boolean; // Added prop
}

const PosterDisplay: React.FC<PosterDisplayProps> = ({ poster, isGenerating, error, isDarkMode }) => {
  
  const handleDownload = () => {
    if (poster) {
      const link = document.createElement('a');
      link.href = poster.imageUrl;
      link.download = `team-poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
       {/* Background Grid Pattern for Display Area */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none opacity-20 bg-[size:40px_40px] ${
        isDarkMode 
          ? 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] border-2 border-white/10' 
          : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] border-2 border-black/5'
      }`} />

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center min-h-[500px] sm:min-h-[600px] p-6">
        
        {/* State 1: Empty */}
        {!poster && !isGenerating && !error && (
          <div className={`text-center flex flex-col items-center ${isDarkMode ? 'opacity-50' : 'opacity-60'}`}>
            <div className="relative mb-6">
              <svg className={`w-20 h-20 ${isDarkMode ? 'text-white/20' : 'text-black/10'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center animate-bounce shadow-lg">
                ✨
              </div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>생성된 포스터가 여기에 표시됩니다</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>왼쪽 양식을 작성하고 생성 버튼을 누르세요.</p>
          </div>
        )}

        {/* State 2: Generating */}
        {isGenerating && (
          <div className="text-center z-10">
            <div className={`relative w-40 h-60 mx-auto mb-8 rounded-lg border overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] ${
              isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-purple-200'
            }`}>
               <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/20 to-transparent animate-scan" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <span className="text-5xl animate-pulse">🎬</span>
               </div>
            </div>
            <h3 className="text-2xl font-black mb-2 animate-pulse bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">AI가 촬영 중...</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>팀원들을 영화 속 주인공으로 캐스팅하고 있습니다.</p>
          </div>
        )}

        {/* State 3: Error */}
        {error && (
          <div className="text-center max-w-md p-6 glass-panel rounded-xl border border-red-500/30 bg-red-500/10 shadow-lg">
            <div className="text-4xl mb-4">💥</div>
            <h3 className="text-lg font-bold text-red-500 mb-2">오류가 발생했습니다</h3>
            <p className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>{error}</p>
          </div>
        )}

        {/* State 4: Success */}
        {poster && !isGenerating && (
          <div className="relative group perspective-1000">
             <div className="relative rounded-lg overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-[8px] border-white transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.02]">
                <img 
                  src={poster.imageUrl} 
                  alt="Generated Team Poster" 
                  className="max-h-[70vh] w-auto object-cover aspect-[3/4]"
                />
                
                {/* Download Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <button 
                    onClick={handleDownload}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg hover:scale-110 flex items-center gap-2"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                     다운로드
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation-name: scan;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};

export default PosterDisplay;