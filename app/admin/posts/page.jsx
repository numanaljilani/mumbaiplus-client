// app/admin/posts/page.jsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useGetAllPostsQuery, useApprovePostMutation, useDeletePostMutation, useVerifyPostMutation } from '../../../service/api/api';
import { toast } from 'sonner';
import EditPostDialog from '@/components/admin/EditPostDialog';
import VerificationDialog from '@/components/admin/VerificationDialog';
import { Loader2, Filter, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-[#ee73c4] border-t-transparent"></div>
      <p className="mt-4 text-lg text-gray-600">लोड हो रहा है...</p>
    </div>
  </div>
);

// Main Component
function AdminPostsContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [showOnlyUnverified, setShowOnlyUnverified] = useState(false);

    const userState = useSelector((state) => state?.user?.userData?.user || {});
          const router = useRouter()
          useEffect(()=>{
            if(userState.role != "admin"){
                return router.back()
            }
          },[])

  const { data, isLoading, refetch } = useGetAllPostsQuery({
    search,
    status: statusFilter === 'all' ? '' : statusFilter,
    verified: verificationFilter === 'verified' ? true : verificationFilter === 'unverified' ? false : undefined,
    startDate: dateRange.start,
    endDate: dateRange.end
  });

  const [approvePost] = useApprovePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [verifyPost] = useVerifyPostMutation();

  const posts = data?.posts || [];
  const total = data?.total || 0;


  // Handle Post Approval
  const handleApprove = async (id) => {
    const confirmed = window.confirm('क्या आप इस पोस्ट को अप्रूव करना चाहते हैं?');
    if (!confirmed) return;

    try {
      await approvePost(id).unwrap();
      toast.success('✅ पोस्ट अप्रूव हो गई!');
      refetch();
    } catch (error) {
      toast.error('❌ कुछ गलत हुआ');
    }
  };

  // Handle Post Verification
  const handleVerify = async (id) => {
    try {
      await verifyPost(id).unwrap();
      toast.success('✅ पोस्ट वेरीफाइड हो गई!');
      refetch();
    } catch (error) {
      toast.error('❌ वेरिफिकेशन फेल');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm('क्या आप इस पोस्ट को डिलीट करना चाहते हैं?');
    if (!confirmed) return;

    try {
      await deletePost(id).unwrap();
      toast.success('🗑️ पोस्ट डिलीट हो गई');
      refetch();
    } catch (error) {
      toast.error('❌ डिलीट नहीं हो सकी');
    }
  };

  // Stats Calculation
  const stats = {
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    verified: posts.filter(p => p.isVerified).length,
    total: posts.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
       

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">पेंडिंग</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">अप्रूव्ड</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">वेरीफाइड</p>
                <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">कुल पोस्ट</p>
                <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पोस्ट सर्च करें
              </label>
              <input
                type="text"
                placeholder="शीर्षक, कंटेंट या ऑथर के नाम से सर्च करें..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-[#ee73c4] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                स्टेटस
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-[#ee73c4] outline-none"
              >
                <option value="all">सभी</option>
                <option value="pending">पेंडिंग</option>
                <option value="approved">अप्रूव्ड</option>
                <option value="rejected">रिजेक्टेड</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                वेरिफिकेशन
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-[#ee73c4] outline-none"
              >
                <option value="all">सभी</option>
                <option value="verified">वेरीफाइड</option>
                <option value="unverified">अनवेरीफाइड</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  से तारीख
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#ee73c4] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  तक तारीख
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#ee73c4] outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setVerificationFilter('all');
                setDateRange({ start: '', end: '' });
              }}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              <Filter className="w-5 h-5 inline mr-2" />
              रीसेट
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin w-12 h-12 text-[#ee73c4] mx-auto" />
            <p className="text-gray-600 mt-4">पोस्ट्स लोड हो रही हैं...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className={`bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 ${
                  post.status === 'approved' 
                    ? 'border-green-500' 
                    : post.status === 'rejected'
                    ? 'border-red-500'
                    : 'border-yellow-500'
                }`}
              >
                {/* Image */}
                {post.images?.[0] && (
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.heading
}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className={`px-4 py-2 rounded-full font-bold ${
                        post.status === 'approved' 
                          ? 'bg-green-600 text-white' 
                          : post.status === 'rejected'
                          ? 'bg-red-600 text-white'
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {post.status === 'approved' ? 'अप्रूव्ड' : 
                         post.status === 'rejected' ? 'रिजेक्टेड' : 'पेंडिंग'}
                      </div>
                      {post.isVerified && (
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          वेरीफाइड
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">{post.heading
}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div>
                      <div className="font-medium">द्वारा: {post.userId?.name || 'अज्ञात'}</div>
                      <div>{format(new Date(post.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
                    </div>
                    {post.views && (
                      <div className="text-right">
                        <div className="font-medium">व्यूज</div>
                        <div>{post.views.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    {post.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(post._id)}
                        className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                      >
                        अप्रूव करें
                      </button>
                    )}

                    {post.status === 'approved' && !post.isVerified && (
                      <button
                        onClick={() => handleVerify(post._id)}
                        className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        वेरीफाई
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsEditOpen(true);
                      }}
                      className="bg-yellow-600 text-white py-3 rounded-xl font-bold hover:bg-yellow-700 transition"
                    >
                      एडिट
                    </button>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                    >
                      डिलीट
                    </button>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>कैटेगरी: <span className="font-medium">{post.category}</span></div>
                    <div>टैग्स: <span className="font-medium">{post.tags?.slice(0, 2).join(', ')}</span></div>
                    <div>कमेंट्स: <span className="font-medium">{post.commentsCount || 0}</span></div>
                    <div>लाइक्स: <span className="font-medium">{post.likesCount || 0}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-3xl text-gray-500 mb-2">कोई पोस्ट नहीं मिली</p>
            <p className="text-gray-400">अलग फिल्टर आज़माएं या नई पोस्ट का इंतज़ार करें</p>
          </div>
        )}

        {/* Pagination Info */}
        {posts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>दिखा रहे हैं {posts.length} में से {total} पोस्ट</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {selectedPost && (
        <EditPostDialog
          post={selectedPost}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedPost(null);
            refetch();
          }}
        />
      )}

      {/* Verification Dialog */}
      {selectedPost && (
        <VerificationDialog
          post={selectedPost}
          isOpen={isVerificationOpen}
          onClose={() => {
            setIsVerificationOpen(false);
            setSelectedPost(null);
          }}
          onVerify={() => handleVerify(selectedPost._id)}
        />
      )}
    </div>
  );
}

// Main Export with Suspense
export default function AdminPostsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPostsContent />
    </Suspense>
  );
}