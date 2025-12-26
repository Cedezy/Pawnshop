import React from 'react';
import { ShieldX, ArrowLeft, Lock } from 'lucide-react';

const NotAllowed = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
                        <div className="relative bg-white rounded-full p-6 shadow-sm">
                            <ShieldX className="w-16 h-16 text-red-500" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold text-slate-900">403</h1>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Unauthorized Access
                        </h2>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed">
                        You are attempting to access a restricted area of the System.
                        This section is reserved for authorized personnel only.
                    </p>

                    <p className="text-slate-500 text-sm">
                        Access to sensitive records such as pawn transactions, customer information,
                        and financial data requires proper authorization.
                    </p>
                </div>

                <div>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-lg duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer ease-in-out"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Return to Dashboard
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-300">
                    <div className="flex items-start gap-3 text-sm text-slate-500">
                        <Lock className="w-5 h-5 mt-0.5" />
                        <p>
                            If you believe this access restriction is incorrect, please contact the pawnshop administrator for verification.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotAllowed;
