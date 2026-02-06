import React, { useState } from 'react';
import { Search, Map as MapIcon, BookOpen, Feather, ExternalLink, MapPin, Languages, Settings as SettingsIcon } from 'lucide-react';
import { BookLocation, Language } from '../types';

interface SidebarProps {
  currentCity: string;
  onSearch: (city: string) => void;
  selectedLocation: BookLocation | null;
  onCloseLocation: () => void;
  isLoading: boolean;
  onExport: () => void;
  onOpenSettings: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentCity, 
  onSearch, 
  selectedLocation, 
  onCloseLocation, 
  isLoading,
  onExport,
  onOpenSettings,
  language,
  onToggleLanguage
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
      setSearchInput('');
    }
  };

  const t = (obj: any) => obj ? (obj[language] || obj['en'] || '') : '';

  return (
    <div className="absolute top-0 left-0 h-full w-full md:w-96 bg-parchment-100 shadow-2xl z-10 flex flex-col border-r-4 border-parchment-400 font-serif">
      {/* Header / Search */}
      <div className="p-6 bg-parchment-200 border-b border-ink-600/20 relative">
        <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-ink-900 tracking-wider">Ink & Atlas</h1>
            <div className="flex gap-2">
              <button 
                  onClick={onToggleLanguage}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-ink-600 hover:text-gold-600 border border-ink-400 rounded px-2 py-1 transition-colors"
                  title="Switch Language"
              >
                  <Languages size={14} /> {language === 'en' ? 'EN' : '中文'}
              </button>
              <button 
                  onClick={onOpenSettings}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-ink-600 hover:text-gold-600 border border-ink-400 rounded px-2 py-1 transition-colors"
                  title="Settings"
              >
                  <SettingsIcon size={14} />
              </button>
            </div>
        </div>
        <p className="text-ink-600 text-sm italic mb-4">
            {language === 'en' ? "Navigating the World of Letters" : "在文字的世界中航行"}
        </p>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder={language === 'en' ? "Search a city..." : "搜索城市..."}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-parchment-50 border-2 border-ink-600 rounded-md py-2 pl-3 pr-10 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-gold-500 shadow-inner"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 text-ink-600 hover:text-gold-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-ink-600 rounded-full border-t-transparent"/> : <Search size={20} />}
          </button>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {selectedLocation ? (
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <button 
              onClick={onCloseLocation}
              className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-500 hover:text-ink-900 flex items-center gap-1"
            >
              ← {language === 'en' ? `Back to ${currentCity}` : `返回 ${currentCity}`}
            </button>
            
            <div className="border-4 double border-ink-900 p-1 mb-6 bg-white shadow-lg rotate-1">
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-200 w-full overflow-hidden relative">
                <img 
                    src={selectedLocation.coverUrl} 
                    alt={t(selectedLocation.bookTitle)}
                    className="w-full h-full object-cover sepia-[.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute bottom-2 left-2 text-white font-bold text-lg drop-shadow-md">
                    {t(selectedLocation.bookTitle)}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-ink-900 mb-1">{t(selectedLocation.name)}</h2>
            <h3 className="text-lg text-gold-600 italic mb-6">
                {language === 'en' ? 'by' : '作者:'} {t(selectedLocation.author)}
            </h3>

            <div className="mb-6 relative pl-6 border-l-4 border-gold-500">
              <p className="text-xl leading-relaxed text-ink-800 font-serif italic">
                "{t(selectedLocation.quote)}"
              </p>
            </div>

            <div className="bg-parchment-200 p-4 rounded border border-ink-600/30 mb-6">
              <h4 className="flex items-center gap-2 font-bold text-ink-900 mb-2 uppercase text-xs tracking-widest">
                <Feather size={14} /> {language === 'en' ? "Traveler's Note" : "旅行者笔记"}
              </h4>
              <p className="text-ink-700 leading-relaxed text-sm">
                {t(selectedLocation.travelerNote)}
              </p>
            </div>

            {/* Grounding Info (Maps) */}
            {(selectedLocation.googleMapsUri || (selectedLocation.reviews && selectedLocation.reviews.length > 0)) && (
               <div className="mt-4 pt-4 border-t border-ink-600/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-2 flex items-center gap-2">
                    <MapPin size={12}/> {language === 'en' ? "Verified Details" : "实地详情"}
                  </h4>
                  {selectedLocation.reviews && selectedLocation.reviews.map((review, i) => (
                      <p key={i} className="text-xs text-ink-600 italic mb-2">"{review.length > 80 ? review.substring(0,80)+'...' : review}"</p>
                  ))}
                  {selectedLocation.googleMapsUri && (
                      <a href={selectedLocation.googleMapsUri} target="_blank" rel="noreferrer" className="text-gold-600 hover:text-gold-700 text-sm font-bold flex items-center gap-1 mt-2">
                          {language === 'en' ? "View on Google Maps" : "在谷歌地图上查看"} <ExternalLink size={12} />
                      </a>
                  )}
               </div>
            )}

          </div>
        ) : (
            <div className="text-center mt-10 opacity-70">
                <BookOpen size={48} className="mx-auto text-ink-400 mb-4" />
                <h3 className="text-xl font-bold text-ink-800 mb-2">
                    {language === 'en' ? `Explore ${currentCity}` : `探索 ${currentCity}`}
                </h3>
                <p className="text-ink-600 max-w-xs mx-auto">
                    {language === 'en' 
                        ? "Select an Ink Pin on the map to reveal its literary secrets."
                        : "选择地图上的墨水标记，揭开它的文学秘密。"}
                </p>
            </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-parchment-300 border-t border-ink-600/20 grid grid-cols-1">
        <button 
            onClick={onExport}
            className="flex items-center justify-center gap-2 bg-ink-800 text-parchment-100 py-3 px-4 rounded shadow-lg hover:bg-ink-900 transition-transform active:scale-95 font-bold tracking-widest text-xs uppercase"
        >
            <MapIcon size={16} /> {language === 'en' ? "Capture Map" : "导出地图"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
