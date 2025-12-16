// app/news/page.js
// Client Component को Suspense में रैप करने के लिए आवश्यक आयात
"use client"
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef, // NewsCard के लिए
  Suspense, // useSearchParams को सुरक्षित रूप से रैप करने के लिए
} from "react";

// Client-side हुक
import { useRouter, useSearchParams } from "next/navigation";
// Next.js Image कंपोनेंट (अनिवार्य है)
import NextImage from "next/image"; 
// सुनिश्चित करें कि ये आपके प्रोजेक्ट में सही से कॉन्फ़िगर किए गए हैं

import Footer from "@/components/Footer";
import Link from "next/link"; 

// RTK Query hooks (सुनिश्चित करें कि यह path सही है)
import {
  useGetAllPostsQuery,
  useGetBreakingNewsQuery,
} from "../service/api/api";
import {
  Clock,
  Loader2,
  AlertTriangle,
  ArrowRight,
  LayoutList,
  Zap,
} from "lucide-react";
import { randomBytes } from "crypto";

// --- Configuration ---

const ITEMS_PER_PAGE = 10;
const AD_INTERVAL = 120000; // 2 मिनट = 120,000 मिलीसेकंड

// English → Hindi कैटेगरी मैप
const categoryMap = {
  home: "होम",
  mumbai: "मुंबई",
  maharashtra: "महाराष्ट्र",
  games: "खेल",
  politics: "राजनीति",
  tech: "तकनीक",
};

// सभी टैब्स
const allCategories = [
  { key: "home", label: "होम" },
  { key: "mumbai", label: "मुंबई" },
  { key: "maharashtra", label: "महाराष्ट्र" },
  { key: "politics", label: "राजनीति" },
  { key: "tech", label: "तकनीक" },
  { key: "games", label: "खेल" },
];

// --- Sub-Components (Defined in this file) ---

/**
 * Hydration Error से बचने के लिए क्लाइंट-साइड पर वर्तमान तिथि प्रदर्शित करता है।
 */
const CurrentDateDisplay = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString("hi-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <p className="text-center text-sm text-gray-600 mt-1">
      {currentDate || "दिनांक लोड हो रहा है..."}
    </p>
  );
};

// **1. ब्रेकिंग न्यूज़ टिकर कंपोनेंट**
const BreakingNewsTicker = () => {
  const { data: breakingNews = {posts:[]}, isLoading } = useGetBreakingNewsQuery();
  const posts = breakingNews?.posts || [];

  if (isLoading || posts.length === 0) return null;

  // Marquee को लूप करने के लिए आइटमों को दोहराएं
  const marqueeItems = [...posts, ...posts]; 

  return (
    <div className="bg-red-700 text-white shadow-lg sticky top-0 z-40 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl flex items-center h-10">
        <div className="bg-red-900 px-3 h-full flex items-center font-extrabold text-sm whitespace-nowrap">
          <Zap className="w-4 h-4 mr-2 fill-current" /> ब्रेकिंग न्यूज़
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex w-full animate-marquee">
            {marqueeItems.map((news, index) => (
              <Link
                key={`news-${ index}`}
                href={`/news/${news.slug || news._id}`}
                className="px-6 text-sm hover:underline whitespace-nowrap"
              >
                {news.heading || news.heading}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Simple CSS for Marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
          min-width: 200%;
        }
      `}</style>
    </div>
  );
};

// **2. विज्ञापन डायलॉग/मॉडाल कंपोनेंट**
const AdDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold p-1"
          aria-label="विज्ञापन बंद करें"
        >
          &times;
        </button>
        <h3 className="text-xl font-extrabold mb-4 text-center text-yellow-600">
          प्रायोजित संदेश
        </h3>
        <div className="bg-gray-100 h-32 flex items-center justify-center border border-dashed border-gray-400">
          <p className="text-gray-500 font-semibold">आपका विज्ञापन यहाँ</p>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          इस विज्ञापन को बंद करने के लिए {Math.ceil(AD_INTERVAL / 60000)} मिनट
          प्रतीक्षा करें या ऊपर 'X' पर क्लिक करें।
        </p>
      </div>
    </div>
  );
};

// --- Loading State Sub-Component ---
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
    {[...Array(8)].map((_, i) => (
      <div
        key={i }
        className="bg-gray-50 rounded-lg shadow-sm overflow-hidden animate-pulse border border-gray-200"
      >
        <div className="h-40 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded mb-3 w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- News Card Sub-Component (NextImage का उपयोग करने के लिए अपडेट किया गया) ---
const NewsCard = forwardRef(({ post, categoryMap }, ref) => (
  <Link
    ref={ref}
    // slug का उपयोग करें यदि उपलब्ध हो, अन्यथा _id
    href={`/news/${post.slug || post._id}`} 
    className="block bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-lg"
  >
    {/* इमेज और कैटेगरी टैग */}
    {post.image && (
      <div className="relative h-48 overflow-hidden">
        {/* NextImage component का उपयोग करें */}
        <NextImage
          src={post.image}
          alt={post.heading || post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          // यदि बाहरी URL है
          unoptimized={true} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
        <span className="absolute top-2 left-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
          {categoryMap[post.category] || post.category || "न्यूज़"}
        </span>
      </div>
    )}

    {/* टेक्स्ट कंटेंट */}
    <div className="p-4 md:p-5">
      <h3 className="font-extrabold text-xl text-gray-900 line-clamp-3 group-hover:text-yellow-600 transition leading-snug">
        {post.heading || post.title}
      </h3>
      <p className="text-gray-700 text-sm mt-2 line-clamp-3 font-normal">
        {post.description}
      </p>
      <div className="flex items-center justify-between mt-4 border-t pt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("hi-IN") : 'दिनांक उपलब्ध नहीं'}
        </span>
        <span className="flex items-center gap-1 font-semibold text-yellow-600 group-hover:underline">
          पूरी खबर <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </Link>
));

NewsCard.displayName = "NewsCard";

// --- Main Client Component ---

const NewsPageContent = () => {
  // Client component
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "home";

  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);

  // विज्ञापन राज्य
  const [isAdOpen, setIsAdOpen] = useState(false);

  // कैटेगरी बदलने पर पेज को 1 पर रीसेट करें
  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategory]);

  // विज्ञापन टाइमर लॉजिक
  useEffect(() => {
    const adTimer = setInterval(() => {
      setIsAdOpen(true);
    }, AD_INTERVAL);

    return () => clearInterval(adTimer);
  }, []);

  const handleAdClose = useCallback(() => {
    setIsAdOpen(false);
  }, []);

  // RTK Query Hook
  const {
    data: postData = { posts: [], hasMore: false, currentPage: 1 },
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetAllPostsQuery({
    page: page,
    category: currentCategory,
    limit: ITEMS_PER_PAGE,
  });

  // पोस्ट डेटा को अनुकूलित करें
  const posts = useMemo(() => postData.posts || [], [postData.posts]);
  const hasMore = postData.hasMore;

  // अगले पेज को लोड करने का फंक्शन
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  // Intersection Observer Logic (इंफिनिट स्क्रॉल)
  useEffect(() => {
    if (isLoading || isFetching) return;

    if (observerRef.current) {
        observerRef.current.disconnect();
    }

    if (hasMore) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              fetchNextPage();
            }
          },
          {
            rootMargin: "200px",
          }
        );
    
        observerRef.current = observer;
    
        if (lastPostRef.current) {
          observerRef.current.observe(lastPostRef.current);
        }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, hasMore, isFetching, fetchNextPage, isLoading]);

  // टैब क्लिक → URL अपडेट
  const handleTabClick = (key) => {
    if (key === currentCategory) return;
    router.push(`/news?category=${key}`, { scroll: false });
  };

  const pageTitle = categoryMap[currentCategory] || "ताज़ा खबरें";
  const showLoader = isFetching && page > 1;

  return (
    <>
  
      <div className="min-h-screen bg-white text-gray-900 font-serif">
        {/* **ब्रेकिंग न्यूज़ टिकर** */}
        <BreakingNewsTicker />

        {/* Categories / Tabs (Sticky) */}
        <div className="sticky top-10 md:top-14 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex overflow-x-auto whitespace-nowrap py-2">
              {allCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleTabClick(category.key)}
                  className={`px-4 py-2 mx-1 rounded-full text-sm font-bold transition-all duration-200 
                    ${
                      currentCategory === category.key
                        ? "bg-yellow-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="py-6 md:py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* पेज टाइटल और Date (Hydration Fixed) */}
            <div className="mb-8 border-b-4 border-gray-900 pb-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 text-center uppercase">
                {pageTitle === "होम" ? "ताज़ा खबरें" : `${pageTitle} समाचार`}
              </h1>

              <CurrentDateDisplay />
            </div>

            {/* लोडिंग (पहला लोड) */}
            {isLoading && page === 1 && <LoadingState />}

            {/* एरर */}
            {isError && !isLoading && (
              <div className="text-center py-16 bg-yellow-50 rounded-xl border border-yellow-200">
                <AlertTriangle className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
                <p className="text-yellow-600 text-lg font-bold">
                  खबरें लोड नहीं हो सकीं।
                </p>
                <p className="text-yellow-500 text-sm mt-1">
                  {error?.error || error?.data?.message || "कनेक्शन एरर।"}
                </p>
                <button
                  onClick={() => setPage(1)}
                  className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition flex items-center gap-2 mx-auto"
                >
                  <Loader2 className="w-4 h-4" /> फिर से कोशिश करें
                </button>
              </div>
            )}

            {/* कोई खबर नहीं */}
            {!isLoading && !isError && posts.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                <LayoutList className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-700">
                  इस सेक्शन में अभी कोई खबर नहीं है।
                </p>
                <p className="text-gray-600 mt-2">जल्द ही अपडेट होगा!</p>
              </div>
            )}

            {/* न्यूज़ ग्रिड */}
            {!isLoading && !isError && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {posts.map((post, index) => {
                  const isLastPost = index === posts.length - 1;

                  return (
                    <NewsCard
                      key={post._id || index}
                      post={post}
                      categoryMap={categoryMap}
                      ref={isLastPost ? lastPostRef : null} // आखिरी पोस्ट को ref दें
                    />
                  );
                })}
              </div>
            )}

            {/* इनफिनिट स्क्रॉल लोडर */}
            {showLoader && (
              <div className="text-center py-8">
                <Loader2 className="animate-spin w-8 h-8 text-yellow-600 mx-auto" />
                <p className="text-sm text-gray-600 mt-2">
                  और खबरें लोड हो रही हैं...
                </p>
              </div>
            )}

            {/* कोई और खबर नहीं */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-10 border-t border-gray-300 mt-10">
                <p className="text-base font-bold text-gray-700">
                  सभी खबरें लोड हो गईं।
                </p>
              </div>
            )}
          </div>
        </main>

        {/* 4. Footer component */}
        <Footer />

        {/* **विज्ञापन मॉडाल** */}
        <AdDialog isOpen={isAdOpen} onClose={handleAdClose} />
      </div>
    </>
  );
};

// --- Server Component Wrapper (Default Export) ---

// Next.js को इस पेज को गतिशील रूप से रेंडर करने के लिए मजबूर करें
export const dynamic = "force-dynamic";

// मुख्य Page Component, जो Client Component को Suspense में रैप करता है
export default function NewsPage() {
    // Suspense के लिए एक साधारण लोडर
    const PageLoadingFallback = () => (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <Loader2 className="animate-spin w-10 h-10 text-yellow-600 mx-auto" />
                <p className="text-lg text-gray-600 mt-4">पेज लोड हो रहा है...</p>
            </div>
        </div>
    );
    
    // NewsPageContent (Client Component) को Suspense में रैप करें। 
    // यह useSearchParams को सुरक्षित रूप से हैंडल करता है।
    return (
        <Suspense fallback={<PageLoadingFallback />}>
            <NewsPageContent />
        </Suspense>
    );
}