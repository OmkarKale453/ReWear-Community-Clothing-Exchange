import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Landing: React.FC = () => {
  const { state } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredItems = state.items.filter(item => item.status === 'available').slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredItems.length / 3));
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredItems.length / 3));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredItems.length / 3)) % Math.ceil(featuredItems.length / 3));
  };

  const stats = [
    { label: 'Items Swapped', value: '2,500+', icon: Recycle },
    { label: 'Community Members', value: '1,200+', icon: Users },
    { label: 'Average Rating', value: '4.9', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Give Your Clothes a <span className="text-emerald-600">Second Life</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Join our sustainable fashion community. Swap, share, and discover unique clothing pieces while reducing waste and saving money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/browse"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all"
            >
              Start Swapping <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link
              to="/add-item"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition-all"
            >
              List an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-3">
                <stat.icon className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Items</h2>
            <p className="text-gray-600">Discover unique pieces from our community.</p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(featuredItems.length / 3) }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredItems
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((item) => (
                          <Link
                            key={item.id}
                            to={`/item/${item.id}`}
                            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow group"
                          >
                            <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-t-xl">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                {item.title}
                              </h3>
                              <div className="text-gray-600 text-xs mb-2 line-clamp-2">
                                {item.description}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-emerald-600 font-semibold text-sm">
                                  {item.points} pts
                                </span>
                                <span className="text-xs text-gray-500">{item.size}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow hover:shadow-md"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow hover:shadow-md"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(featuredItems.length / 3) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How ReWear Works</h2>
            <p className="text-gray-600">Getting started is easy. Just follow these steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'List Your Items',
                description: 'Upload photos and details of clothes you no longer wear.',
              },
              {
                step: 2,
                title: 'Browse & Request',
                description: 'Explore items from other members and request swaps.',
              },
              {
                step: 3,
                title: 'Swap & Enjoy',
                description: 'Coordinate with members and give your new-to-you clothes a loving home.',
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full text-lg font-bold mb-3">
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-emerald-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Make a Difference?
          </h2>
          <p className="text-emerald-100 text-lg mb-6">
            Join ReWear and help build a more sustainable future, one swap at a time.
          </p>
          <Link
            to="/signup"
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full text-lg font-semibold transition-all"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;