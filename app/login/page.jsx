'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Loader2, X, AlertTriangle, PhoneCall } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../service/api/api';
import { setToken , setUser} from "../../service/slice/userSlice"

// Assuming these are imported from your actual Redux setup files
// import { useLoginMutation } from '../../service/api/api';
// import { setToken , setUser } from "../../service/slice/userSlice"



// Zod Schema
const loginSchema = z.object({
  email: z.string().email('मान्य ईमेल पता दें'),
  password: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का हो'),
});


// --- Modal Component ---
const ResponseModal = ({ isOpen, onClose, title, message, contactNumber = '9594939595' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-t-8 border-red-600 animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-red-700">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-start space-x-4 mb-4 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertTriangle size={30} className="text-red-600 mt-1 flex-shrink-0" />
            <p className="text-lg font-medium text-gray-800 leading-relaxed">{message}</p>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            आपके अकाउंट को **मैनुअल सत्यापन** की आवश्यकता है। कृपया सत्यापन के लिए हमारी टीम से संपर्क करें।
          </p>

          <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-center">
            <PhoneCall size={20} className="text-red-600 mr-2" />
            <span className="text-black font-bold text-lg">
              संपर्क करें: <a href={`tel:+91${contactNumber}`} className="text-red-600 hover:underline">{contactNumber}</a>
            </span>
          </div>

        </div>
        <div className="flex justify-end p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition"
          >
            समझ गया (OK)
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    clearErrors('root');
    try {
      const result = await login(data).unwrap(); 


      // Redux में स्टोर करें
      dispatch(setToken({ token: result.token }));
      dispatch(setUser({ user: result.user }));

      // सफल लॉगिन → डैशबोर्ड
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
      
      const apiError = err.data;
      const isPending = apiError?.code === 'PENDING_APPROVAL';

      if (isPending) {
        setModalMessage(apiError.message || 'आपका अकाउंट अभी सत्यापन (Verification) के लिए लंबित है।');
        setIsModalOpen(true);
      } else {
        const message = apiError?.message || err.error || 'लॉगिन विफल। कृपया फिर से कोशिश करें';
        setError('root', { message });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex  justify-center p-4">
      <style jsx global>{`
        /* Custom font for the classic newspaper feel */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;700&display=swap');
        
        .font-headline {
            font-family: 'Playfair Display', serif;
        }
        .font-body {
            font-family: 'Roboto', sans-serif;
        }
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
      <div className="w-full max-w-lg font-body">

        {/* Header Section: Classic Newspaper Masthead Style */}
       

        {/* Global Error */}
        {errors.root && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 text-center font-medium shadow-sm">
            {errors.root.message}
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl border-t-8 border-red-600 overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-4 text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
              <Mail className='w-6 h-6' />
              रिपोर्टर लॉगिन
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm md:text-base font-bold text-gray-800 mb-2">
                ईमेल पता *
              </label>
              <div className="relative">
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="ram@example.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base transition ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm md:text-base font-bold text-gray-800 mb-2">
                पासवर्ड *
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none text-base transition ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-lg shadow-xl transition transform hover:scale-[1.01] flex items-center justify-center gap-3 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  लॉगिन हो रहा है...
                </>
              ) : (
                'रिपोर्टर डैशबोर्ड में प्रवेश करें'
              )}
            </button>

            {/* Links */}
            <div className="text-center text-sm pt-2">
              <p className="text-gray-600">
                नया अकाउंट चाहिए?{' '}
                <a href="/register-reporter" className="font-bold text-red-600 hover:text-red-700 hover:underline">रिपोर्टर बनें</a>
              </p>
              <p className="mt-1">
                <a href="#" className="text-gray-500 hover:text-red-600 hover:underline">पासवर्ड भूल गए?</a>
              </p>
            </div>
          </form>

          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-700 font-medium">
              सुरक्षित और एन्क्रिप्टेड लॉगिन | समाचार की विश्वसनीयता हमारी प्राथमिकता है।
            </p>
          </div>
        </div>
      </div>

      {/* Response Dialog (Modal) */}
      <ResponseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="सत्यापन लंबित"
        message={modalMessage}
      />
    </div>
  );
}