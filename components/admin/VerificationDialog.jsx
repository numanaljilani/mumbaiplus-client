// components/admin/VerificationDialog.jsx
'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Shield, 
  Clock,
  Globe,
  Eye,
  FileText,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const verificationChecklist = [
  {
    id: 'accuracy',
    label: 'सटीकता',
    description: 'क्या जानकारी सही और तथ्य-आधारित है?',
    points: ['तथ्यों की जाँच की गई है', 'सोर्सेस वेरीफाइड हैं', 'कोई गलत जानकारी नहीं है']
  },
  {
    id: 'appropriateness',
    label: 'उपयुक्तता',
    description: 'क्या कंटेंट सभी यूजर्स के लिए उपयुक्त है?',
    points: ['नफरत भाषा नहीं है', 'अश्लील सामग्री नहीं है', 'सामुदायिक मानकों के अनुरूप है']
  },
  {
    id: 'legality',
    label: 'कानूनीता',
    description: 'क्या कंटेंट कानूनी रूप से सुरक्षित है?',
    points: ['कॉपीराइट उल्लंघन नहीं', 'नकली खबर नहीं', 'मानहानि या बदनामी नहीं']
  },
  {
    id: 'quality',
    label: 'गुणवत्ता',
    description: 'क्या कंटेंट अच्छी गुणवत्ता का है?',
    points: ['अच्छी ग्रामर और स्पेलिंग', 'स्पष्ट और संक्षिप्त भाषा', 'प्रासंगिक इमेजेज']
  }
];

export default function VerificationDialog({ 
  post, 
  isOpen, 
  onClose, 
  onVerify,
  onReject 
}) {
  const [checkedItems, setCheckedItems] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !post) return null;

  const toggleCheckbox = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecked = verificationChecklist.every(item => checkedItems[item.id]);

  const handleVerify = async () => {
    if (!allChecked) {
      toast.error('कृपया सभी वेरिफिकेशन चेकलिस्ट आइटम्स चेक करें');
      return;
    }

    setIsSubmitting(true);
    try {
      await onVerify();
      toast.success('✅ पोस्ट सफलतापूर्वक वेरीफाई हो गई');
      onClose();
    } catch (error) {
      toast.error('❌ वेरिफिकेशन फेल हो गई');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('कृपया रिजेक्शन का कारण दर्ज करें');
      return;
    }

    if (window.confirm('क्या आप वाकई इस पोस्ट को रिजेक्ट करना चाहते हैं?')) {
      setIsSubmitting(true);
      try {
        await onReject(rejectionReason);
        toast.success('❌ पोस्ट रिजेक्ट हो गई');
        onClose();
      } catch (error) {
        toast.error('रिजेक्शन फेल हो गया');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-green-50 border-b p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">पोस्ट वेरिफिकेशन</h2>
                <p className="text-sm text-gray-600">
                  पोस्ट को वेरीफाई करने से पहले सभी पॉइंट्स चेक करें
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Post Info Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">टाइटल:</span>
              </div>
              <p className="font-bold text-gray-800 truncate">{post.title}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">ऑथर:</span>
              </div>
              <p className="font-bold text-gray-800">{post.author?.name || 'अज्ञात'}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">कैटेगरी:</span>
              </div>
              <p className="font-bold text-gray-800">{post.category}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">व्यूज:</span>
              </div>
              <p className="font-bold text-gray-800">{post.views?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Verification Checklist */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                वेरिफिकेशन चेकलिस्ट
              </h3>
              
              <div className="space-y-4">
                {verificationChecklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      checkedItems[item.id] 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCheckbox(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={checkedItems[item.id] || false}
                          onChange={() => toggleCheckbox(item.id)}
                          className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-800">{item.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          {checkedItems[item.id] && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <ul className="mt-3 space-y-2">
                          {item.points.map((point, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                checkedItems[item.id] ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className={checkedItems[item.id] ? 'text-gray-700' : 'text-gray-500'}>
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700">वेरिफिकेशन प्रोग्रेस</span>
                  <span className="text-sm font-bold text-blue-700">
                    {Object.values(checkedItems).filter(Boolean).length} / {verificationChecklist.length}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(checkedItems).filter(Boolean).length / verificationChecklist.length) * 100}%`
                    }}
                  />
                </div>
                {allChecked && (
                  <p className="mt-2 text-sm text-green-600 font-medium text-center">
                    ✅ सभी चेकलिस्ट आइटम्स पूरे हो गए हैं
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Content Preview & Actions */}
            <div className="space-y-6">
              {/* Content Preview */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-3">कंटेंट प्रीव्यू</h4>
                <div className="max-h-60 overflow-y-auto p-3 bg-white rounded-lg border">
                  <p className="text-gray-700 whitespace-pre-line">
                    {post.content?.length > 500 
                      ? `${post.content.substring(0, 500)}...` 
                      : post.content
                    }
                  </p>
                </div>
              </div>

              {/* Verification Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  वेरिफिकेशन नोट्स (वैकल्पिक)
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="वेरिफिकेशन के लिए कोई विशेष नोट्स या टिप्पणी..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  यह नोट्स ऑथर को नहीं दिखाए जाएंगे
                </p>
              </div>

              {/* Rejection Section */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  पोस्ट रिजेक्ट करें
                </h4>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="रिजेक्ट करने का कारण दर्ज करें (अनिवार्य)..."
                  rows="2"
                  className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                />
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  पोस्ट रिजेक्ट करें
                </button>
              </div>

              {/* Warning Message */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>महत्वपूर्ण:</strong> एक बार वेरीफाई होने के बाद, 
                      यह पोस्ट विश्वसनीय स्रोत के रूप में चिह्नित हो जाएगी और 
                      सभी यूजर्स के लिए प्राथमिकता से दिखाई जाएगी।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              कैंसल
            </button>
            <button
              onClick={handleVerify}
              disabled={isSubmitting || !allChecked}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  वेरीफाई हो रहा है...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  पोस्ट वेरीफाई करें
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}