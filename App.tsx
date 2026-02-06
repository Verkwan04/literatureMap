import React, { useState, useEffect, useCallback } from 'react';
import LiteraryMap from './components/LiteraryMap';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import { BookLocation, Language, AISettings } from './types';
import { INITIAL_CITIES } from './constants';
import { findLiteraryLocations } from './services/aiService';
import html2canvas from 'html2canvas';

const DEFAULT_SETTINGS: AISettings = {
  provider: 'gemini',
  geminiKey: process.env.API_KEY || '',
  openaiKey: '',
  deepseekKey: ''
};

const App: React.FC = () => {
  const [currentCityName, setCurrentCityName] = useState<string>('Florence');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 43.7696, lng: 11.2558 });
  const [locations, setLocations] = useState<BookLocation[]>(INITIAL_CITIES['florence'].locations);
  const [selectedLocation, setSelectedLocation] = useState<BookLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings with persistence
  const [settings, setSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('ink_atlas_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const handleSaveSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    localStorage.setItem('ink_atlas_settings', JSON.stringify(newSettings));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setSelectedLocation(null);

    // 1. Check Mock Data first (Optional - we could force AI if the user wants "fresh" data, 
    // but preserving mock data for specific demo cities is usually good UX).
    // Let's modify this to prioritize AI if settings are configured, or fallback to mock.
    // For now, consistent with previous behavior: check mock first.
    const cityKey = city.toLowerCase();
    if (INITIAL_CITIES[cityKey]) {
       // However, the user specifically asked for "real-time search" and ">10 books". 
       // The mock data only has ~2 books. 
       // Strategy: If AI key is present, try AI first to get more data. If it fails, fallback to mock.
       // Actually, the user asked to "ensure search out data", so let's prefer AI if available.
       
       if (!hasValidKey(settings)) {
          // Use Mock if no key
          const data = INITIAL_CITIES[cityKey];
          setCurrentCityName(data.name[language]);
          setMapCenter({ lat: data.lat, lng: data.lng });
          setLocations(data.locations);
          setIsLoading(false);
          return;
       }
       // If key exists, fall through to AI search
    }

    // 2. AI Search
    try {
      if (!hasValidKey(settings)) {
          throw new Error("Please configure an API Key in settings.");
      }

      const foundLocations = await findLiteraryLocations(city, settings);
      
      if (foundLocations.length > 0) {
        setCurrentCityName(city);
        // Center map on the first result
        setMapCenter({ lat: foundLocations[0].lat, lng: foundLocations[0].lng });
        setLocations(foundLocations);
      } else {
        alert(language === 'en' 
            ? `Could not find literary secrets in "${city}".` 
            : `在 "${city}" 未找到文学秘密。`);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.message || (language === 'en' ? "The ink has run dry." : "墨水已干，请重试。");
      
      // Fallback to mock if AI fails and mock exists
      if (INITIAL_CITIES[cityKey]) {
          const data = INITIAL_CITIES[cityKey];
          setCurrentCityName(data.name[language]);
          setMapCenter({ lat: data.lat, lng: data.lng });
          setLocations(data.locations);
          alert(`AI Search failed: ${msg}\nLoaded offline archives instead.`);
      } else {
          alert(`Error: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasValidKey = (s: AISettings) => {
      if (s.provider === 'gemini') return !!s.geminiKey;
      if (s.provider === 'openai') return !!s.openaiKey;
      if (s.provider === 'deepseek') return !!s.deepseekKey;
      return false;
  };

  const handleLocationSelect = (loc: BookLocation) => {
    setSelectedLocation(loc);
    // Note: We removed the secondary "verifyLocationDetails" call to simplify logic 
    // and because non-Gemini providers don't support the specific grounding tool easily in the same way.
    // The main search prompt now requests robust data upfront.
  };

  const handleExport = useCallback(() => {
    const element = document.getElementById('map-export-frame');
    if (element) {
        html2canvas(element, { 
            useCORS: true, 
            allowTaint: true,
            scale: 2, 
            backgroundColor: '#f7f1e3'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `ink-and-atlas-${currentCityName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
  }, [currentCityName]);

  return (
    <div className="w-screen h-screen flex relative overflow-hidden bg-parchment-100">
      
      {/* Sidebar */}
      <Sidebar 
        currentCity={currentCityName}
        onSearch={handleSearch}
        selectedLocation={selectedLocation}
        onCloseLocation={() => setSelectedLocation(null)}
        isLoading={isLoading}
        onExport={handleExport}
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Map Area */}
      <main className="flex-1 relative h-full md:ml-96 transition-all duration-300">
         
         {/* EXPORT FRAME WRAPPER */}
         <div id="map-export-frame" className="relative w-full h-full">
             
             {/* Map Content */}
             <LiteraryMap 
                center={mapCenter}
                zoom={13}
                locations={locations}
                onLocationSelect={handleLocationSelect}
                language={language}
             />

             {/* DECORATIVE OVERLAY FRAME */}
             <div className="absolute inset-0 pointer-events-none z-[400] border-[24px] border-double border-ink-800/80 m-2 box-border"></div>
             
             {/* Corner Accents */}
             <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-gold-600 z-[401] pointer-events-none"></div>
             <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-gold-600 z-[401] pointer-events-none"></div>
             <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-gold-600 z-[401] pointer-events-none"></div>
             <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-gold-600 z-[401] pointer-events-none"></div>

             {/* Watermark */}
             <div className="absolute bottom-8 right-8 pointer-events-none z-[500] flex flex-col items-end">
                <div className="text-ink-900 font-serif font-bold text-3xl tracking-widest uppercase drop-shadow-md">Ink & Atlas</div>
                <div className="text-gold-600 font-serif italic text-sm">
                   {settings.provider === 'openai' ? 'Whispered by OpenAI' : 
                    settings.provider === 'deepseek' ? 'Charted by DeepSeek' : 
                    'Illuminated by Gemini'}
                </div>
             </div>
         </div>

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

    </div>
  );
};

export default App;