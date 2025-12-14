import React, { useState, useRef, useEffect } from 'react';
import { analyzeImage, editImage } from '../geminiService';
import Button from './Button';
import Spinner from './Spinner';
import { Sparkles, FileText, ClipboardCheck, Clipboard, ArrowRightCircle, X, UserPlus, UploadCloud, Pencil, Trash2 } from 'lucide-react';
import SelectControl from './SelectControl';
import { ReferenceImage } from '../types';

const PERSON_OPTIONS = ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6'];

interface EditorProps {
  onPromptTransfer: (prompt: string, references?: ReferenceImage[]) => void;
  initialImage?: string | null;
  onImageConsumed?: () => void;
  onAuthError?: () => void;
}

const Editor: React.FC<EditorProps> = ({ onPromptTransfer, initialImage, onImageConsumed, onAuthError }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  
  const [promptText, setPromptText] = useState<string>('');
  
  const [selectedPerson, setSelectedPerson] = useState<string>('Person 1');
  const [personMapping, setPersonMapping] = useState<Record<string, ReferenceImage[]>>({}); 
  
  const [loading, setLoading] = useState<{ analysis: boolean; edit: boolean }>({ analysis: false, edit: false });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImage && originalImage === null) {
        setOriginalImage(initialImage);
        if (onImageConsumed) onImageConsumed();
    }
  }, [initialImage, originalImage, onImageConsumed]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
        setError(null);
        handleAnalyze(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (imageDataUrl: string, mimeType: string) => {
    setLoading(prev => ({ ...prev, analysis: true }));
    setError(null);
    try {
      const analysisResult = await analyzeImage(imageDataUrl, mimeType);
      setPromptText(analysisResult);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed.';
      setError(errorMessage);
       if (
        errorMessage.includes('Requested entity was not found') || 
        errorMessage.includes('404') || 
        errorMessage.includes('API key')
      ) {
        onAuthError?.();
      }
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !originalImageFile || !promptText) return;

    setLoading(prev => ({ ...prev, edit: true }));
    setError(null);
    setEditedImage(null);

    const mimeType = originalImageFile.type;
    // Fix: Use reduce instead of flat() to ensure type safety with explicit types
    const allReferences = Object.values(personMapping).reduce<ReferenceImage[]>((acc, val: ReferenceImage[]) => acc.concat(val), []);

    try {
        const imageUrl = await editImage(originalImage, mimeType, promptText, allReferences);
        setEditedImage(imageUrl);
    } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'Editing failed.';
        setError(errorMessage);
        if (
          errorMessage.includes('Requested entity was not found') || 
          errorMessage.includes('404') || 
          errorMessage.includes('API key')
        ) {
          onAuthError?.();
        }
    } finally {
        setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const copyPromptToClipboard = () => {
    if (promptText) {
      navigator.clipboard.writeText(promptText);
    }
  };

  const handleAddReference = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newRef: ReferenceImage = {
            base64: result,
            mimeType: file.type
        };

        setPersonMapping(prev => {
            const currentRefs = prev[selectedPerson] || [];
            if (currentRefs.length < 3) {
                return {
                    ...prev,
                    [selectedPerson]: [...currentRefs, newRef]
                };
            }
            return prev;
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = (person: string, indexToRemove: number) => {
    setPersonMapping(prev => ({
        ...prev,
        [person]: (prev[person] || []).filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const addToPhotoStudio = () => {
    // Fix: Use reduce instead of flat() to ensure type safety with explicit types
    const allReferences = Object.values(personMapping).reduce<ReferenceImage[]>((acc, val: ReferenceImage[]) => acc.concat(val), []);
    onPromptTransfer(promptText, allReferences);
    setOriginalImage(null);
    setEditedImage(null);
    setOriginalImageFile(null);
  };


  const currentReferences = personMapping[selectedPerson] || [];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Image Upload & Display */}
      <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-6">
        
        {/* Output Image */}
        <div className="w-full md:w-1/2 aspect-[4/5] bg-[#FAF5EC] rounded-xl flex items-center justify-center relative border border-[#E8E1D6] shadow-inner">
            {loading.edit ? (
                <Spinner className='absolute inset-0' />
            ) : editedImage ? (
                <img src={editedImage} alt="Edited" className="w-full h-full object-contain rounded-xl" />
            ) : originalImage ? (
                <img src={originalImage} alt="Original" className="w-full h-full object-contain rounded-xl opacity-50" />
            ) : (
                <div className="text-center text-[#565A7C]/30 p-4">
                    <UploadCloud className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-[15px] font-medium">Upload an image to start editing.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-input"
                    />
                    <label htmlFor="image-upload-input" className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E3CE8A] hover:bg-[#CBB575] cursor-pointer">
                        Choose File
                    </label>
                </div>
            )}
            
            {/* Action Buttons */}
            {originalImage && (
                <div className="absolute top-3 right-3 flex gap-2">
                    <Button 
                        onClick={() => setOriginalImage(null)} 
                        variant="secondary" 
                        className="!p-2 !min-w-0 !text-[#565A7C] !border-[#E8E1D6] bg-white/70 backdrop-blur-sm"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>

        {/* Prompt Input & Analysis */}
        <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-[21px] uppercase font-bold text-[#565A7C] tracking-wider font-['Montserrat']">
                Edit Prompt
            </h3>
            
            <Button 
                onClick={() => originalImage && originalImageFile && handleAnalyze(originalImage, originalImageFile.type)} 
                disabled={!originalImage || loading.analysis} 
                className="w-full bg-[#FAF5EC] !text-[#565A7C] !border !border-[#E8E1D6] hover:bg-[#F0EBE0] shadow-none"
            >
                <Pencil className="w-5 h-5 mr-2" />
                {loading.analysis ? 'Analyzing...' : 'Generate AI Prompt'}
            </Button>

            <div className="relative">
                <textarea
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                    placeholder="Enter your detailed edit instructions here. Example: 'Change the background to a cozy, snow-covered forest path and add a golden retriever sitting next to the subject.'"
                    rows={8}
                    className="w-full p-3 bg-[#FAF5EC] border border-[#E8E1D6] rounded-xl text-[#565A7C] text-[15px] focus:ring-1 focus:ring-[#E3CE8A] outline-none placeholder-[#565A7C]/40 font-['Montserrat']"
                />
                <button 
                    onClick={copyPromptToClipboard} 
                    className="absolute bottom-3 right-3 text-[#E3CE8A] hover:text-[#CBB575] transition-colors"
                    title="Copy Prompt"
                >
                    <Clipboard className="w-5 h-5" />
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>

      {/* 2. Identity Replication Controls (Reference Images) */}
      <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <h3 className="text-[21px] uppercase font-bold text-[#565A7C] mb-4 tracking-wider font-['Montserrat']">
            Identity Replication Protocol
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className='w-full sm:w-1/3'>
                <SelectControl 
                    label="Subject to Map"
                    value={selectedPerson}
                    options={PERSON_OPTIONS}
                    onChange={setSelectedPerson}
                />
            </div>
            <p className="text-[13px] text-[#565A7C] font-medium font-['Montserrat'] sm:pl-4 mt-2 sm:mt-0">
                Map 1-3 reference photos for **{selectedPerson}** to maintain likeness in the edited image.
            </p>
        </div>

        {/* Reference Photo Grid */}
        <input
            type="file"
            accept="image/*"
            onChange={handleAddReference}
            className="hidden"
            ref={fileInputRef}
        />
        
        <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => {
                const file = currentReferences[index];
                return (
                    <div key={index} className="aspect-square">
                        {file ? (
                            <div className="relative w-full h-full group">
                                <img 
                                  src={file.base64} 
                                  alt={`Ref ${index}`} 
                                  className="w-full h-full rounded-xl object-cover border border-[#E8E1D6]"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => removeReferenceImage(selectedPerson, index)}
                                      className="text-white bg-[#E3CE8A] p-1 rounded-full"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={currentReferences.length >= 3}
                                className="w-full h-full border border-dashed border-[#E3CE8A]/50 rounded-xl flex flex-col items-center justify-center bg-[#FAF5EC] hover:bg-[#F0EBE0] transition-colors disabled:opacity-50"
                            >
                                <UserPlus className="w-5 h-5 text-[#E3CE8A] mb-1" />
                                <span className="text-[11px] text-[#E3CE8A] font-semibold">+ Map Ref</span>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
      </div>


      {/* 3. Actions */}
      <div className="flex flex-col md:flex-row gap-4">
          <Button 
              onClick={handleEdit} 
              disabled={!originalImage || loading.edit} 
              className="w-full md:w-1/2 py-4 shadow-xl font-bold"
          >
              <Sparkles className="w-6 h-6 mr-2 text-[#565A7C]" />
              {loading.edit ? 'Applying Magic...' : 'Apply Edit'}
          </Button>
          
          <Button 
              onClick={addToPhotoStudio} 
              disabled={!promptText} 
              variant="secondary" 
              className="w-full md:w-1/2 py-4 shadow-xl font-bold"
          >
              <ArrowRightCircle className="w-6 h-6 mr-2 text-[#E3CE8A]" />
              Go to Studio Generator
          </Button>
      </div>

    </div>
  );
};

export default Editor;