import React, { useState, useEffect } from 'react';

interface AdminPanelProps {
  onKeySet: (key: string | null) => void;
  isKeySet: boolean;
  isDarkMode: boolean;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onKeySet, isKeySet, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_PASS = '6749467';

  // Vercel 환경변수에 API Key가 설정되어 있으면 비밀번호만 입력하면 됨
  const hasEnvKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY';

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      // 비밀번호가 맞으면 환경 변수의 API 키 사용
      onKeySet("ENV_KEY");
      setError('');
      setIsOpen(false);
      setPassword('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogout = () => {
    onKeySet(null);
    setIsOpen(false);
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
        {isKeySet ? '✅ SYSTEM' : '⚠️ SYSTEM'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`p-6 rounded-xl w-80 border shadow-2xl relative
            ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-white/50 text-slate-800'}
          `}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">관리자 인증</h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
              >✕</button>
            </div>

            {!isKeySet ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    관리자 비밀번호를 입력하면<br/>포스터 생성 기능을 사용할 수 있습니다.
                  </p>
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>관리자 비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500
                      ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-black'}
                    `}
                    placeholder="비밀번호 입력"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition-colors shadow-lg"
                >
                  인증하기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
                  <p className="text-green-500 text-lg font-bold mb-1">✅ 인증 완료</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    포스터 생성 기능을 사용할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full py-2 rounded font-medium transition-colors ${
                    isDarkMode ? 'bg-red-900/50 hover:bg-red-900/70 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
