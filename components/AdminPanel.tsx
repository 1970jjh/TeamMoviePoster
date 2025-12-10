import React, { useState, useEffect } from 'react';

interface AdminPanelProps {
  onKeySet: (key: string | null) => void;
  isKeySet: boolean;
  isDarkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onKeySet, isKeySet, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);

  const ADMIN_PASS = '6749467';

  // Check if we are in the specific demo environment
  useEffect(() => {
    const hasAIStudio = typeof window !== 'undefined' && window.aistudio;
    if (!hasAIStudio) {
      setUseManualInput(true);
    } else {
      checkAIStudioKey();
    }
  }, []);

  const checkAIStudioKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (hasKey) {
         // If authenticated via studio, we pass a dummy non-empty string to indicate success
         // The service will default to process.env.API_KEY
         onKeySet("STUDIO_ENV_KEY");
      }
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSelectKeyAIStudio = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        await checkAIStudioKey();
      } else {
        setError('API Key selection interface not found. Please use manual input.');
        setUseManualInput(true);
      }
    } catch (e) {
      console.error(e);
      setError('키 선택 중 오류가 발생했습니다.');
    }
  };

  const handleManualKeySubmit = () => {
    if (!manualKey.trim()) {
      setError('API Key를 입력해주세요.');
      return;
    }
    // Set the manually entered key
    onKeySet(manualKey);
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wider uppercase transition-all backdrop-blur-md border shadow-lg
          ${isKeySet 
            ? 'bg-green-500/20 text-green-600 border-green-500/30 hover:bg-green-500/30' 
            : 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30'}
          ${isDarkMode ? 'shadow-black/20' : 'shadow-gray-200'}
        `}
      >
        {isKeySet ? '✅ System Ready' : '⚠️ Admin Setup'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`p-6 rounded-xl w-80 animate-in fade-in zoom-in duration-200 border shadow-2xl relative
            ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-white/50 text-slate-800'}
          `}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">관리자 설정</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
              >✕</button>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>관리자 비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500
                      ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}
                    `}
                    placeholder="******"
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition-colors shadow-lg"
                >
                  로그인
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Gemini Nano Banana Pro 사용을 위해<br/>Google Cloud API Key가 필요합니다.
                  </p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    API Key 발급받기
                  </a>
                </div>

                {/* Conditional Rendering based on Environment */}
                {!useManualInput ? (
                  <button
                    onClick={handleSelectKeyAIStudio}
                    className={`w-full py-3 rounded font-bold transition-colors shadow-lg flex items-center justify-center gap-2
                      ${isKeySet 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}
                    `}
                  >
                    {isKeySet ? '키 변경하기 (AI Studio)' : 'API Key 선택 (AI Studio)'}
                  </button>
                ) : (
                  <div className="space-y-2">
                     <label className={`block text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                       API Key 입력 (Manual)
                     </label>
                     <input
                      type="password"
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                      placeholder="AIza..."
                      className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm
                        ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}
                      `}
                    />
                    <button
                      onClick={handleManualKeySubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-colors shadow-lg text-sm"
                    >
                      Key 저장 및 인증
                    </button>
                  </div>
                )}
                
                {isKeySet && (
                   <div className="bg-green-500/10 border border-green-500/20 p-2 rounded text-center">
                     <p className="text-green-500 text-xs font-bold">인증 완료됨</p>
                   </div>
                )}
                
                {/* Toggle input mode fallback */}
                {!useManualInput && (
                   <button 
                    onClick={() => setUseManualInput(true)}
                    className="text-xs text-gray-500 underline w-full text-center hover:text-gray-400"
                   >
                     직접 입력하기
                   </button>
                )}

                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;