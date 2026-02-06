import React, { useState, useRef } from 'react';
import { X, Wand2, Upload, Download } from 'lucide-react';
import { editVintageImage } from '../services/geminiService';

interface DarkroomProps {
  isOpen: boolean;
  onClose: () => void;
}

const Darkroom: React.FC<DarkroomProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Add a sepia vintage filter and scratch marks.');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    try {
      const result = await editVintageImage(selectedImage, prompt);
      if (result) {
        setEditedImage(result);
      }
    } catch (e) {
      alert("Failed to develop photograph. The spirits are quiet.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-serif animate-in fade-in duration-300">
      <div className="bg-parchment-100 w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl overflow-hidden flex flex-col relative border-4 border-ink-900">
        
        {/* Header */}
        <div className="bg-ink-900 text-parchment-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-widest flex items-center gap-2">
                <Wand2 size={20} className="text-gold-500"/> The Darkroom
            </h2>
            <button onClick={onClose} className="hover:text-gold-500 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Controls */}
            <div className="w-full md:w-1/3 bg-parchment-200 p-6 border-r border-ink-600/20 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h3 className="text-sm font-bold uppercase text-ink-500 mb-2">1. Select Plate</h3>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange} 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-ink-400 rounded p-4 text-center hover:bg-parchment-100 transition-colors text-ink-700"
                    >
                        {selectedImage ? "Change Image" : "Upload Photo"}
                    </button>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase text-ink-500 mb-2">2. Incantation</h3>
                    <textarea 
                        className="w-full h-32 p-3 bg-white border border-ink-400 rounded focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-ink-800 text-sm font-sans"
                        placeholder="Describe how to age this photo..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <div className="mt-auto">
                    <button
                        onClick={handleProcess}
                        disabled={!selectedImage || isProcessing}
                        className={`w-full py-3 px-4 rounded font-bold uppercase tracking-widest shadow-md transition-all
                            ${!selectedImage || isProcessing 
                                ? 'bg-ink-400 cursor-not-allowed text-ink-200' 
                                : 'bg-gold-600 hover:bg-gold-700 text-white active:scale-95'}`}
                    >
                        {isProcessing ? 'Developing...' : 'Develop Photo'}
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="w-full md:w-2/3 bg-ink-800 p-8 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
                {!selectedImage ? (
                    <div className="text-center text-parchment-400 opacity-50">
                        <Upload size={48} className="mx-auto mb-4" />
                        <p>Upload an image to begin the alchemical process.</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                            src={editedImage || selectedImage} 
                            alt="Preview" 
                            className={`max-w-full max-h-full object-contain shadow-2xl border-8 border-parchment-100 rounded-sm ${isProcessing ? 'blur-sm animate-pulse' : ''}`}
                        />
                         {/* Labels */}
                         <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {editedImage ? 'Developed Result' : 'Original Negative'}
                         </div>
                         
                         {editedImage && (
                             <a 
                                href={editedImage} 
                                download="vintage-ink-atlas.png"
                                className="absolute bottom-4 right-4 bg-gold-600 text-white p-3 rounded-full shadow-lg hover:bg-gold-700 transition-transform hover:scale-110"
                                title="Download"
                             >
                                 <Download size={20} />
                             </a>
                         )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Darkroom;
