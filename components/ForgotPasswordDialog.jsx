// components/ForgotPasswordDialog.jsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Key, ArrowLeft, Loader2, X, CheckCircle } from 'lucide-react';
import { useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation } from '../service/api/api';

// Schemas for different steps
const emailSchema = z.object({
  email: z.string().email('मान्य ईमेल पता दें'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP 6 अंकों का होना चाहिए').regex(/^\d+$/, 'केवल अंक दर्ज करें'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का हो'),
  confirmPassword: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का हो'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'पासवर्ड मेल नहीं खाते',
  path: ['confirmPassword'],
});

export default function ForgotPasswordDialog({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  // API Hooks
  const [forgotPassword, { isLoading: isEmailLoading }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  // Forms
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    setError: setEmailError,
    clearErrors: clearEmailErrors,
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    setError: setOtpError,
    clearErrors: clearOtpErrors,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    setError: setPasswordError,
    clearErrors: clearPasswordErrors,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Handle Email Submit
  const onEmailSubmit = async (data) => {
    clearEmailErrors();
    setMessage({ type: '', text: '' });
    
    try {
      const result = await forgotPassword({ email: data.email }).unwrap();
      setEmail(data.email);
      setMessage({ type: 'success', text: result.message || 'OTP आपके ईमेल पर भेज दिया गया है' });
      
      // Start countdown for resend (60 seconds)
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Move to OTP step after 1.5 seconds
      setTimeout(() => {
        setStep(2);
      }, 1500);
      
    } catch (err) {
      console.error('Forgot password error:', err);
      const message = err.data?.message || 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।';
      setEmailError('root', { message });
      setMessage({ type: 'error', text: message });
    }
  };

  // Handle OTP Submit
  const onOtpSubmit = async (data) => {
    clearOtpErrors();
    setMessage({ type: '', text: '' });
    
    try {
      const result = await verifyOtp({ email, otp: data.otp }).unwrap();
      setResetToken(result.resetToken);
      setMessage({ type: 'success', text: 'OTP सत्यापित हो गया है' });
      
      // Move to password step
      setTimeout(() => {
        setStep(3);
      }, 1500);
      
    } catch (err) {
      console.error('OTP verification error:', err);
      const message = err.data?.message || 'गलत OTP। कृपया पुनः प्रयास करें।';
      setOtpError('root', { message });
      setMessage({ type: 'error', text: message });
    }
  };

  // Handle Password Reset
  const onPasswordSubmit = async (data) => {
    clearPasswordErrors();
    setMessage({ type: '', text: '' });
    
    try {
      await resetPassword({ 
        resetToken, 
        newPassword: data.newPassword 
      }).unwrap();
      
      setMessage({ type: 'success', text: 'पासवर्ड सफलतापूर्वक बदल दिया गया है' });
      setStep(4);
      
    } catch (err) {
      console.error('Password reset error:', err);
      const message = err.data?.message || 'पासवर्ड बदलने में त्रुटि। कृपया पुनः प्रयास करें।';
      setPasswordError('root', { message });
      setMessage({ type: 'error', text: message });
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await forgotPassword({ email }).unwrap();
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setMessage({ type: 'success', text: 'OTP पुनः भेज दिया गया है' });
    } catch (err) {
      setMessage({ type: 'error', text: 'OTP पुनः भेजने में त्रुटि' });
    }
  };

  // Handle Back
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage({ type: '', text: '' });
    }
  };

  // Handle Close
  const handleClose = () => {
    setStep(1);
    setEmail('');
    setResetToken('');
    setCountdown(0);
    setMessage({ type: '', text: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-t-8 border-red-600 animate-slide-up">
        
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button 
                onClick={handleBack}
                className="hover:bg-red-700 p-1 rounded-full transition"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold">
              {step === 1 && 'पासवर्ड भूल गए?'}
              {step === 2 && 'OTP सत्यापन'}
              {step === 3 && 'नया पासवर्ड'}
              {step === 4 && 'सफलता!'}
            </h2>
          </div>
          <button onClick={handleClose} className="hover:bg-red-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= s 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 ${
                  step > s ? 'bg-red-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-400' 
              : 'bg-red-100 text-red-800 border border-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
              <p className="text-gray-600 mb-4">
                अपना पंजीकृत ईमेल पता दर्ज करें। हम आपको पासवर्ड रीसेट करने के लिए एक OTP भेजेंगे।
              </p>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  ईमेल पता *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...registerEmail('email')}
                    type="email"
                    placeholder="ram@example.com"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base transition ${
                      emailErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {emailErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{emailErrors.email.message}</p>
                )}
                {emailErrors.root && (
                  <p className="text-red-500 text-xs mt-1">{emailErrors.root.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-lg py-3 rounded-lg shadow-md transition transform hover:scale-[1.01] flex items-center justify-center gap-3 mt-6"
              >
                {isEmailLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    भेज रहा है...
                  </>
                ) : (
                  'OTP भेजें'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
              <p className="text-gray-600 mb-2">
                OTP <span className="font-bold text-red-600">{email}</span> पर भेज दिया गया है।
              </p>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  6 अंकों का OTP दर्ज करें *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...registerOtp('otp')}
                    type="text"
                    maxLength="6"
                    placeholder="123456"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base text-center tracking-widest font-mono text-lg ${
                      otpErrors.otp ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {otpErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">{otpErrors.otp.message}</p>
                )}
                {otpErrors.root && (
                  <p className="text-red-500 text-xs mt-1">{otpErrors.root.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className={`text-sm font-medium ${
                    countdown > 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-red-600 hover:text-red-700 hover:underline'
                  }`}
                >
                  {countdown > 0 ? `पुनः भेजें (${countdown}s)` : 'OTP पुनः भेजें'}
                </button>
                <span className="text-xs text-gray-500">OTP 10 मिनट के लिए वैध है</span>
              </div>

              <button
                type="submit"
                disabled={isOtpLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-lg py-3 rounded-lg shadow-md transition transform hover:scale-[1.01] flex items-center justify-center gap-3 mt-6"
              >
                {isOtpLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    सत्यापन हो रहा है...
                  </>
                ) : (
                  'OTP सत्यापित करें'
                )}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <p className="text-gray-600 mb-2">
                अपना नया पासवर्ड दर्ज करें।
              </p>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  नया पासवर्ड *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...registerPassword('newPassword')}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base ${
                      passwordErrors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  पासवर्ड की पुष्टि करें *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...registerPassword('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base ${
                      passwordErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
                {passwordErrors.root && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.root.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-lg py-3 rounded-lg shadow-md transition transform hover:scale-[1.01] flex items-center justify-center gap-3 mt-6"
              >
                {isResetLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    बदल रहा है...
                  </>
                ) : (
                  'पासवर्ड बदलें'
                )}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                पासवर्ड बदल दिया गया!
              </h3>
              <p className="text-gray-600 mb-6">
                आपका पासवर्ड सफलतापूर्वक बदल दिया गया है। अब आप नए पासवर्ड से लॉगिन कर सकते हैं।
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-3 rounded-lg shadow-md transition"
              >
                लॉगिन करें
              </button>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}