import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full mb-4">
            <div className="relative bg-white rounded-[24px] shadow-[0_10px_20px_-5px_rgba(227,206,138,0.2)] px-6 py-5 text-center max-w-2xl w-full border border-white/60">
                
                {/* Decorative top shimmer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-[#E3CE8A] to-transparent opacity-50"></div>

                {/* Title Section */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    <h1 className="text-[32px] md:text-[42px] leading-none font-script text-[#E3CE8A] drop-shadow-sm transform -rotate-2">
                        Holiday Magic Studio
                    </h1>
                    <span className="bg-[#565A7C] text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-sans transform -translate-y-1">
                        PRO
                    </span>
                </div>

                {/* Restored Descriptive Text */}
                <p className="text-[11px] md:text-[12px] text-[#565A7C]/80 font-['Montserrat'] leading-relaxed max-w-lg mx-auto mb-3">
                    This tool transforms ordinary photos into magical scenes filled with warmth, coziness, and wonder to capture the spirit of the season in a way that feels personal, heartfelt, and unforgettable.
                </p>

                {/* Subtitle / Powered By */}
                <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-6 bg-[#E3CE8A]/30"></span>
                    <p className="text-[#565A7C]/40 font-['Montserrat'] text-[10px] tracking-wide uppercase font-medium">
                        Powered by <span className="font-bold text-[#D4BE78]">Gemini 3 Pro</span>
                    </p>
                    <span className="h-px w-6 bg-[#E3CE8A]/30"></span>
                </div>
            </div>
        </div>
    );
};

export default Header;