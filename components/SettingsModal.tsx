import React from 'react';
import { X, Save, Key, Settings as SettingsIcon } from 'lucide-react';
import { AISettings, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (newSettings: AISettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<AISettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const providers: { id: AIProvider; name: string }[] = [
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'openai', name: 'OpenAI (GPT-4)' },
    { id: 'deepseek', name: 'DeepSeek' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className="bg-parchment-100 w-full max-w-md rounded-lg shadow-2xl border-4 border-ink-900 overflow-hidden transform scale-100">
        
        {/* Header */}
        <div className="bg-ink-900 text-parchment-100 p-4 flex justify-between items-center border-b-2 border-gold-600">
            <h2 className="text-xl font-bold tracking-widest flex items-center gap-2 uppercase">
                <SettingsIcon size={20} className="text-gold-500"/> Surveyor's Tools
            </h2>
            <button onClick={onClose} className="hover:text-gold-500 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
            <p className="text-sm text-ink-600 mb-6 italic">
                Choose your intelligence source. The accuracy of the map depends on the quality of the spyglass.
            </p>

            <div className="space-y-4">
                {/* Provider Select */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-ink-800 mb-2">
                        Intelligence Provider
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {providers.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setLocalSettings(prev => ({ ...prev, provider: p.id }))}
                                className={`py-2 px-1 text-xs font-bold rounded border-2 transition-all
                                    ${localSettings.provider === p.id 
                                        ? 'bg-ink-800 text-gold-500 border-ink-800 shadow-md scale-105' 
                                        : 'bg-parchment-50 text-ink-600 border-ink-300 hover:border-ink-500'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Key Inputs */}
                <div className="mt-4 pt-4 border-t border-ink-600/20">
                     <label className="block text-xs font-bold uppercase tracking-widest text-ink-800 mb-2 flex items-center gap-2">
                        <Key size={14} /> API Configuration
                    </label>
                    
                    {localSettings.provider === 'gemini' && (
                        <div>
                             <label className="text-xs text-ink-500 mb-1 block">Google Gemini API Key</label>
                             <input 
                                type="password" 
                                value={localSettings.geminiKey}
                                onChange={(e) => setLocalSettings(prev => ({ ...prev, geminiKey: e.target.value }))}
                                placeholder="AIzaSy..."
                                className="w-full bg-white border border-ink-400 rounded p-2 text-ink-900 focus:border-gold-500 focus:outline-none font-sans text-sm"
                            />
                        </div>
                    )}
                    
                    {localSettings.provider === 'openai' && (
                        <div>
                             <label className="text-xs text-ink-500 mb-1 block">OpenAI API Key</label>
                             <input 
                                type="password" 
                                value={localSettings.openaiKey}
                                onChange={(e) => setLocalSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
                                placeholder="sk-..."
                                className="w-full bg-white border border-ink-400 rounded p-2 text-ink-900 focus:border-gold-500 focus:outline-none font-sans text-sm"
                            />
                        </div>
                    )}

                    {localSettings.provider === 'deepseek' && (
                        <div>
                             <label className="text-xs text-ink-500 mb-1 block">DeepSeek API Key</label>
                             <input 
                                type="password" 
                                value={localSettings.deepseekKey}
                                onChange={(e) => setLocalSettings(prev => ({ ...prev, deepseekKey: e.target.value }))}
                                placeholder="ds-..."
                                className="w-full bg-white border border-ink-400 rounded p-2 text-ink-900 focus:border-gold-500 focus:outline-none font-sans text-sm"
                            />
                        </div>
                    )}
                    
                    <p className="text-[10px] text-ink-400 mt-2">
                        * Keys are stored locally in your browser's parchment (Local Storage).
                    </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-parchment-200 border-t border-ink-600/20 flex justify-end">
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-gold-600 text-white py-2 px-6 rounded shadow hover:bg-gold-700 transition-colors font-bold uppercase tracking-widest text-xs"
            >
                <Save size={16} /> Save Configuration
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
