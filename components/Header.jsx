// components/Header.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Redux Integration
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '@/service/slice/userSlice';

// Define the categories mapping
const newsCategories = {
  राजनीति: 'politics',
  तकनीक: 'tech',
  भ्रष्टाचार: 'corruption',
  पानी: 'water',
  सड़क: 'roads',
  'अवैध निर्माण': 'illegal_construction',
  BMC: 'bmc',
  स्वास्थ्य: 'health',
  शिक्षा: 'education',
  अपराध: 'crime',
  अन्य: 'other',
  मुंबई: 'mumbai',
  महाराष्ट्र: 'maharashtra',
  'देश-विदेश': 'national',
  फिल्म: 'film',
  खेल: 'sports',
};

// Configuration
const MOBILE_CATEGORIES_LIMIT = 6;

// --- Skeleton Component for SSR/Initial Load ---

const HeaderSkeleton = () => (
    <header className="hidden lg:flex lg:flex-col bg-white shadow-lg sticky top-0 z-50 animate-pulse">
        {/* Row 1: Top Bar */}
        <div className="bg-white py-2 border-b border-gray-200">
          <div className="h-4 w-1/3 bg-gray-200 mx-auto rounded"></div>
        </div>

        {/* Row 2: Logo + Nav + User */}
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between w-full">
            <div className="h-16 w-36 bg-gray-200 rounded"></div> 
            <nav className="flex items-center flex-1 justify-center gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-5 w-16 bg-gray-100 rounded"></div>
                ))}
            </nav>
            <div className="flex items-center gap-4">
               <div className="h-10 w-28 bg-yellow-100 rounded-md"></div>
               <div className="h-10 w-16 bg-gray-100 rounded-md"></div>
            </div>
        </div>

        {/* Row 3: Categories Bar */}
        <div className="bg-white py-2 border-t border-gray-200">
           <div className="container mx-auto max-w-7xl px-6">
             <div className="flex gap-6 whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-4 w-12 bg-gray-100 rounded"></div>
                ))}
            </div>
          </div>
        </div>
    </header>
);

// --- Main Component ---

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAllMobileCategories, setShowAllMobileCategories] = useState(false);
  
  // 🛑 FIX 1: Hydration fix flag
  const [hasMounted, setHasMounted] = useState(false);

  // Redux state access should be defensive
  const userState = useSelector((state) => state?.user?.userData || {});
  const token2 = useSelector((state) => state?.user?.token || {});

  const user = userState.user;
  const token = token2?.token;

  const router = useRouter();
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);

  // 🛑 FIX 2: useEffect to signal client-side mounting (runs only once after hydration)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Update local user state when Redux user data changes (only runs on client)
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
 
    } else if (!token && user) {
  
    }
  }, [user, token]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!hasMounted) return; // Only attach listener on client
    
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasMounted]);

  const handleLogout = () => {
    // Note: Assuming a Redux action handles clearing the state globally.
    // Here we clear localStorage and reset local state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(setToken(null))
    dispatch(setUser(null))
    
    setIsUserMenuOpen(false);
    // Force a full page redirect/refresh to ensure complete state reset
    window.location.href = '/'; 
  };

  const menuItems = [
    { name: 'होम', href: '/' },
    { name: 'समाचार', href: '/news' },
    { name: 'सदस्यता', href: '/member' },
    { name: 'रिपोर्टर बनें', href: '/register-reporter' },
    { name: 'विज्ञापन', href: '/advertise' },
    { name: 'हमारे बारे में', href: '/about' },
    { name: 'संपर्क करें', href: '/contact' },
  ];

  const primaryMobileItems = [
    { name: 'समाचार', href: '/news' },
    { name: 'सदस्यता', href: '/member' },
    { name: 'रिपोर्टर बनें', href: '/register-reporter' },
    { name: 'विज्ञापन', href: '/advertise' },
  ];
  
  // Determine categories to show in mobile menu dropdown
  const categoriesToShow = showAllMobileCategories 
    ? Object.entries(newsCategories) 
    : Object.entries(newsCategories).slice(0, MOBILE_CATEGORIES_LIMIT);

    // 🛑 FIX 3: If not mounted, render the skeleton (to prevent SSR/Client conditional mismatch)
    if (!hasMounted) {
        return (
            <>
                <HeaderSkeleton />
                {/* Mobile Header Skeleton - Simplified for brevity */}
                <header className="lg:hidden bg-white shadow-lg sticky top-0 z-50 border-b-2 border-black">
                   <div className="flex items-center justify-between px-4 py-2.5 h-16">
                       <div className="w-6 h-6 bg-gray-200"></div>
                       <div className="h-10 w-24 bg-gray-200"></div>
                       <div className="h-8 w-20 bg-yellow-100 rounded-md"></div>
                   </div>
                </header>
            </>
        );
    }

    // --- Client-Side Render (After Hydration) ---

  return (
    <>
      {/* Desktop Header (lg and up) - 3 Rows */}
      <header className="hidden lg:flex lg:flex-col bg-white shadow-lg sticky top-0 z-50">
      
        {/* Row 1: Top Bar (Static Info) */}
        <div className="bg-white text-black py-2 text-center text-sm font-medium border-b border-gray-200">
          <p>मुंबई की आवाज़ | 2009 से आपके साथ</p>
        </div>

        {/* Row 2: Logo + Nav + ePaper/Login */}
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between w-full">
          <Link href="/">
            <img
              src="/logo.png"
              alt="मुंबई प्लस"
              width={320}
              height={90}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links (Center) */}
          <nav className="flex items-center flex-1 justify-center text-black font-bold text-base">
            {menuItems.map((item, index) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`py-1 px-4 border-r-2 border-black hover:text-yellow-600 transition ${index === menuItems.length - 1 ? 'border-r-0' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ePaper & User/Login (Right) - Hydration Fixed */}
          <div className="flex items-center gap-4">
            <Link
              href="/epaper"
              className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-md font-bold text-sm hover:bg-red-50 transition whitespace-nowrap"
            >
              Read ePaper
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-md">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold text-sm text-black hidden sm:inline">{user.name || 'प्रोफ़ाइल'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-2xl border-2 border-black z-50">
                    <div className="p-4 bg-white text-black rounded-t-md border-b border-gray-200">
                      <p className="font-bold text-base line-clamp-1">{user.name}</p>
                      <p className="text-xs opacity-80">
                        {user.role === 'admin' ? 'एडमिन' : user.role === 'reporter' ? 'रिपोर्टर' : 'यूजर'}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link href="/post" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm text-black">डैशबोर्ड</Link>
                      
                      {/* Role-based menu items */}
                      {user.role === 'reporter' && (
                        <Link href="/my-posts" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm text-black">मेरी पोस्ट्स</Link>
                      )}
                      
                      {user.role === 'admin' && (
                        <>
                          <Link href="/admin/epaper" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm text-black">E-Paper अपलोड</Link>
                          <Link href="/admin/reporters" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm text-black">रिपोर्टर्स</Link>
                          <Link href="/admin/posts" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-sm text-black">सभी पोस्ट्स</Link>
                        </>
                      )}
                      
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600 font-bold border-t text-sm">
                        लॉगआउट
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
              <Link href="/login" className="border-2 border-black text-black px-6 py-2 rounded-md font-bold text-sm hover:bg-gray-100 transition whitespace-nowrap">
                लॉगिन
              </Link>
            )}
          </div>
        </div>

        {/* Row 3: All News Categories Bar */}
        <div className="bg-white text-black py-2 overflow-x-auto custom-scrollbar-hide border-t border-gray-200">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="flex gap-6 whitespace-nowrap text-sm font-bold">
              {Object.entries(newsCategories).map(([name, slug]) => (
                <Link
                  key={slug}
                  href={`/news?category=${slug}`}
                  className="hover:text-yellow-600 transition"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header (Below lg) */}
      <header className="lg:hidden bg-white shadow-lg sticky top-0 z-50 border-b-2 border-black">
        {/* Row 1: Hamburger + Logo + ePaper */}
        <div className="flex items-center justify-between px-4 py-2.5 h-16">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black z-50"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/logo.png"
              alt="मुंबई प्लस"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <Link
            href="/epaper"
            className="border-2 border-yellow-600 text-yellow-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-yellow-50 transition whitespace-nowrap"
          >
            Read ePaper
          </Link>
        </div>

        {/* Row 2: Main Mobile Menu Bar - Scrollbar fix handled via global CSS */}
        <div className="bg-white text-black py-2 overflow-x-auto custom-scrollbar-hide border-t border-gray-200">
          <div className="flex gap-6 px-4 whitespace-nowrap justify-center items-center text-sm font-bold border-r">
            {primaryMobileItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="hover:text-yellow-600 transition border-r px-2 border-black"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Full Menu (Dropdown from Hamburger) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
             <nav className="w-3/4 max-w-xs h-full bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="py-6 px-4 space-y-5 text-base font-bold text-black">
                
                {/* News Categories / Filters Section */}
                <div>
                    <h3 className="text-lg font-extrabold mb-3 border-b-2 border-black pb-1">📰 समाचार श्रेणियां</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium text-black">
                        {categoriesToShow.map(([name, slug]) => (
                            <Link
                                key={slug}
                                href={`/news?category=${slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block hover:text-yellow-600 transition "
                            >
                                • {name}
                            </Link>
                        ))}
                    </div>

                    {/* Show More/Less Button */}
                    {Object.keys(newsCategories).length > MOBILE_CATEGORIES_LIMIT && !showAllMobileCategories && (
                      <button
                        onClick={() => setShowAllMobileCategories(true)}
                        className="w-full mt-4 py-2 text-center text-sm font-bold text-yellow-600 border-2 border-yellow-600 rounded-md hover:bg-yellow-50 transition"
                      >
                        और श्रेणियां देखें ({Object.keys(newsCategories).length - MOBILE_CATEGORIES_LIMIT} शेष)
                      </button>
                    )}
                    {showAllMobileCategories && (
                      <button
                        onClick={() => setShowAllMobileCategories(false)}
                        className="w-full mt-4 py-2 text-center text-sm font-bold text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                      >
                        कम श्रेणियां देखें
                      </button>
                    )}
                </div>

                {/* Other Primary Links */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            onClick={() => setIsMobileMenuOpen(false)} 
                            className="block hover:text-yellow-600 transition"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>


                {/* Login/User Options (Bottom) */}
                <div className="border-t-2 border-black pt-4 mt-6">
                  {user ? (
                    <>
                       <Link href="/post" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black font-bold hover:bg-gray-100 border-b border-gray-200">मेरा डैशबोर्ड</Link>
                       
                       {/* Role-based menu items for mobile */}
                       {user.role === 'reporter' && (
                         <Link href="/my-posts" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black font-bold hover:bg-gray-100 border-b border-gray-200">मेरी पोस्ट्स</Link>
                       )}
                       
                       {user.role === 'admin' && (
                         <>
                           <Link href="/admin/epaper" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black font-bold hover:bg-gray-100 border-b border-gray-200">E-Paper अपलोड</Link>
                           <Link href="/admin/reporters" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black font-bold hover:bg-gray-100 border-b border-gray-200">रिपोर्टर्स</Link>
                           <Link href="/admin/posts" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black font-bold hover:bg-gray-100 border-b border-gray-200">सभी पोस्ट्स</Link>
                         </>
                       )}
                      
                      <button onClick={handleLogout} className="w-full text-center py-3 text-white font-bold bg-yellow-600 rounded-lg mt-3 hover:bg-yellow-700 transition">
                        लॉगआउट करें
                      </button>
                    </>
                  ) : (
                    // Mobile Login Button
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 border-2 border-black text-black rounded-lg font-bold text-base hover:bg-gray-100 transition">
                      लॉगिन करें
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}