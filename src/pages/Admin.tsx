import React, { useState } from 'react';
import { Check, X, Eye, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Admin: React.FC = () => {
  const { state, approveItem, rejectItem } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const pendingItems = state.items.filter(item => item.status === 'under_review');
  const approvedItems = state.items.filter(item => item.status === 'available');
  const rejectedItems = state.items.filter(item => item.status === 'pending');

  const getCurrentItems = () => {
    let items;
    switch (activeTab) {
      case 'pending':
        items = pendingItems;
        break;
      case 'approved':
        items = approvedItems;
        break;
      case 'rejected':
        items = rejectedItems;
        break;
      default:
        items = pendingItems;
    }
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  };

  const handleApprove = (itemId: string) => {
    approveItem(itemId);
    setSelectedItem(null);
  };
  const handleReject = (itemId: string) => {
    rejectItem(itemId);
    setSelectedItem(null);
  };
  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
          <p className="text-gray-600 text-sm">Review and manage items submitted by the community.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600"><Clock className="h-6 w-6" /></div>
            <div>
              <div className="text-xs text-gray-500">Pending Review</div>
              <div className="text-xl font-bold text-gray-900">{pendingItems.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600"><CheckCircle className="h-6 w-6" /></div>
            <div>
              <div className="text-xs text-gray-500">Approved Items</div>
              <div className="text-xl font-bold text-gray-900">{approvedItems.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600"><XCircle className="h-6 w-6" /></div>
            <div>
              <div className="text-xs text-gray-500">Rejected Items</div>
              <div className="text-xl font-bold text-gray-900">{rejectedItems.length}</div>
            </div>
          </div>
        </div>
        {/* Tabs and Search */}
        <div className="bg-white rounded-2xl shadow overflow-hidden mb-6">
          <div className="border-b border-gray-100">
            <nav className="flex">
              {[
                { id: 'pending', label: 'Pending Review', count: pendingItems.length, icon: Clock },
                { id: 'approved', label: 'Approved', count: approvedItems.length, icon: CheckCircle },
                { id: 'rejected', label: 'Rejected', count: rejectedItems.length, icon: XCircle },
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
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items, uploaders, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Items List */}
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="text-gray-300 mb-4">
              {activeTab === 'pending' && <Clock className="h-10 w-10 mx-auto" />}
              {activeTab === 'approved' && <CheckCircle className="h-10 w-10 mx-auto" />}
              {activeTab === 'rejected' && <XCircle className="h-10 w-10 mx-auto" />}
            </div>
            <div className="text-gray-600 mb-2">
              {activeTab === 'pending' && 'No items pending review'}
              {activeTab === 'approved' && 'No approved items'}
              {activeTab === 'rejected' && 'No rejected items'}
            </div>
            <div className="text-xs text-gray-400">
              {searchTerm ? 'Try adjusting your search criteria' : 'Items will appear here as they are submitted'}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-4 items-center">
                <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <span className="text-emerald-600 font-semibold text-sm">{item.points} pts</span>
                  </div>
                  <div className="text-gray-600 text-xs mb-2 line-clamp-2">{item.description}</div>
                  <div className="flex flex-wrap gap-2 mb-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.uploaderName}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.category}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.size}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.condition}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">#{tag}</span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-xs"
                    >
                      <Eye className="h-4 w-4 mr-1" />{selectedItem === item.id ? 'Hide' : 'View'}
                    </button>
                    {activeTab === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-full transition-colors text-xs"
                        >
                          <X className="h-4 w-4 mr-1" />Reject
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-full transition-colors text-xs"
                        >
                          <Check className="h-4 w-4 mr-1" />Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;