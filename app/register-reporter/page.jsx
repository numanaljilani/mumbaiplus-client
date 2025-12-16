// app/register-reporter/page.jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';

// --- RTK Query Integration (Assuming this hook is imported from your setup) ---
// Replace this import with your actual RTK Query file path
import { useRegisterReporterMutation } from '../../service/api/api'; 
// Note: The actual path depends on your project structure. For this example, 
// I'll assume you have a provider wrapper higher up in the tree.

// Zod Schema
const reporterSchema = z.object({
  name: z.string().min(2, 'नाम कम से कम 2 अक्षर का हो').max(50),
  email: z.string().email('मान्य ईमेल पता दें'),
  password: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का हो'),
  mobile: z.string().regex(/^\d{10}$/, '10 अंकों का मोबाइल नंबर'),
});

// --- Modal Component ---
const ResponseModal = ({ isOpen, onClose, title, message, success, contactNumber = '9594939595' }) => {
  if (!isOpen) return null;

  const colorClass = success === true ? 'border-green-500 text-green-700' : 
                     success === false ? 'border-red-500 text-red-700' :
                     'border-blue-500 text-blue-700';

  const Icon = success === true ? CheckCircle : AlertTriangle;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-t-8 ${colorClass}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-2xl font-bold ${colorClass}`}>{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <Icon size={30} className={colorClass} />
            <p className="text-lg font-medium text-gray-800">{message}</p>
          </div>

          {success === false && (
            <p className="text-sm text-gray-600 mt-2 p-2 bg-red-50 rounded-lg">
              यदि आप पहले ही रजिस्टर कर चुके हैं और लॉगिन नहीं कर पा रहे हैं, तो कृपया हमें <strong className='text-black'>+{contactNumber}</strong> पर संपर्क करें।
            </p>
          )}

          {success === true && (
            <p className="text-sm text-gray-600 mt-2 p-2 bg-blue-50 rounded-lg">
              आपकी लॉगिन जानकारी **मैनुअल सत्यापन** के बाद ईमेल द्वारा भेजी जाएगी।
            </p>
          )}

        </div>
        <div className="flex justify-end p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-bold text-white transition ${success ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
          >
            {success ? 'होम पेज पर जाएं' : 'ठीक है'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function RegisterReporterPage() {
  const router = useRouter();
  const [registerReporter, { isLoading }] = useRegisterReporterMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', success: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reporterSchema),
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirect to home only on successful registration
    if (modalData.success) {
      router.push('/');
    }
  };

  const onSubmit = async (data) => {
    try {
      
      const result = await registerReporter(data).unwrap();
    

      // Successful registration (200/201 response)
      setModalData({
        title: 'सफलता!',
        message: 'आपका आवेदन सफलतापूर्वक दर्ज किया गया है।',
        success: true,
      });
      setIsModalOpen(true);
      reset();

    } catch (error) {

      // Handle API errors (e.g., 400 validation, 409 email exists)
      const apiError = error.data;
      
      let message = 'रजिस्ट्रेशन के दौरान कोई त्रुटि हुई।';
      let title = 'त्रुटि';
      let successStatus = false;

      if (apiError && apiError.message) {
        if (apiError.message.includes('already registered')) {
          message = 'यह ईमेल पहले ही रजिस्टर हो चुका है।';
        } else {
          message = apiError.message;
        }
      }

      setModalData({ title, message, success: successStatus });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mumbai py-4">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Logo & Title */}
        <div className="text-center mb-3">
          
          <h1 className="text-2xl font-extrabold text-black"> रिपोर्टर पंजीकरण</h1>
          <p className="text-lg text-gray-700 mt-1">मुंबई की हर खबर – आपकी आवाज़ से!</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-t-8 border-red-600 overflow-hidden">
          <div className="bg-red-600 text-white px-8 py-4 text-center">
            <h2 className="text-xl font-semibold flex items-center justify-center">
              <Mail className='w-6 h-6 mr-3' />
              रिपोर्टर अकाउंट बनाएं
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-base font-bold text-black mb-2">पूरा नाम *</label>
              <input
                {...register('name')}
                type="text"
                className={`w-full px-5 py-3 border-2 rounded-xl focus:border-red-500 outline-none text-base text-black transition ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-red-500'
                }`}
                placeholder="राम शर्मा"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-bold text-black mb-2">ईमेल पता *</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full px-5 py-3 border-2 rounded-xl focus:border-red-500 outline-none text-base text-black ${
                  errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-red-500'
                }`}
                placeholder="ram@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-bold text-black mb-2">पासवर्ड *</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-5 py-3 border-2 rounded-xl focus:border-red-500 outline-none text-base text-black ${
                  errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-red-500'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-base font-bold text-black mb-2">मोबाइल नंबर *</label>
              <input
                {...register('mobile')}
                type="tel"
                className={`w-full px-5 py-3 border-2 rounded-xl focus:border-red-500 outline-none text-base text-black ${
                  errors.mobile ? 'border-red-500' : 'border-gray-300 focus:ring-red-500'
                }`}
                placeholder="9594939595"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl transition transform hover:scale-105 disabled:opacity-70 flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    लोड हो रहा है...
                  </>
                ) : (
                  'आवेदन भेजें'
                )}
              </button>
            </div>

            {/* Note */}
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-6 text-center">
              <p className="text-red-800 font-medium text-sm">
                आपका आवेदन प्राप्त होने के बाद हमारी टीम **मैनुअली सत्यापित** करेगी।
                <br />
                स्वीकृति पर आपको **ईमेल** द्वारा लॉगिन जानकारी भेजी जाएगी।
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Response Dialog */}
      <ResponseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData.title}
        message={modalData.message}
        success={modalData.success}
      />
    </div>
  );
}