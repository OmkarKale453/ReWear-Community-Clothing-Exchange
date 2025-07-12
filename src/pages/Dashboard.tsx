import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, ArrowUpDown, Star, User, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: appState, deleteItem, approveSwapRequest, declineSwapRequest } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'swaps'>('overview');

  const userItems = appState.items.filter(item => item.uploaderId === authState.user?.id);
  const userSwapRequests = appState.swapRequests.filter(request => request.requesterId === authState.user?.id);
  // Swap requests received for user's items
  const receivedSwapRequests = appState.swapRequests.filter(request => {
    const item = appState.items.find(i => i.id === request.itemId);
    return item && item.uploaderId === authState.user?.id;
  });

  const stats = [
    {
      label: 'Listed Items',
      value: userItems.length,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Swaps',
      value: userSwapRequests.filter(request => request.status === 'pending').length,
      icon: ArrowUpDown,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Points Balance',
      value: authState.user?.points || 0,
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {authState.user?.name}!</h1>
            <p className="text-gray-600 text-sm">Manage your items and swaps.</p>
          </div>
          <Link
            to="/add-item"
            className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition"
          >
            <Plus className="h-5 w-5 mr-2" />Add Item
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
              <div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'items', label: 'My Items', icon: Package },
                { id: 'swaps', label: 'Swap History', icon: ArrowUpDown },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />{tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{authState.user?.name}</h4>
                    <div className="text-gray-600 text-sm">{authState.user?.email}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">{authState.user?.points} pts</span>
                    </div>
                  </div>
                  <button className="flex items-center px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition text-sm">
                    <Edit2 className="h-4 w-4 mr-2" />Edit
                  </button>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Items</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {userItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow transition p-3 flex flex-col gap-2">
                        <img src={item.images[0]} alt={item.title} className="w-full h-28 object-cover rounded-lg" />
                        <div className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.status.replace('_', ' ')}</div>
                      </div>
                    ))}
                    {userItems.length === 0 && <div className="text-gray-400 text-sm">No items yet</div>}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-semibold text-gray-900">Your Items</h3>
                  <Link
                    to="/add-item"
                    className="inline-flex items-center px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />Add
                  </Link>
                </div>
                {userItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <div className="text-gray-600 mb-2">No items listed yet</div>
                    <Link
                      to="/add-item"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition"
                    >
                      <Plus className="h-4 w-4 mr-2" />Add Item
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userItems.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow transition p-4 flex flex-col gap-2">
                        <img src={item.images[0]} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</div>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{item.status.replace('_', ' ')}</span>
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                        <div className="flex justify-between items-center mt-2 gap-2">
                          <span className="text-emerald-600 font-semibold text-xs">{item.points} pts</span>
                          <div className="flex gap-2 items-center">
                            <Link to={`/item/${item.id}`} className="text-emerald-600 hover:underline text-xs">Details</Link>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this listing?')) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'swaps' && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Swap History</h3>
                {userSwapRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <ArrowUpDown className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <div className="text-gray-600 mb-2">No swaps yet</div>
                    <Link
                      to="/browse"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition"
                    >
                      Browse Items
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 mb-10">
                    {userSwapRequests.map((request) => {
                      const item = appState.items.find(i => i.id === request.itemId);
                      return (
                        <div key={request.id} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-white">
                          <img src={item?.images[0]} alt={item?.title} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">{item?.title}</div>
                            <div className="text-xs text-gray-500">Requested on {request.createdAt?.toLocaleDateString?.()}</div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{request.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Received Swap Requests Section */}
                <h3 className="text-base font-semibold text-gray-900 mb-4 mt-8">Received Swap Requests</h3>
                {receivedSwapRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">No swap requests for your items yet.</div>
                ) : (
                  <div className="space-y-4">
                    {receivedSwapRequests.map((request) => {
                      const item = appState.items.find(i => i.id === request.itemId);
                      if (!item) return null;
                      const isPending = request.status === 'pending' && item.status !== 'swapped';
                      return (
                        <div key={request.id} className="border border-emerald-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 bg-emerald-50">
                          <div className="flex items-center gap-4 flex-1">
                            <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                            <div>
                              <div className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</div>
                              <div className="text-xs text-gray-500 mb-1">Requested by <span className="font-semibold">{request.requesterName}</span></div>
                              {request.message && <div className="text-xs text-gray-700 italic mb-1">"{request.message}"</div>}
                              <div className="text-xs text-gray-500">Requested on {request.createdAt?.toLocaleDateString?.()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:flex-col md:items-end">
                            <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'approved' ? 'bg-green-100 text-green-800' : request.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{request.status}</span>
                            {isPending && (
                              <div className="flex gap-2 mt-2 md:mt-0">
                                <button
                                  onClick={() => approveSwapRequest(request.id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold hover:bg-green-700 transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => declineSwapRequest(request.id)}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;