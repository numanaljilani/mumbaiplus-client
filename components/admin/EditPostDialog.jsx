// components/admin/EditPostDialog.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Image as ImageIcon, Tag, Globe } from 'lucide-react';
import { useUpdatePostMutation } from '@/service/api/api';
import { toast } from 'sonner';

const categories = [
  { value: 'home', label: 'होम' },
  { value: 'mumbai', label: 'मुंबई' },
  { value: 'maharashtra', label: 'महाराष्ट्र' },
  { value: 'politics', label: 'राजनीति' },
  { value: 'tech', label: 'तकनीक' },
  { value: 'games', label: 'खेल' },
];

const statusOptions = [
  { value: 'pending', label: 'पेंडिंग' },
  { value: 'approved', label: 'अप्रूव्ड' },
  { value: 'rejected', label: 'रिजेक्टेड' },
];

export default function EditPostDialog({ post, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: '',
    tags: '',
    isVerified: false,
    isFeatured: false,
    imageUrl: '',
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.heading
 || '',
        content: post.description || '',
        category: post.category || 'home',
        status: post.status || 'pending',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
        isVerified: post.isVerified || false,
        isFeatured: post.isFeatured || false,
        imageUrl: post.image || '',
      });
      setImagePreview(post.image || '');
    }
  }, [post]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('कृपया टाइटल और कंटेंट दर्ज करें');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };
      
      await updatePost({ id: post._id, data: updateData }).unwrap();
      
      toast.success('✅ पोस्ट सफलतापूर्वक अपडेट हो गई');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('❌ पोस्ट अपडेट नहीं हो सकी');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updatePost({ 
        id: post._id, 
        data: { status: newStatus } 
      }).unwrap();
      
      toast.success(`✅ पोस्ट ${newStatus === 'approved' ? 'अप्रूव्ड' : 'रिजेक्टेड'} हो गई`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error('❌ स्टेटस चेंज नहीं हो सका');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Save className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">पोस्ट एडिट करें</h2>
              <p className="text-sm text-gray-500">पोस्ट ID: {post?._id?.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">क्विक एक्शन्स</h3>
              <div className="flex gap-3">
                {post?.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('approved')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                  >
                    तुरंत अप्रूव करें
                  </button>
                )}
                {post?.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('rejected')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    तुरंत रिजेक्ट करें
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    पोस्ट टाइटल *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="पोस्ट का टाइटल दर्ज करें..."
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    कंटेंट *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="पोस्ट कंटेंट दर्ज करें..."
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    टैग्स
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="टैग्स को कॉमा से अलग करें (उदा: खेल, क्रिकेट, आईपीएल)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    टैग्स यूजर को रिलेटेड कंटेंट खोजने में मदद करते हैं
                  </p>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    फीचर्ड इमेज
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-2">इमेज अपलोड करें</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          ब्राउज़ करें
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    कैटेगरी
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्टेटस
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleChange}
                      className="h-5 w-5 text-green-600 rounded"
                    />
                    <label htmlFor="isVerified" className="ml-2 text-gray-700">
                      पोस्ट वेरीफाईड है
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-5 w-5 text-yellow-600 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-gray-700">
                      फीचर्ड पोस्ट बनाएं
                    </label>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">पोस्ट स्टैट्स</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>व्यूज: <span className="font-bold">{post?.views || 0}</span></div>
                    <div>लाइक्स: <span className="font-bold">{post?.likesCount || 0}</span></div>
                    <div>कमेंट्स: <span className="font-bold">{post?.commentsCount || 0}</span></div>
                    <div>शेयर्स: <span className="font-bold">{post?.shares || 0}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>नोट:</strong> पोस्ट में बदलाव करने पर, यह ऑटोमेटिकली सभी यूजर्स को दिखाई देगी। 
                    कृपया सभी जानकारी दोबारा चेक कर लें।
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                कैंसल
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    सेविंग...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    चेंजेज सेव करें
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}