'use client';
import Link from 'next/link';

const NewsCard = ({ _id, heading, description
, image, date, category }) => {
  console.log(image , ">>>")
  return (
  <Link 
    href={`/news/${_id}`}
    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <img 
      src={`${image}`} 
      alt={heading}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded">
          {category}
        </span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-800 transition-colors">
        {heading}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3">{description
}</p>
      <div className="mt-4 text-blue-800 hover:text-blue-700 font-medium text-sm flex items-center">
        Read More
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
)};

export default function NewsCategory({ title, news }) {
  return (
    <section className="mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-800 pl-3">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <NewsCard key={index} {...item} id={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}