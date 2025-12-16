// app/news/[id]/page.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Footer component import
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { server } from "../../../contants"; // Assuming 'contants' is intentional, otherwise fix spelling

// हिंदी मैपिंग
const categoryHindiMap = {
  politics: "राजनीति",
  tech: "तकनीक",
  corruption: "भ्रष्टाचार",
  water: "पानी",
  roads: "सड़क",
  illegal_construction: "अवैध निर्माण",
  bmc: "BMC",
  health: "स्वास्थ्य",
  education: "शिक्षा",
  crime: "अपराध",
  other: "अन्य",
  home: "होम",
  mumbai: "मुंबई",
  maharashtra: "महाराष्ट्र",
  games: "खेल", // Changed from 'games' to 'खेल'
  film: "फिल्म",
  sports: "खेल", // Use the same for sports
  national: "देश-विदेश",
};

// --- News Detail Component ---
export default async function NewsDetail({ params }) {
  const { id } = await params;

  let news = null;
  try {
    const res = await fetch(`${server}/api/posts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("News not found");
    news = await res.json();

  } catch (err) {
    console.error("Fetch error:", err);
    notFound();
  }

  if (!news || !news._id) notFound();

  const hindiCategory = categoryHindiMap[news.category] || news.category;
  const pageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "https://mumbaiplus.in"
  }/news/${id}`;
  const shareText = encodeURIComponent(`${news.title} - मुंबई प्लस`);

  // Function to format date to Indian timezone (IST)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata", // Ensuring IST
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-mumbai">
      <main className="flex-grow py-8 md:py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb - Styling updated for theme */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-yellow-600 transition">
              होम
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/news" className="hover:text-yellow-600 transition">
              समाचार
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/news/category/${news.category}`}
              className="text-yellow-600 font-bold hover:text-yellow-700 transition"
            >
              {hindiCategory}
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-10">
            {/* Category Tag and Date */}
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
              <span className="bg-yellow-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-md">
                {hindiCategory}
              </span>
              <span className="text-gray-600 font-medium">
                {formatDate(news.createdAt)}
              </span>
            </div>

            {/* Title and Description */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {news.heading}
            </h1>

            {/* <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed font-semibold">
              {news.description}
            </p> */}

            {/* Reporter Info - Styling updated for theme */}
           
          </header>

          {/* Featured Image */}
          {news.image && (
            <div className="mb-10 -mx-4 md:mx-0">
              {/* Using standard img tag for external source, adjusted dimensions/classes */}
              {/*  */}
              <img
                src={news.image}
                alt={news.title}
                width={1200}
                height={600}
                className="w-full h-auto max-h-[500px] rounded-2xl shadow-xl object-cover"
                priority
              />
              {news.imageCredit && (
                <p className="text-center text-sm text-gray-500 mt-3 italic">
                  फोटो: {news.imageCredit}
                </p>
              )}
            </div>
          )}

          {/* Content - Using custom styling to override default prose */}
          <div className="prose prose-lg max-w-none mb-12 text-gray-800 leading-relaxed text-justify">
            <div
              dangerouslySetInnerHTML={{
                __html: news.content || news.description,
              }}
              className="space-y-6 text-lg"
            />
          </div>

          {/* Tags - Styling updated for theme */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10 border-t border-gray-200 pt-6">
              <span className="font-bold text-gray-700">टैग्स:</span>
              {news.tags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/news/tag/${tag.toLowerCase()}`}
                  className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-200 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Social Share - Styling updated for theme */}
          <div className="bg-gray-100 rounded-3xl p-8 mb-12 shadow-inner border-t-2 border-yellow-600">
            <p className="text-xl font-bold text-gray-800 mb-6 text-center">
              इस खबर को अपने दोस्तों तक पहुँचाएँ
            </p>
            <div className="flex justify-center gap-6">
              {/* WhatsApp */}
              <Link
                href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
                aria-label="WhatsApp पर शेयर करें"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.263c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.488" />
                </svg>
              </Link>

              {/* Facebook */}
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
                aria-label="Facebook पर शेयर करें"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.407.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.326V1.326C24 .593 23.407 0 22.675 0z" />
                </svg>
              </Link>

              {/* X (Twitter) */}
              <Link
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
                aria-label="X (Twitter) पर शेयर करें"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

           {(news.reporterName || news.userId?.name) && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 border-l-4 border-yellow-600 rounded-lg shadow-sm">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {(news.reporterName || news.userId?.name || "M")[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {news.reporterName || news.userId?.name || "मुंबई प्लस टीम"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {news.ward
                      ? `वार्ड ${news.ward} से रिपोर्टिंग`
                      : "लोकल रिपोर्टर"}
                  </p>
                </div>
              </div>
            )}

          {/* Newsletter - Styling updated for theme */}
          <div className="border-2 border-yellow-600 text-white rounded-3xl p-10 text-center shadow-2xl">
            <h3 className="text-2xl text-yellow-600 md:text-3xl font-extrabold mb-4">
              🔥 रोज़ ताज़ा खबरें सीधे आपके इनबॉक्स में
            </h3>
            <p className="text-yellow-100 mb-8 text-yellow-600 text-lg">
              कोई स्पैम नहीं, सिर्फ़ सच और जरूरी खबरें
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="आपका ईमेल एड्रेस"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg whitespace-nowrap"
              >
                सब्सक्राइब करें
              </button>
            </form>
          </div>
        </article>
      </main>

      {/* 2. Footer (Common Component) */}
      <Footer />
    </div>
  );
}

// --- SEO Metadata (Kept as is, adjusting server URL for consistency if needed) ---
export async function generateMetadata({ params }) {
  let news = null;
  // Use the 'server' constant imported from '../../../contants'
  try {
    const res = await fetch(`${server}/api/posts/${params.id}`, {
      cache: "no-store",
    });
    if (res.ok) news = await res.json();
  } catch (err) {}

  if (!news) {
    return { title: "खबर नहीं मिली - मुंबई प्लस" };
  }

  return {
    title: `${news.title} - मुंबई प्लस`,
    description: news.description?.substring(0, 160),
    openGraph: {
      title: news.title,
      description: news.description,
      images: news.image ? [{ url: news.image }] : [],
      type: "article",
      publishedTime: news.createdAt,
    },
  };
}
