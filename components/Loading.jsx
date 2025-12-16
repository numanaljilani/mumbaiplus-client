// components/admin/VerificationDialog.jsx
'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function VerificationDialog({ post, isOpen, onClose, onVerify }) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      await onVerify();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">पोस्ट वेरिफिकेशन</h3>
                <p className="text-sm text-gray-500">इस पोस्ट को वेरीफाई करें</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Post Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>ऑथर: <span className="font-medium">{post.author?.name}</span></div>
              <div>कैटेगरी: <span className="font-medium">{post.category}</span></div>
              <div>क्रिएटेड: <span className="font-medium">
                {new Date(post.createdAt).toLocaleDateString('hi-IN')}
              </span></div>
              <div>व्यूज: <span className="font-medium">{post.views || 0}</span></div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  सावधानी: वेरीफाई करने से पहले निम्नलिखित बातें जाँच लें:
                </p>
                <ul className="mt-2 text-xs text-yellow-700 list-disc list-inside space-y-1">
                  <li>क्या कंटेंट सटीक और तथ्य-आधारित है?</li>
                  <li>क्या इमेजेज उपयुक्त और कॉपीराइट-फ्री हैं?</li>
                  <li>क्या कंटेंट किसी भी समुदाय के लिए हानिकारक नहीं है?</li>
                  <li>क्या सोर्सेस वेरीफाइड हैं?</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reason Input (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              वेरिफिकेशन नोट (वैकल्पिक)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="वेरिफिकेशन के लिए कोई नोट्स या कमेंट्स..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              कैंसल
            </button>
            <button
              onClick={handleVerify}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  प्रोसेसिंग...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  वेरीफाई करें
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}