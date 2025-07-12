import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, MapPin, Calendar, Star, User, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: appState, requestSwap, deleteItem } = useApp();
  const { state: authState, updatePoints } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const item = appState.items.find(item => item.id === id);
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/browse" className="text-emerald-600 hover:text-emerald-700">Browse all items</Link>
        </div>
      </div>
    );
  }
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  const handleRequestSwap = () => {
    if (!authState.isAuthenticated) return;
    requestSwap(item.id, authState.user!.id, authState.user!.name, swapMessage);
    setShowSwapModal(false);
    setSwapMessage('');
    alert('Swap request sent successfully!');
  };
  const handleRedeemWithPoints = () => {
    if (!authState.isAuthenticated || !item.points) return;
    if (authState.user!.points >= item.points) {
      updatePoints(authState.user!.points - item.points);
      alert(`Successfully redeemed ${item.title} for ${item.points} points!`);
    } else {
      alert('Insufficient points to redeem this item.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Browse
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />
              {item.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
            {/* Thumbnail Navigation */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-emerald-500' : 'border-gray-200'}`}
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status === 'available' ? 'Available' : 'Under Review'}</span>
                    {item.points && (<span className="text-xl font-bold text-emerald-600">{item.points} pts</span>)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setIsLiked(!isLiked)} className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /></button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><Share2 className="h-5 w-5" /></button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">{item.description}</p>
              {/* Item Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Details</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium">{item.category}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-medium">{item.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Size:</span><span className="font-medium">{item.size}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Condition:</span><span className="font-medium">{item.condition}</span></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Uploader Info */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><User className="h-5 w-5 text-emerald-600" /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.uploaderName}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />4.8 rating</div>
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />Listed {item.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                  {authState.isAuthenticated && authState.user?.id === item.uploaderId && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                          deleteItem(item.id);
                          navigate('/dashboard');
                        }
                      }}
                      className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="space-y-3">
                {item.status === 'available' && authState.isAuthenticated && (
                  <>
                    <button onClick={() => setShowSwapModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold transition-colors">Request Swap</button>
                    {item.points && (<button onClick={handleRedeemWithPoints} className="w-full bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 px-6 rounded-full font-semibold transition-colors">Redeem for {item.points} pts</button>)}
                  </>
                )}
                {!authState.isAuthenticated && (
                  <Link to="/login" className="w-full block bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-semibold text-center transition-colors">Sign in to swap</Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Swap Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto relative">
              <button onClick={() => setShowSwapModal(false)} className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200"><X className="h-5 w-5 text-gray-500" /></button>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Swap</h2>
              <p className="text-gray-600 mb-4 text-sm">Send a message to the owner (optional):</p>
              <textarea value={swapMessage} onChange={e => setSwapMessage(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-4 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Hi! I'm interested in swapping for this item..." />
              <button onClick={handleRequestSwap} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-full font-semibold transition-colors">Send Request</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;