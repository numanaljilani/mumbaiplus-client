import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react'; // Importing useMemo for demonstration, though not strictly required here

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Tailwind accent color used: yellow-600
  const accentColor = "text-yellow-600";
  const hoverAccentColor = "hover:text-yellow-600";
  const baseTextColor = "text-gray-300";

  return (
    // Background changed to deep slate-900 for a dark, professional, and non-pure-black look
    <footer className="bg-slate-900 text-white py-10 md:py-16 font-inter border-t-4 border-yellow-600/50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Top Section: Logo and Social Icons (Centered) */}
        <div className="flex flex-col items-center justify-center border-b border-slate-700/50 pb-8 mb-8">
          
          {/* Logo - Centered and Clean */}
          <Link href="/" aria-label="Home" className="mb-8 p-1 rounded-lg transition-all hover:bg-slate-800">
            {/* Using a placeholder image URL, replace with your actual logo path */}
            <img
              src="/logo.png" 
              alt="मुंबई प्लस"
              width={220}
              height={55}
              className="rounded-lg shadow-xl"
              priority
            />
          </Link>

          {/* Social Media Icons - Bold and Interactive (All accents are yellow-600) */}
          <div className="flex justify-center gap-8">
            
            {/* Facebook */}
            <Link
              href="https://facebook.com/mumbaiplus"
              target="_blank"
              aria-label="Facebook"
              className={`${baseTextColor} ${hoverAccentColor} hover:scale-110 transition-all duration-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.407.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.326V1.326C24 .593 23.407 0 22.675 0z"/>
              </svg>
            </Link>

            {/* X (Twitter) */}
            <Link
              href="https://twitter.com/mumbaiplus"
              target="_blank"
              aria-label="X (Twitter)"
              className={`${baseTextColor} ${hoverAccentColor} hover:scale-110 transition-all duration-300`}
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </Link>

            {/* Instagram */}
            <Link
              href="https://instagram.com/mumbaiplus"
              target="_blank"
              aria-label="Instagram"
              className={`${baseTextColor} ${hoverAccentColor} hover:scale-110 transition-all duration-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
              </svg>
            </Link>

             {/* YouTube */}
            <Link
              href="https://youtube.com/mumbaiplus"
              target="_blank"
              aria-label="YouTube"
              className={`${baseTextColor} ${hoverAccentColor} hover:scale-110 transition-all duration-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.02V8.98l6.25 3.02-6.25 3.02z"/>
              </svg>
            </Link>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex justify-center items-center text-center text-gray-500 text-sm md:text-base px-4">
          <p>
            {/* Copyright highlight uses yellow-600 */}
            © {currentYear} <span className={`font-bold ${accentColor}`}>मुंबई प्लस</span> | सभी अधिकार सुरक्षित | RNI: MAHHI/2009/28028
          </p>
        </div>
        
      </div>
    </footer>
  );
}