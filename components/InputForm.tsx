import React, { useRef } from 'react';
import { PosterFormData, MOVIE_STYLES } from '../types';

interface InputFormProps {
  formData: PosterFormData;
  setFormData: React.Dispatch<React.SetStateAction<PosterFormData>>;
  onSubmit: () => void;
  isGenerating: boolean;
  disabled: boolean;
  isDarkMode: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, isGenerating, disabled, isDarkMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
    isDarkMode
      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
      : 'bg-white/70 border-gray-300 text-slate-800 placeholder-gray-500'
  }`;

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>🎬 팀 이름</label>
        <input
          type="text"
          value={formData.teamName}
          onChange={(e) => setFormData((prev) => ({ ...prev, teamName: e.target.value }))}
          placeholder="예: 드림팀"
          className={inputClass}
          disabled={disabled}
        />
      </div>

      <div>
        <label className={labelClass}>👥 팀원 이름 (쉼표로 구분)</label>
        <input
          type="text"
          value={formData.members}
          onChange={(e) => setFormData((prev) => ({ ...prev, members: e.target.value }))}
          placeholder="예: 홍길동, 김철수, 이영희"
          className={inputClass}
          disabled={disabled}
        />
      </div>

      <div>
        <label className={labelClass}>💬 슬로건 / 캐치프레이즈</label>
        <input
          type="text"
          value={formData.slogan}
          onChange={(e) => setFormData((prev) => ({ ...prev, slogan: e.target.value }))}
          placeholder="예: 불가능은 없다!"
          className={inputClass}
          disabled={disabled}
        />
      </div>

      <div>
        <label className={labelClass}>🎨 영화 스타일 선택</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2">
          {MOVIE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, styleId: style.id }))}
              disabled={disabled}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.styleId === style.id
                  ? `bg-gradient-to-r ${style.color} text-white border-transparent shadow-lg scale-105`
                  : isDarkMode
                  ? 'bg-white/5 border-white/20 text-gray-200 hover:bg-white/10'
                  : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-white/80'
              }`}
            >
              <span className="text-lg">{style.emoji}</span>
              <span className="block mt-1 truncate">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>📸 팀원 사진 업로드 (최대 5장)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || formData.images.length >= 5}
          className={`w-full py-4 border-2 border-dashed rounded-xl transition-all ${
            isDarkMode
              ? 'border-white/30 text-gray-300 hover:border-purple-400 hover:bg-white/5'
              : 'border-gray-300 text-gray-600 hover:border-purple-500 hover:bg-purple-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-2xl">📷</span>
          <p className="mt-1 text-sm">클릭하여 이미지 추가</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {formData.images.length}/5 업로드됨
          </p>
        </button>

        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-white/30"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled || !formData.styleId || formData.images.length === 0}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          disabled || !formData.styleId || formData.images.length === 0
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            포스터 생성 중...
          </span>
        ) : (
          '🎬 포스터 생성하기'
        )}
      </button>
    </form>
  );
};

export default InputForm;
