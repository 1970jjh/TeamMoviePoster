import React, { useCallback } from 'react';
import { MOVIE_STYLES, PosterFormData } from '../types';

interface InputFormProps {
  formData: PosterFormData;
  setFormData: React.Dispatch<React.SetStateAction<PosterFormData>>;
  onSubmit: () => void;
  isGenerating: boolean;
  disabled: boolean;
  isDarkMode: boolean; // Added prop
}

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, isGenerating, disabled, isDarkMode }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  }, [disabled, setFormData]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const clearAllImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const inputBaseClass = `w-full border rounded-lg p-3 transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
    isDarkMode 
      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
      : 'bg-white/50 border-gray-300 text-slate-900 placeholder-gray-400'
  }`;

  const labelClass = `block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`;

  return (
    <div className="space-y-6">
      {/* Text Inputs */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>팀명</label>
          <input
            type="text"
            value={formData.teamName}
            onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
            placeholder="예: 어벤져스"
            className={inputBaseClass}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelClass}>팀원 이름 (쉼표로 구분)</label>
          <input
            type="text"
            value={formData.members}
            onChange={(e) => setFormData(prev => ({ ...prev, members: e.target.value }))}
            placeholder="예: 토니, 스티브, 나타샤"
            className={inputBaseClass}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelClass}>팀 원칙 또는 슬로건</label>
          <textarea
            value={formData.slogan}
            onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
            placeholder="예: 함께라면 무엇이든 할 수 있다!"
            rows={2}
            className={`${inputBaseClass} resize-none`}
            disabled={disabled}
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className={labelClass}>사진 업로드 (단체 사진 또는 개인별 사진)</label>
          {formData.images.length > 0 && (
             <button 
              onClick={clearAllImages}
              className="text-xs text-red-500 hover:text-red-700 font-medium underline"
            >
              전체 삭제
            </button>
          )}
        </div>
        
        {/* Upload Area */}
        <div className="space-y-3">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative group
                ${isDarkMode 
                    ? 'border-white/20 hover:border-purple-500 hover:bg-white/5' 
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={disabled}
              />
              
              <div className="flex flex-col items-center justify-center py-4">
                  <div className="text-3xl mb-2 opacity-50 group-hover:scale-110 transition-transform">🖼️</div>
                  <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    클릭하거나 사진을 이곳에 드래그하세요
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    PNG, JPG, WEBP (여러 장 선택 가능)
                  </p>
              </div>
            </div>

            {/* Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`preview-${idx}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(idx)}
                        className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors transform hover:scale-110"
                        title="사진 삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <label className={labelClass}>포스터 스타일 선택 (총 20종)</label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {MOVIE_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setFormData(prev => ({ ...prev, styleId: style.id }))}
              disabled={disabled}
              className={`
                relative p-2 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1 aspect-square
                ${formData.styleId === style.id 
                  ? 'bg-gradient-to-br border-transparent ring-2 ring-offset-1 ring-offset-transparent scale-105 shadow-lg' 
                  : isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                }
                ${formData.styleId === style.id ? style.color + (isDarkMode ? ' ring-white' : ' ring-gray-400') : ''}
              `}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-md">{style.emoji}</span>
              <span className={`text-[10px] font-medium text-center leading-tight break-keep ${
                formData.styleId === style.id ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
              }`}>
                {style.name}
              </span>
              {formData.styleId === style.id && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onSubmit}
        disabled={disabled || formData.images.length === 0 || !formData.teamName || !formData.styleId}
        className={`
          w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-300 relative overflow-hidden group shadow-lg
          ${disabled || formData.images.length === 0 || !formData.teamName || !formData.styleId 
            ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white active:scale-[0.99] hover:brightness-110'}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              생성 중...
            </>
          ) : (
            <>
              ✨ 팀 포스터 생성
            </>
          )}
        </span>
        {!disabled && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        )}
      </button>
    </div>
  );
};

export default InputForm;