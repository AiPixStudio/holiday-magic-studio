import React from 'react';
import { BookOpen, Zap, Users, MonitorPlay, Settings, MessageSquare, Code } from 'lucide-react';
import Header from './Header';

// Card component for features/tips
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="text-[#E3CE8A] mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-[#565A7C] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

// Main Learning Component
const Learning: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 font-['Inter']">
            <Header />
            
            <div className="p-4 md:p-8 space-y-10">
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-[#565A7C] mb-3 font-['Montserrat']">
                        Master the AI Studio
                    </h1>
                    <p className="text-lg text-gray-500">Tips, resources, and tutorials to help you generate breathtaking AI portraits.</p>
                </header>

                {/* Section 1: Quick Tips and Best Practices */}
                <section>
                    <h2 className="text-2xl font-bold text-[#565A7C] mb-6 border-b pb-2 border-gray-200 flex items-center">
                        <BookOpen className='w-6 h-6 mr-3 text-[#E3CE8A]'/> Prompt Engineering 101
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<MessageSquare className='w-6 h-6' />}
                            title="Be Specific"
                            description="Use detailed adjectives and technical terms (e.g., 'Volumetric lighting', '8K resolution') to guide the AI."
                        />
                        <FeatureCard
                            icon={<Settings className='w-6 h-6' />}
                            title="Control Your Options"
                            description="Utilize the Advanced Settings (Style, Pose, Lighting) in the Studio tab for consistent, predictable results."
                        />
                        <FeatureCard
                            icon={<Code className='w-6 h-6' />}
                            title="Style Tagging"
                            description="Add popular artist or style names (e.g., 'in the style of Van Gogh', 'Cyberpunk') to influence the aesthetic."
                        />
                    </div>
                </section>

                {/* Section 2: Creative Community & Sharing */}
                <section>
                    <h2 className="text-2xl font-bold text-[#565A7C] mb-6 border-b pb-2 border-gray-200 flex items-center">
                        <Users className='w-6 h-6 mr-3 text-[#E3CE8A]'/> Community & Inspiration
                    </h2>
                    <div className="bg-[#FAF5EC] p-6 rounded-2xl border border-[#E8E1D6] shadow-inner flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-3/4">
                            <h3 className="text-2xl font-script text-[#737373] mb-2">Explore the Gallery</h3>
                            <p className="text-gray-700">See what other creators are generating, learn from their prompts, and find inspiration for your next portrait.</p>
                        </div>
                        <button className="mt-4 md:mt-0 bg-[#565A7C] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition hover:bg-[#434766] uppercase text-sm tracking-wider">
                            View Public Gallery
                        </button>
                    </div>
                </section>

                {/* Section 3: Videos */}
                <section className="bg-white p-6 rounded-[24px] border border-[#E8E1D6] shadow-[0_4px_20px_rgba(0,0,0,0.06)] opacity-95">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#565A7C] flex items-center">
                            <MonitorPlay className='w-6 h-6 mr-2 text-[#E3CE8A]'/> Video Tutorials
                        </h2>
                        <span className="text-[11px] bg-[#E3CE8A] text-[#565A7C] px-2 py-1 rounded-full uppercase font-semibold">Coming Soon</span>
                    </div>
                    <div className="aspect-video bg-[#FAF5EC] rounded-xl border border-[#E8E1D6] flex items-center justify-center">
                        <p className="text-[#565A7C]/40 text-lg font-semibold">Video Player Placeholder</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Learning;