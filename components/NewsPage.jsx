// app/news/page.jsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// मान लीजिए आपके पास ये कंपोनेंट्स हैं
import Header from '@/components/Header'; 
import Footer from '@/components/Footer'; 

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// RTK Query से useGetAllPostsQuery का उपयोग करें
import { useGetAllPostsQuery } from '../service/api/api'; 
import { Clock, Loader2, AlertTriangle, ArrowRight, LayoutList } from 'lucide-react';

// --- Configuration ---

const ITEMS_PER_PAGE = 10;

// English → Hindi कैटेगरी मैप
const categoryMap = {
  home: 'होम',
  mumbai: 'मुंबई',
  maharashtra: 'महाराष्ट्र',
  games: 'खेल', 
  politics: 'राजनीति', 
  tech: 'तकनीक',
};

// सभी टैब्स
const allCategories = [
  { key: 'home', label: 'होम' },
  { key: 'mumbai', label: 'मुंबई' },
  { key: 'maharashtra', label: 'महाराष्ट्र' },
  { key: 'politics', label: 'राजनीति' },
  { key: 'tech', label: 'तकनीक' },
  { key: 'games', label: 'खेल' },
];

// --- Sub-Components for Hydration Fix ---

/**
 * Hydration Error से बचने के लिए क्लाइंट-साइड पर वर्तमान तिथि प्रदर्शित करता है।
 */
const CurrentDateDisplay = () => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // यह सुनिश्चित करता है कि यह कोड केवल क्लाइंट (ब्राउज़र) में चलता है
        const formattedDate = new Date().toLocaleDateString('hi-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        setCurrentDate(formattedDate);
    }, []);

    // यदि आप सुनिश्चित हैं कि यह एक minor mismatch है तो suppressHydrationWarning का उपयोग कर सकते हैं।
    // लेकिन useEffect का उपयोग करना सबसे सुरक्षित है।
    return (
        <p className="text-center text-sm text-gray-600 mt-1">
            {currentDate || 'दिनांक लोड हो रहा है...'}
        </p>
    );
};


// --- Main Component ---

export const dynamic = 'force-dynamic';

export default function NewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'home'; 

  const [page, setPage] = useState(1);
  const observerRef = useRef(null); 
  const lastPostRef = useRef(null); 

  // कैटेगरी बदलने पर पेज को 1 पर रीसेट करें
  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCategory]);
  
  // RTK Query Hook
  const { 
    data: postData = { posts: [], hasMore: false, currentPage: 1 }, 
    isFetching, 
    isLoading, 
    isError, 
    error 
  } = useGetAllPostsQuery({ 
    page: page, 
    category: currentCategory, 
    limit: ITEMS_PER_PAGE 
  });
  
  const posts = useMemo(() => postData.posts || [], [postData.posts]);
  const hasMore = postData.hasMore;
  
  // अगले पेज को लोड करने का फंक्शन
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  // Intersection Observer Logic
  useEffect(() => {
    // अगर और डेटा नहीं है, तो observe करने की आवश्यकता नहीं है
    if (!hasMore || isLoading || isFetching) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, {
      rootMargin: '200px', 
    });

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
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


  // टैब क्लिक → URL अपडेट
  const handleTabClick = (key) => {
    if (key === currentCategory) return;
    router.push(`/news?category=${key}`, { scroll: false }); 
  };

  const pageTitle = categoryMap[currentCategory] || 'ताज़ा खबरें';
  const showLoader = isFetching && page > 1; 

  return (
    <div className="min-h-screen bg-white text-gray-900 font-serif">
      
    

      {/* 2. Categories / Tabs (Sticky) */}
     
      
      <main className="py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* 3. पेज टाइटल और Date (Hydration Fixed) */}
          {/* <div className="mb-8 border-b-4 border-gray-900 pb-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 text-center uppercase">
              {pageTitle === 'होम' ? 'ताज़ा खबरें' : `${pageTitle} समाचार`}
            </h1>
         
            <CurrentDateDisplay /> 
          </div> */}

          {/* लोडिंग (पहला लोड) */}
          {isLoading && page === 1 && (
            <LoadingState />
          )}

          {/* एरर */}
          {isError && !isLoading && (
            <div className="text-center py-16 bg-yellow-50 rounded-xl border border-yellow-200">
              <AlertTriangle className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
              <p className="text-yellow-600 text-lg font-bold">खबरें लोड नहीं हो सकीं।</p>
              <p className="text-yellow-500 text-sm mt-1">{error?.error || error?.data?.message || 'कनेक्शन एरर।'}</p>
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
              <LayoutList className="w-10 h-10 text-gray-500 mx-auto mb-4"/>
              <p className="text-xl font-bold text-gray-700">इस सेक्शन में अभी कोई खबर नहीं है।</p>
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
                    key={post._id} 
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
              <p className="text-sm text-gray-600 mt-2">और खबरें लोड हो रही हैं...</p>
            </div>
          )}

          {/* कोई और खबर नहीं */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-10 border-t border-gray-300 mt-10">
              <p className="text-base font-bold text-gray-700">सभी खबरें लोड हो गईं।</p>
            </div>
          )}
        </div>
      </main>

      {/* 4. Footer component (Fixed Hydration Error) */}
      <Footer />
    </div>
  );
}

// --- Loading State Sub-Component ---

const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden animate-pulse border border-gray-200">
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

// --- News Card Sub-Component (Forward Ref) ---

const NewsCard = React.forwardRef(({ post, categoryMap }, ref) => (
  <Link
    ref={ref} 
    href={`/news/${post._id}`}
    className="block bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-lg"
  >
    {/* इमेज और कैटेगरी टैग */}
    {post.image && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.heading || post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
        <span className="absolute top-2 left-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
          {categoryMap[post.category] || post.category || 'न्यूज़'}
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
            {new Date(post.createdAt).toLocaleDateString('hi-IN')}
        </span>
        <span className="flex items-center gap-1 font-semibold text-yellow-600 group-hover:underline">
            पूरी खबर <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </Link>
));

NewsCard.displayName = 'NewsCard';