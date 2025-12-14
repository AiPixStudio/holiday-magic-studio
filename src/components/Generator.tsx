
import React, { useState, useRef, useEffect } from 'react';
import { GenerationOptions, ArtStyle, Vibe, ReferenceImage, HolidayTheme } from '../types';
import { HOLIDAY_THEMES, THEME_TO_STYLES, ASPECT_RATIOS, ART_STYLES, VIBES, POSE_PREFERENCES, BACKGROUND_INTENSITIES, LIGHTING_TONES } from '../constants';
import { generateImage } from '../geminiService';
import Button from './Button';
import Spinner from './Spinner';
import { Sparkles, X, Plus, Download, ChevronDown, UploadCloud, Camera, ToggleLeft, ToggleRight, Users } from 'lucide-react';

interface GeneratorProps {
  initialCustomPrompt?: string;
  initialReferenceImages?: ReferenceImage[];
  onPromptConsumed?: () => void;
  onImageTransfer?: (imageUrl: string) => void;
  onAuthError?: () => void;
}

// STYLING: Uniform "Luxury Card" for all sections
const SectionBox: React.FC<{children: React.ReactNode, className?: string, title?: string, icon?: React.ReactNode}> = ({children, className, title, icon}) => (
  <div className={`bg-white rounded-[24px] shadow-[0_10px_30px_-10px_rgba(227,206,138,0.25)] p-5 border border-white/60 relative overflow-hidden ${className}`}>
      {/* Decorative top shimmer (subtle) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#E3CE8A]/30 to-transparent"></div>
      
      {title && (
        <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-[#E8E1D6]/50">
            <div className="p-1.5 bg-[#FAF5EC] rounded-lg text-[#E3CE8A]">
                {icon}
            </div>
            <h2 className="text-base font-bold text-[#565A7C] font-['Montserrat'] tracking-tight">{title}</h2>
        </div>
      )}
      {children}
  </div>
);

const Dropdown: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: (string | {label: string, value: string})[];
    disabled?: boolean;
}> = ({ label, value, onChange, options, disabled }) => (
    <div>
      <label className="block text-[9px] uppercase font-bold text-[#565A7C]/70 mb-1 tracking-widest font-['Montserrat'] truncate">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-lg px-2.5 py-2 text-[#565A7C] text-[12px] focus:ring-1 focus:ring-[#E3CE8A] focus:border-[#E3CE8A] outline-none appearance-none font-medium truncate font-['Montserrat'] transition-all hover:border-[#E3CE8A]/50"
        >
           {options.map((opt) => {
               const isObj = typeof opt === 'object';
               const val = isObj ? (opt as {value: string}).value : opt as string;
               const lab = isObj ? (opt as {label: string}).label : opt as string;
               return <option key={val} value={val}>{lab}</option>
           })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-3 h-3 text-[#E3CE8A]" />
        </div>
      </div>
    </div>
);

const Generator: React.FC<GeneratorProps> = ({ initialCustomPrompt, initialReferenceImages, onPromptConsumed, onImageTransfer, onAuthError }) => {
  // Set default Theme to "All Holiday Styles"
  // Set ALL attributes to "N/A" for maximum neutrality
  const [options, setOptions] = useState<GenerationOptions>({
    theme: 'All Holiday Styles',
    style: '',
    artStyle: 'N/A',
    vibe: 'N/A',
    aspectRatio: 'N/A',
    pose: 'N/A',
    backgroundIntensity: 'N/A',
    lightingTone: 'N/A',
    colorPalette: 'N/A',
    creativeNotes: '',
    peopleCount: 'Let AI Decide', 
    petCount: 'N/A',
    personalEcho: true,
    strictLikeness: false,
    whoInPhoto: 'N/A',
    bodyType: 'N/A',
    heightCategory: 'N/A',
    bustAppearance: 'N/A',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [referenceFiles, setReferenceFiles] = useState<ReferenceImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCustomPrompt) {
        setOptions(prev => ({ ...prev, creativeNotes: initialCustomPrompt }));
        if (onPromptConsumed) onPromptConsumed();
    }
    if (initialReferenceImages) {
        setReferenceFiles(initialReferenceImages);
        if (onPromptConsumed) onPromptConsumed();
    }
  }, [initialCustomPrompt, initialReferenceImages, onPromptConsumed]);

  // Auto-update People Count based on uploaded images if user hasn't set it manually
  useEffect(() => {
     if (referenceFiles.length > 0) {
         const count = referenceFiles.length;
         if (count <= 6) {
             setOptions(prev => {
                 // Only update if currently 'Let AI Decide' to avoid overwriting user choice
                 if (prev.peopleCount === 'Let AI Decide') {
                     return { ...prev, peopleCount: String(count) };
                 }
                 return prev;
             });
         }
     }
  }, [referenceFiles.length]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
        const imageUrl = await generateImage(options, referenceFiles);
        setGeneratedImage(imageUrl);
        // Auto scroll to result
        setTimeout(() => {
            const resultElement = document.getElementById('result-section');
            if (resultElement) resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'Generation failed';
        setError(errorMessage);
        if (errorMessage.includes('Requested entity was not found') || errorMessage.includes('404') || errorMessage.includes('API key')) {
          onAuthError?.();
        }
    } finally {
        setLoading(false);
    }
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[];
    if (files.length > 0) {
      
      const remainingSlots = 24 - referenceFiles.length;
      const filesToProcess = files.slice(0, remainingSlots);

      if (filesToProcess.length === 0) return;

      let processedCount = 0;
      filesToProcess.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
              setReferenceFiles(prev => [...prev, {
                  base64: reader.result as string,
                  mimeType: file.type
              }]);
              processedCount++;
              // Clear input when batch is done
              if (processedCount === filesToProcess.length && fileInputRef.current) {
                  fileInputRef.current.value = '';
              }
          };
          reader.readAsDataURL(file);
      });
    }
  };

  const removeReference = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadImage = () => {
    if (generatedImage) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `holiday-magic-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 pb-20">
        
        {/* 1. Identity Replication (Dynamic Left-Aligned Grid) */}
        <SectionBox 
             title="Identity Replication (Virtual Face Swap)" 
             icon={<UploadCloud className="w-4 h-4 text-[#E3CE8A]" />}
        >
             <div className="flex flex-col gap-3">
                 {/* Full width text description */}
                 <p className="text-[11px] text-[#565A7C]/80 font-['Montserrat'] leading-relaxed w-full min-w-0">
                    Upload photos for each person. The AI will map <strong>Subject 1 to the Leftmost figure</strong>, Subject 2 to the next, and so on.
                 </p>
                 
                 {/* Strict Likeness Toggle */}
                 <div className="flex justify-start pt-1">
                    <button 
                        onClick={() => setOptions({...options, strictLikeness: !options.strictLikeness})}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all ${options.strictLikeness ? 'bg-[#565A7C] border-[#565A7C] text-white' : 'bg-[#FAF5EC] border-[#E8E1D6] text-[#565A7C]/60'}`}
                     >
                        {options.strictLikeness ? <ToggleRight className="w-4 h-4"/> : <ToggleLeft className="w-4 h-4"/>}
                        <span className="text-[9px] font-bold uppercase tracking-wider">Strict Likeness (Force Photorealism)</span>
                     </button>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 justify-start mt-2">
                     {referenceFiles.map((ref, idx) => (
                         <div key={idx} className="relative w-16 h-16 group shadow-sm rounded-lg flex-shrink-0 animate-fadeIn">
                             <img src={ref.base64} alt="Ref" className="w-full h-full object-cover rounded-lg border border-[#E8E1D6]" />
                             {/* NUMBER BADGE */}
                             <div className="absolute -bottom-1 -left-1 bg-[#E3CE8A] text-[#565A7C] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-white">
                                {idx + 1}
                             </div>
                             
                             <button onClick={() => removeReference(idx)} className="absolute -top-1.5 -right-1.5 bg-white text-red-500 p-0.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 border border-gray-100">
                                 <X className="w-3 h-3" />
                             </button>
                         </div>
                     ))}
                     
                     {referenceFiles.length < 24 && (
                         <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="w-16 h-16 flex flex-col items-center justify-center border border-dashed border-[#E3CE8A]/50 rounded-lg bg-[#FAF5EC] hover:bg-[#F0EBE0] transition-colors group flex-shrink-0"
                         >
                             <Plus className="w-5 h-5 text-[#E3CE8A] group-hover:scale-110 transition-transform" />
                         </button>
                     )}
                     <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleReferenceUpload} />
                 </div>
                 
                 {referenceFiles.length > 0 && (
                     <p className="text-[9px] text-[#E3CE8A] font-bold uppercase tracking-wider text-right">
                         Order Matters: 1 (Left) → {referenceFiles.length} (Right)
                     </p>
                 )}
             </div>
        </SectionBox>

        {/* 2. Theme & Content (Stacked tight) */}
        <SectionBox 
            title="Theme & Content" 
            icon={<Users className="w-4 h-4 text-[#E3CE8A]" />}
        >
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <Dropdown 
                        label="Holiday Theme" 
                        value={options.theme} 
                        onChange={(val) => setOptions({...options, theme: val as HolidayTheme, style: ''})} 
                        options={HOLIDAY_THEMES} 
                    />
                    <Dropdown 
                        label="Style Variant" 
                        value={options.style} 
                        onChange={(val) => setOptions({...options, style: val})}
                        options={options.theme !== 'none' ? THEME_TO_STYLES[options.theme] : []}
                        disabled={options.theme === 'none'}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Dropdown label="People Count" value={options.peopleCount} onChange={v => setOptions({...options, peopleCount: v})} options={['Let AI Decide', '1', '2', '3', '4', '5', '6+']} />
                    <Dropdown label="Pets" value={options.petCount} onChange={v => setOptions({...options, petCount: v})} options={['N/A', 'Let AI Decide', '0', '1', '2']} />
                </div>
                
                <div>
                     <textarea
                        value={options.creativeNotes}
                        onChange={e => setOptions({...options, creativeNotes: e.target.value})}
                        placeholder="Custom Notes: e.g., 'Mom holding the baby', 'Dad laughing'..."
                        className="w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-lg px-3 py-2 text-[#565A7C] text-[12px] focus:ring-1 focus:ring-[#E3CE8A] outline-none min-h-[45px] resize-none font-['Montserrat'] placeholder-[#565A7C]/40"
                     />
                </div>
            </div>
        </SectionBox>

        {/* 3. Composition (Dense 3-col grid) */}
        <SectionBox 
            title="Scene & Mood" 
            icon={<Camera className="w-4 h-4 text-[#E3CE8A]" />}
        >
             <div className="grid grid-cols-3 gap-2.5">
                <Dropdown label="Art Style" value={options.artStyle} onChange={v => setOptions({...options, artStyle: v as ArtStyle})} options={ART_STYLES} />
                <Dropdown label="Vibe" value={options.vibe} onChange={v => setOptions({...options, vibe: v as Vibe})} options={VIBES} />
                <Dropdown label="Ratio" value={options.aspectRatio} onChange={v => setOptions({...options, aspectRatio: v as any})} options={ASPECT_RATIOS} />
                
                <Dropdown label="Lighting" value={options.lightingTone} onChange={v => setOptions({...options, lightingTone: v as any})} options={LIGHTING_TONES} />
                <Dropdown label="Pose" value={options.pose} onChange={v => setOptions({...options, pose: v as any})} options={POSE_PREFERENCES} />
                <Dropdown label="Backdrop" value={options.backgroundIntensity} onChange={v => setOptions({...options, backgroundIntensity: v as any})} options={BACKGROUND_INTENSITIES} />
            </div>
        </SectionBox>

        {/* 4. Output Area (Matching Style) */}
        <SectionBox id="result-section" className="min-h-[300px] flex flex-col justify-between" title="Your Portrait" icon={<Sparkles className="w-4 h-4 text-[#E3CE8A]" />}>
            
            {/* Added Instruction Text */}
            <div className="mb-3">
                 <p className="text-[11px] text-[#565A7C]/80 font-['Montserrat'] leading-relaxed border-l-2 border-[#E3CE8A] pl-3">
                    Image generation takes about 10 seconds. For groups, ensure you upload clear individual photos of each person. If the result isn't perfect, try adjusting the 'People Count' explicitly or toggling 'Strict Likeness'.
                 </p>
            </div>

            {/* GENERATE BUTTON MOVED TO TOP */}
            <div className="mb-4 pb-3 border-b border-[#E8E1D6]/50">
                <Button 
                    onClick={handleGenerate} 
                    disabled={loading || (options.theme === 'none' && !options.creativeNotes)} 
                    className="w-full py-3.5 text-[15px] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                >
                    {loading ? 'Creating Magic...' : 'Generate Portrait'}
                </Button>
                {error && <p className="text-center text-red-500 text-[11px] mt-2 font-medium bg-red-50 py-1.5 rounded-lg">{error}</p>}
            </div>

            {generatedImage ? (
                <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-[3/4] md:h-[450px] flex items-center justify-center overflow-hidden rounded-xl bg-[#FAF5EC]/30">
                         <img src={generatedImage} alt="Generated Holiday Magic" className="w-full h-full object-contain shadow-sm" />
                    </div>
                     
                    {/* SAVE BUTTON BELOW IMAGE */}
                    <div className="flex justify-center">
                         <Button 
                            onClick={downloadImage} 
                            className="!px-6 !py-3 !text-[14px] bg-white text-[#565A7C] font-bold border-2 border-[#333333] shadow-[4px_4px_0px_0px_rgba(51,51,51,0.2)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,0.2)] hover:bg-white rounded-xl transition-all"
                         >
                             <Download className="w-4 h-4 mr-2" /> SAVE IMAGE
                         </Button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-[#565A7C]/30 gap-4 py-8 border border-dashed border-[#E8E1D6] rounded-xl bg-[#FAF5EC]/30 min-h-[300px]">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="p-4 bg-white rounded-full shadow-[0_10px_20px_-5px_rgba(227,206,138,0.4)]">
                                <Sparkles className="w-6 h-6 text-[#E3CE8A]" />
                            </div>
                            <div className="text-center">
                                <p className="font-['Montserrat'] font-bold text-sm text-[#565A7C]/60">Ready to Create</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </SectionBox>

    </div>
  );
};

export default Generator;
