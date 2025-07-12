import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  status: 'available' | 'pending' | 'swapped' | 'under_review';
  points?: number;
  createdAt: Date;
  approvedAt?: Date;
}

export interface SwapRequest {
  id: string;
  itemId: string;
  requesterId: string;
  requesterName: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  createdAt: Date;
  message?: string;
}

interface AppState {
  items: ClothingItem[];
  swapRequests: SwapRequest[];
  loading: boolean;
}

interface AppAction {
  type: 'SET_ITEMS' | 'ADD_ITEM' | 'UPDATE_ITEM' | 'SET_LOADING' | 'ADD_SWAP_REQUEST' | 'UPDATE_SWAP_REQUEST' | 'DELETE_ITEM';
  payload?: any;
}

const AppContext = createContext<{
  state: AppState;
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  updateItemStatus: (itemId: string, status: ClothingItem['status']) => void;
  requestSwap: (itemId: string, requesterId: string, requesterName: string, message?: string) => void;
  approveItem: (itemId: string) => void;
  rejectItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  approveSwapRequest: (requestId: string) => void;
  declineSwapRequest: (requestId: string) => void;
} | null>(null);

// Sample users
const mockUsers = [
  {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    points: 120,
    isAdmin: false,
  },
  {
    id: 'u2',
    name: 'Emma Davis',
    email: 'emma@example.com',
    points: 95,
    isAdmin: false,
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@rewear.com',
    points: 200,
    isAdmin: true,
  },
];
// Mock data for demonstration
const mockItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for casual wear.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Excellent',
    tags: ['vintage', 'denim', 'casual'],
    images: [
      'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg'
    ],
    uploaderId: 'u1',
    uploaderName: 'Sarah Johnson',
    status: 'available',
    points: 75,
    createdAt: new Date('2024-01-15'),
    approvedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    title: 'Floral Summer Dress',
    description: 'Beautiful floral print dress, perfect for summer occasions.',
    category: 'Dresses',
    type: 'Casual Dress',
    size: 'S',
    condition: 'Good',
    tags: ['floral', 'summer', 'casual'],
    images: [
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
      'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg'
    ],
    uploaderId: 'u2',
    uploaderName: 'Emma Davis',
    status: 'available',
    points: 60,
    createdAt: new Date('2024-01-20'),
    approvedAt: new Date('2024-01-21')
  },
  {
    id: '3',
    title: 'Leather Boots',
    description: 'Genuine leather boots, worn only a few times.',
    category: 'Shoes',
    type: 'Boots',
    size: '9',
    condition: 'Like New',
    tags: ['leather', 'boots', 'formal'],
    images: [
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
    ],
    uploaderId: 'admin1',
    uploaderName: 'Admin User',
    status: 'available',
    points: 90,
    createdAt: new Date('2024-01-25'),
    approvedAt: new Date('2024-01-26')
  }
];

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_SWAP_REQUEST':
      return { ...state, swapRequests: [...state.swapRequests, action.payload] };
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? { ...request, ...action.payload.updates } : request
        )
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    items: mockItems,
    swapRequests: [],
    loading: false,
  });

  const addItem = (itemData: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'under_review', // Items start in review status
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const updateItemStatus = (itemId: string, status: ClothingItem['status']) => {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: { id: itemId, updates: { status } }
    });
  };

  const requestSwap = (itemId: string, requesterId: string, requesterName: string, message?: string) => {
    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      itemId,
      requesterId,
      requesterName,
      status: 'pending',
      createdAt: new Date(),
      message,
    };
    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newRequest });
  };

  const approveItem = (itemId: string) => {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        id: itemId,
        updates: {
          status: 'available',
          approvedAt: new Date()
        }
      }
    });
  };

  const rejectItem = (itemId: string) => {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        id: itemId,
        updates: { status: 'pending' }
      }
    });
  };

  const deleteItem = (itemId: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  };

  // Approve a swap request and mark item as swapped
  const approveSwapRequest = (requestId: string) => {
    const request = state.swapRequests.find(r => r.id === requestId);
    if (!request) return;
    // Mark request as approved
    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { id: requestId, updates: { status: 'approved' } }
    });
    // Mark item as swapped
    dispatch({
      type: 'UPDATE_ITEM',
      payload: { id: request.itemId, updates: { status: 'swapped' } }
    });
  };

  // Decline a swap request
  const declineSwapRequest = (requestId: string) => {
    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { id: requestId, updates: { status: 'declined' } }
    });
  };

  return (
    <AppContext.Provider value={{
      state,
      addItem,
      updateItemStatus,
      requestSwap,
      approveItem,
      rejectItem,
      deleteItem,
      approveSwapRequest, // <-- new
      declineSwapRequest, // <-- new
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};