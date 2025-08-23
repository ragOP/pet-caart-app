import { 
  Package, 
  Search, 
  WifiOff, 
  AlertCircle, 
  Heart, 
  ShoppingCart, 
  User, 
  MapPin,
  FileText,
  Camera,
  RefreshCw
} from 'lucide-react-native';

export const EMPTY_STATE_CONFIGS = {
  // No data states
  NO_CATEGORIES: {
    icon: Package,
    title: 'No Categories Available',
    subtitle: 'We couldn\'t find any categories at the moment. Please try again later.',
    actionText: 'Refresh',
  },
  
  NO_PRODUCTS: {
    icon: Package,
    title: 'No Products Found',
    subtitle: 'We couldn\'t find any products matching your criteria.',
    actionText: 'Browse All',
  },
  
  NO_ORDERS: {
    icon: ShoppingCart,
    title: 'No Orders Yet',
    subtitle: 'You haven\'t placed any orders yet. Start shopping to see your orders here.',
    actionText: 'Start Shopping',
  },
  
  NO_FAVORITES: {
    icon: Heart,
    title: 'No Favorites Yet',
    subtitle: 'You haven\'t added any items to your favorites yet.',
    actionText: 'Explore Products',
  },
  
  NO_ADDRESSES: {
    icon: MapPin,
    title: 'No Addresses Saved',
    subtitle: 'You haven\'t saved any delivery addresses yet.',
    actionText: 'Add Address',
  },
  
  NO_CART_ITEMS: {
    icon: ShoppingCart,
    title: 'Your Cart is Empty',
    subtitle: 'Add some products to your cart to get started!',
    actionText: 'Start Shopping',
  },
  
  // Search states
  NO_SEARCH_RESULTS: {
    icon: Search,
    title: 'No Results Found',
    subtitle: 'We couldn\'t find anything matching your search. Try different keywords.',
    actionText: 'Clear Search',
  },
  
  // Network states
  NO_INTERNET: {
    icon: WifiOff,
    title: 'No Internet Connection',
    subtitle: 'Please check your internet connection and try again.',
    actionText: 'Retry',
  },
  
  // Error states
  ERROR: {
    icon: AlertCircle,
    title: 'Something Went Wrong',
    subtitle: 'We encountered an error. Please try again.',
    actionText: 'Try Again',
  },
  
  // Profile states
  NO_PROFILE: {
    icon: User,
    title: 'Profile Not Found',
    subtitle: 'We couldn\'t load your profile information.',
    actionText: 'Refresh',
  },
  
  // Content states
  NO_CONTENT: {
    icon: FileText,
    title: 'No Content Available',
    subtitle: 'There\'s no content to display at the moment.',
    actionText: 'Refresh',
  },
  
  // Media states
  NO_IMAGES: {
    icon: Camera,
    title: 'No Images Available',
    subtitle: 'No images found for this item.',
  },
  
  // Loading states
  LOADING: {
    icon: RefreshCw,
    title: 'Loading...',
    subtitle: 'Please wait while we fetch the data.',
  },
  
  // Custom states
  CUSTOM: {
    icon: Package,
    title: '',
    subtitle: '',
  },
};

// Helper function to get empty state config
export const getEmptyStateConfig = (type, customConfig = {}) => {
  const baseConfig = EMPTY_STATE_CONFIGS[type] || EMPTY_STATE_CONFIGS.CUSTOM;
  return { ...baseConfig, ...customConfig };
}; 