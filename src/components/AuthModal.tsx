import React from "react";
import logo from "../assets/airplane-flight.png";
import Login from "../assets/airport.gif";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoogleLogin: () => void;
    isSigningIn?: boolean;
    error?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    onGoogleLogin,
    isSigningIn = false,
    error
}) => {
    if (!isOpen) return null;

    return (
        <>
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalZoomIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-backdrop {
                    animation: modalFadeIn 0.3s ease-out forwards;
                }
                .animate-modal {
                    animation: modalZoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
            <div 
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center px-4 animate-backdrop"
                onClick={onClose}
            >
                <div 
                    className="w-full max-w-md rounded-[2.5rem] bg-white p-8 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden animate-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Sparkle Decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Animated Icon/GIF */}
                        <div className="w-24 h-24 bg-violet-50 rounded-3xl flex items-center justify-center mb-6 p-2 ring-8 ring-violet-50/50">
                            <img src={Login} alt="Travel Finder" className="w-full h-full object-contain rounded-full" />
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                            Save your adventure
                        </h3>
                        
                        <p className="text-slate-500 text-base mb-8 leading-relaxed">
                            Log in to save this itinerary and access your travel plans from anywhere.
                        </p>

                        {error && (
                            <div className="w-full mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 animate-shake">
                                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-500">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   </svg>
                                </div>
                                <p className="text-sm text-slate-600 font-medium text-left leading-snug">{error}</p>
                            </div>
                        )}

                        <div className="w-full space-y-3">
                            <button 
                                onClick={onGoogleLogin} 
                                disabled={isSigningIn}
                                className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:translate-y-[-3px] transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isSigningIn ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </>
                                )}
                            </button>

                            <button 
                                onClick={onClose}
                                className="w-full px-6 py-4 bg-transparent text-slate-500 rounded-2xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all duration-300"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>

                    {/* Footer Logo */}
                    <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center items-center gap-2">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-['Outfit'] font-bold text-lg">Trip <span className="text-sm text-violet-500">Spark</span></span>
                    </div>
                </div>
            </div>
        </>
    )   
};

export default AuthModal;
