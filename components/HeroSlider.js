'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    image: '/bg.jpg',
    title: 'Global Summit Addresses Climate Change Crisis',
    category: 'World News'
  },
  {
    id: 2,
    image: '/bg.jpg',
    title: 'Tech Giants Announce Breakthrough in AI Technology',
    category: 'Technology'
  },
  {
    id: 3,
    image: '/bg.jpg',
    title: 'National Team Wins Championship After Dramatic Final',
    category: 'Sports'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                {slide.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 max-w-3xl">
                {slide.title}
              </h2>
              <Link 
                href={`/news/${slide.id}`}
                className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
              >
                Read Full Story
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}