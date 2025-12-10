import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import InputForm from './components/InputForm';
import PosterDisplay from './components/PosterDisplay';
import { generatePoster } from './services/geminiService';
import { PosterFormData, GeneratedPoster, MOVIE_STYLES } from './types';

const App: React.FC = () => {
  // Dark mode state: default to false (Light)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Stores the API Key. If coming from AIStudio environment, this might be a placeholder string.
  // If manual, it's the actual key.
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PosterFormData>({
    teamName: '',
    members: '',
    slogan: '',
    styleId: '',
    images: [],
  });
  const [generatedPoster, setGeneratedPoster] = useState<GeneratedPoster | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleKeySet = (key: string | null) => {
    setApiKey(key);
  };

  const handleSubmit = async () => {
    if (!apiKey) {
      alert("관리자 인증(API Key)이 필요합니다. 우측 상단에서 설정해주세요.");
      return;
    }
    
    if (formData.images.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedPoster(null);

    try {
      const selectedStyle = MOVIE_STYLES.find(s => s.id === formData.styleId);
      if (!selectedStyle) throw new Error("스타일이 선택되지 않았습니다.");

      // Pass the state apiKey. If it is the "STUDIO_ENV_KEY" placeholder, 
      // we pass null/undefined to the service so it falls back to process.env.API_KEY
      const keyToUse = apiKey === "STUDIO_ENV_KEY" ? undefined : apiKey;

      const imageUrl = await generatePoster(
        formData.images,
        {
          teamName: formData.teamName,
          members: formData.members,
          slogan: formData.slogan,
        },
        selectedStyle,
        keyToUse
      );

      setGeneratedPoster({ imageUrl });
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("403"))) {
         // Don't reset key immediately to allow retry, just show specific error
         setError("API Key가 유효하지 않거나 권한이 없습니다. 관리자 설정에서 키를 확인해주세요.");
      } else {
         setError(err.message || "포스터 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Cinematic Background Image & Overlay */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          // Movie theater red seats background (CGV style)
          backgroundImage: 'url("https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2000&auto=format&fit=crop")',
        }}
      >
        {/* Dark Mode Overlay: Darker cinematic fade */}
        <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/60'}`}></div>
        {/* Gradient Overlay for style */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-purple-900/40 to-black/60' : 'from-blue-50/50 to-purple-50/50'}`}></div>
      </div>

      <div className="p-4 md:p-8 flex flex-col min-h-screen">
        {/* Header Area */}
        <header className="relative z-10 flex flex-col items-center justify-center mb-8 gap-4">
           {/* Title */}
           <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent filter drop-shadow-sm">
              AI 팀 포스터 생성기
            </h1>
            <p className={`text-sm md:text-base font-bold tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              당신의 팀을 블록버스터 영화의 주인공으로 만들어보세요!
            </p>
          </div>

          {/* Controls */}
          <div className="absolute right-0 top-0 flex items-center gap-4">
             {/* Theme Toggle */}
             <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20' 
                  : 'bg-white/50 border-gray-200 text-slate-700 hover:bg-white/80'
              }`}
              title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
             >
               {isDarkMode ? (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
               ) : (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
               )}
             </button>

             {/* Admin Panel */}
             <div className="relative">
                <AdminPanel onKeySet={handleKeySet} isKeySet={!!apiKey} isDarkMode={isDarkMode} />
             </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Left Column: Inputs */}
          <section className={`glass-panel rounded-2xl p-6 md:p-8 border shadow-2xl relative overflow-hidden transition-colors duration-300
            ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/60 border-white/50'}
          `}>
            {/* Decorative Elements (Subtle) */}
            <div className={`absolute top-0 left-0 w-40 h-40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-300'}`} />
            <div className={`absolute bottom-0 right-0 w-40 h-40 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 opacity-30 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-300'}`} />
            
            <div className="relative z-10">
              <InputForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleSubmit}
                isGenerating={isGenerating}
                disabled={!apiKey || isGenerating}
                isDarkMode={isDarkMode}
              />
              {!apiKey && (
                <div className="absolute inset-0 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl text-center p-4 bg-black/50">
                  <div className={`p-8 rounded-xl shadow-2xl max-w-sm border ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-800'
                  }`}>
                    <p className="text-4xl mb-4">🔒</p>
                    <h3 className="text-xl font-bold mb-2">시스템 잠김</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      관리자 인증 후 사용 가능합니다.<br/>우측 상단 버튼을 눌러주세요.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Display */}
          <section className={`glass-panel rounded-2xl border shadow-2xl relative overflow-hidden min-h-[600px] lg:min-h-auto flex flex-col transition-colors duration-300
            ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/60 border-white/50'}
          `}>
             <PosterDisplay 
               poster={generatedPoster} 
               isGenerating={isGenerating} 
               error={error} 
               isDarkMode={isDarkMode}
             />
          </section>

        </main>

        {/* Footer */}
        <footer className={`mt-12 text-center text-xs py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} font-semibold bg-white/30 backdrop-blur-sm rounded-lg mx-auto max-w-md mb-8`}>
          <p>Powered by Google Gemini Nano Banana Pro & React</p>
        </footer>
      </div>
    </div>
  );
};

export default App;