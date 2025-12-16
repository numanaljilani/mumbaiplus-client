
"use client"
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import NextImage from "next/image";
import {
  useGetAllPostsQuery,
  useDeletePostMutation
} from "../../service/api/api";
import {
  Clock,
  Loader2,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ListOrdered,
  Plus,
} from "lucide-react";

// --- Configuration ---
const ITEMS_PER_PAGE = 10;

// --- Helper Functions ---
const getStatusDetails = (status) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  switch (normalizedStatus) {
    case "approved":
      return {
        label: "अनुमोदित",
        color: "text-green-600 bg-green-100 border-green-200",
        icon: CheckCircle,
      };
    case "rejected":
      return {
        label: "अस्वीकृत",
        color: "text-red-600 bg-red-100 border-red-200",
        icon: XCircle,
      };
    case "pending":
    default:
      return {
        label: "लंबित",
        color: "text-yellow-600 bg-yellow-100 border-yellow-200",
        icon: Clock,
      };
  }
};

// --- Sub-Components ---
const UserPostCard = ({ post, onDelete }) => {
  const { label, color, icon: Icon } = getStatusDetails(post.status);

  return (
    <div className="flex flex-col sm:flex-row bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      
      {/* Image - Full width on mobile, fixed on desktop */}
      <div className="relative w-full h-40 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex-shrink-0">
        {post.image ? (
          <NextImage
            src={post.image}
            alt={post.heading}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 24vw, (max-width: 1024px) 32vw, 160px"
            className="object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="bg-gray-100 flex items-center justify-center h-full">
            <ListOrdered className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content and Actions */}
      <div className="p-3 md:p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-extrabold text-base md:text-lg lg:text-xl line-clamp-2 text-gray-900">
            <Link href={`/news/${post.slug || post._id}`} className="hover:text-yellow-600">
              {post.heading || post.title}
            </Link>
          </h3>
          
          {/* Status and Date - Stack on mobile, row on larger screens */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
            {/* Status */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${color} w-fit`}>
              <Icon className="w-3 h-3" />
              {label}
            </span>
            
            {/* Date */}
            <span className="text-gray-500 flex items-center gap-1 text-sm">
              <Clock className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString("hi-IN")}
            </span>
          </div>
        </div>
        
        {/* Action Buttons - Stack on mobile, row on larger screens */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-4 sm:mt-3">
          {/* Edit */}
          <Link
            href={`/post/edit/${post._id}`}
            className="flex items-center justify-center sm:justify-start gap-1 text-sm md:text-base font-semibold text-blue-600 hover:text-blue-800 transition px-3 py-2 sm:px-0 sm:py-0 border border-blue-200 sm:border-none rounded-lg sm:rounded-none bg-blue-50 sm:bg-transparent"
          >
            <Edit className="w-4 h-4" /> <span className="sm:ml-1">संपादित करें</span>
          </Link>
          
          {/* Delete */}
          <button
            onClick={() => onDelete(post._id)}
            className="flex items-center justify-center sm:justify-start gap-1 text-sm md:text-base font-semibold text-red-600 hover:text-red-800 transition px-3 py-2 sm:px-0 sm:py-0 border border-red-200 sm:border-none rounded-lg sm:rounded-none bg-red-50 sm:bg-transparent"
          >
            <Trash2 className="w-4 h-4" /> <span className="sm:ml-1">डिलीट करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex flex-col sm:flex-row bg-gray-50 border border-gray-200 rounded-lg shadow-sm animate-pulse h-auto min-h-[160px] sm:h-32 md:h-40"
      >
        <div className="w-full h-40 sm:w-24 sm:h-full md:w-32 lg:w-40 bg-gray-200 flex-shrink-0"></div>
        <div className="p-4 flex-grow space-y-3">
          <div className="h-4 md:h-6 bg-gray-300 rounded w-4/5"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Main Component ---
const MOCK_USER_ID = "user123"; 

export default function UserPostsDashboard() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);

  const userId = MOCK_USER_ID;

  // Debouncing for Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // RTK Query Hook
  const {
    data: postData = { posts: [], hasMore: false, currentPage: 1 },
    isFetching,
    isLoading,
    isError,
    error,
    refetch, 
  } = useGetAllPostsQuery({
    userId: userId,
    searchQuery: debouncedSearch,
    page: page,
    limit: ITEMS_PER_PAGE,
  });

  // RTK Mutation Hook for Deletion
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const posts = useMemo(() => postData.posts || [], [postData.posts]);
  const hasMore = postData.hasMore;

  // Fetch next page function
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  // Intersection Observer Logic
  useEffect(() => {
    if (isLoading || isFetching || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current = observer;

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, hasMore, isFetching, fetchNextPage, isLoading]);

  // Delete post handler
  const handleDeletePost = async (postId) => {
    if (isDeleting) return;

    if (window.confirm("क्या आप वाकई इस पोस्ट को डिलीट करना चाहते हैं? यह कार्रवाई अपरिवर्तनीय है।")) {
      try {
        await deletePost(postId).unwrap();
        // toast.success("पोस्ट सफलतापूर्वक डिलीट कर दी गई।");
        refetch(); 
      } catch (err) {
        console.error("पोस्ट डिलीट करने में विफल:", err);
        // toast.error(`डिलीट विफल: ${err?.data?.message || "सर्वर एरर"}`);
      }
    }
  };

  const showLoader = isFetching && page > 1;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <main className="py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl lg:max-w-6xl">
          
          {/* --- Heading Section --- */}
          <div className="mb-4 sm:mb-6 border-b-2 sm:border-b-3 md:border-b-4 border-yellow-600 pb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 uppercase">
              पोस्ट डैशबोर्ड 🚀
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base md:text-lg">अपने पोस्ट की स्थिति और गतिविधि देखें।</p>
          </div>

          {/* --- Search and Create Button Section --- */}
          <div className="mb-6 sm:mb-8 flex flex-col xs:flex-row gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="अपनी पोस्ट खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition shadow-sm text-sm sm:text-base"
                disabled={isLoading || isDeleting}
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>

            {/* Create New Post Button */}
            <Link 
              href="/post/create-post" 
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md whitespace-nowrap text-sm sm:text-base flex-shrink-0 w-full xs:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> 
              <span className="hidden xs:inline">नया पोस्ट बनाएं</span>
              <span className="xs:hidden">नया पोस्ट</span>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && page === 1 && <LoadingState />}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="text-center py-8 sm:py-10 bg-red-50 rounded-xl border border-red-200 mx-2 sm:mx-0">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-red-600 text-base sm:text-lg font-bold">
                पोस्ट लोड नहीं हो सकीं।
              </p>
              <p className="text-red-500 text-xs sm:text-sm mt-1 px-2">
                {error?.error || error?.data?.message || "कनेक्शन एरर।"}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 bg-gray-900 text-white px-4 sm:px-5 py-2 rounded-lg font-bold hover:bg-gray-700 transition flex items-center gap-2 mx-auto text-sm sm:text-base"
              >
                <Loader2 className="w-4 h-4" /> फिर से कोशिश करें
              </button>
            </div>
          )}

          {/* No Posts Found */}
          {!isLoading && !isError && posts.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-gray-200 mx-2 sm:mx-0">
              <ListOrdered className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 mx-auto mb-3 sm:mb-4" />
              <p className="text-lg sm:text-xl font-bold text-gray-700">
                आपको कोई पोस्ट नहीं मिली।
              </p>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {debouncedSearch ? "अपनी खोज को रीसेट करें, या" : "अभी एक नई पोस्ट बनाएं!"}
              </p>
              <Link 
                href="/post/create-post" 
                className="mt-4 inline-block bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 transition text-sm sm:text-base"
              >
                + नई पोस्ट बनाएं
              </Link>
            </div>
          )}

          {/* Posts List */}
          {!isLoading && !isError && posts.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {posts.map((post, index) => {
                const isLastPost = index === posts.length - 1;

                return (
                  <div
                    key={post._id}
                    ref={isLastPost ? lastPostRef : null}
                  >
                    <UserPostCard
                      post={post}
                      onDelete={handleDeletePost}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Infinite Scroll Loader */}
          {(showLoader || isDeleting) && (
            <div className="text-center py-6 sm:py-8">
              <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 mx-auto" />
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {isDeleting ? "डिलीट हो रहा है..." : "और पोस्ट लोड हो रहे हैं..."}
              </p>
            </div>
          )}

          {/* No More Posts */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4 sm:py-6 border-t border-gray-300 mt-4 sm:mt-6">
              <p className="text-sm sm:text-base font-bold text-gray-700">
                सभी पोस्ट लोड हो गईं।
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}