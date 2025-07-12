import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Browse: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const availableItems = state.items.filter(item => item.status === 'available');
  const categories = [...new Set(availableItems.map(item => item.category))];
  const sizes = [...new Set(availableItems.map(item => item.size))];
  const conditions = [...new Set(availableItems.map(item => item.condition))];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = availableItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSize = !selectedSize || item.size === selectedSize;
      const matchesCondition = !selectedCondition || item.condition === selectedCondition;
      return matchesSearch && matchesCategory && matchesSize && matchesCondition;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'points-low':
          return (a.points || 0) - (b.points || 0);
        case 'points-high':
          return (b.points || 0) - (a.points || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    return filtered;
  }, [availableItems, searchTerm, selectedCategory, selectedSize, selectedCondition, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedCondition('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Items</h1>
          <p className="text-gray-600 text-sm">Discover amazing pieces from our community. {filteredAndSortedItems.length} items available.</p>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors lg:hidden text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />Filters
            </button>
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Filters */}
          <div className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="">All Conditions</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="points-low">Points: Low to High</option>
              <option value="points-high">Points: High to Low</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          {/* Active Filters */}
          {(searchTerm || selectedCategory || selectedSize || selectedCondition) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">Search: "{searchTerm}"</span>
              )}
              {selectedCategory && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">{selectedCategory}</span>
              )}
              {selectedSize && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">Size: {selectedSize}</span>
              )}
              {selectedCondition && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">{selectedCondition}</span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        {/* Items Grid/List */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-600 mb-2">No items found</div>
            <div className="mb-4 text-xs text-gray-400">Try adjusting your search or filter criteria.</div>
            <button
              onClick={clearFilters}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-xs"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredAndSortedItems.map((item) => (
              viewMode === 'grid' ? (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow group overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden rounded-t-2xl">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 text-base">
                        {item.title}
                      </h3>
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-600 font-semibold text-xs">{item.points} pts</span>
                      <span className="text-xs text-gray-500">{item.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{item.uploaderName}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow group flex items-center gap-4 p-4"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex gap-2 items-center mb-1">
                      <span className="text-emerald-600 font-semibold text-xs">{item.points} pts</span>
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <span className="text-xs text-gray-500">{item.uploaderName}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">4.8</span>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;