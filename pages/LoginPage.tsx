import React, { useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { googleSignIn, user } = UserAuth();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error: any) {
            console.error("Google Sign-In Failed:", error);
            
            let errorMessage = "Failed to sign in with Google. Please try again.";
            
            if (error?.code === 'auth/unauthorized-domain') {
                errorMessage = "This domain is not authorized for Google Sign-In. Please contact the administrator.";
            } else if (error?.code === 'auth/popup-blocked') {
                errorMessage = "Popup was blocked. Please allow popups for this site and try again.";
            } else if (error?.code === 'auth/cancelled-popup-request') {
                errorMessage = "Sign-in was cancelled. Please try again.";
            } else if (error?.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Please check your internet connection and try again.";
            }
            
            alert(errorMessage);
        }
    };

    useEffect(() => {
        if (user) {
            // Small delay to ensure user data is fully loaded
            setTimeout(() => {
                window.location.hash = 'user-dashboard';
            }, 100);
        }
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
            <div className="card w-full max-w-sm text-center">
                <div className="p-6 lg:p-8">
                    <div className="flex justify-center items-center gap-2.5 mb-6">
                        <span className="material-icons-outlined text-4xl text-blue-600 dark:text-blue-500">apps</span>
                        <span className="text-2xl font-bold tracking-tight">MargeitPro</span>
                    </div>
                    <h1 className="text-xl font-bold mb-2">Welcome Back!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to continue to your dashboard.</p>
                    
                    <button 
                        onClick={handleGoogleSignIn}
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.317-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.048 36.453 44 30.861 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                        </svg>
                        Sign In with Google
                    </button>
                    
                    <p className="text-xs text-gray-400 mt-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
