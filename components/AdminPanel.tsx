import React, { useState } from 'react';

interface AdminPanelProps {
  onKeySet: (key: string | null) => void;
  isKeySet: boolean;
  isDarkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onKeySet, isKeySet, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      onKeySet(apiKeyInput.trim());
      setIsOpen(false);
      setApiKeyInput('');
    }
  };

  const handleUseEnvKey = () => {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY') {
      onKeySet("STUDIO_ENV_KEY");
      setIsOpen(false);
    } else {
      alert("환경 변수에서 API 키를 찾을 수 없습니다. 직접 입력해주세요.");
    }
  };

  const handleReset = () => {
    onKeySet(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg transition-all ${
          isDarkMode
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-white/70 border-gray-200 text-slate-700 hover:bg-white/90'
        } ${isKeySet ? 'ring-2 ring-green-500' : ''}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">관리자</span>
        {isKeySet && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border p-4 z-50 ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-800'
        }`}>
          <h3 className="font-bold text-lg mb-3">🔐 관리자 설정</h3>
          {isKeySet ? (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <span className="text-green-500">✓</span>
                <span className="text-sm">API 키가 설정되었습니다</span>
              </div>
              <button
                onClick={handleReset}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode ? 'bg-red-900/50 hover:bg-red-900/70 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}
              >
                키 초기화
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="API 키를 입력하세요"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-slate-800 placeholder-gray-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                인증하기
              </button>
              <button
                type="button"
                onClick={handleUseEnvKey}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                환경 변수 사용
              </button>
            </form>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className={`absolute top-2 right-2 p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
