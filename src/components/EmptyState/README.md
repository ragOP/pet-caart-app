# EmptyState Component

A reusable empty state component with dynamic icons and text that can be used across the project.

## Features

- ✅ **Dynamic Icons** - Use any Lucide React Native icon
- ✅ **Customizable Text** - Title, subtitle, and action text
- ✅ **Action Button** - Optional call-to-action button
- ✅ **Loading States** - Show loading indicator on action button
- ✅ **Pull-to-Refresh** - Built-in refresh functionality
- ✅ **Predefined Configs** - Common empty state scenarios
- ✅ **Customizable Styling** - Override any style prop
- ✅ **Responsive Design** - Works on all screen sizes

## Basic Usage

```jsx
import { EmptyState, EMPTY_STATE_CONFIGS } from '../components/EmptyState';

// Using predefined config
<EmptyState
  icon={EMPTY_STATE_CONFIGS.NO_PRODUCTS.icon}
  title="No Products Found"
  subtitle="We couldn't find any products matching your criteria."
  actionText="Browse All"
  onAction={() => navigation.navigate('Products')}
/>
```

## Advanced Usage

```jsx
import { EmptyState, getEmptyStateConfig } from '../components/EmptyState';
import { Package } from 'lucide-react-native';

// Custom configuration
const customConfig = getEmptyStateConfig('NO_PRODUCTS', {
  title: 'No Items in Cart',
  subtitle: 'Your cart is empty. Add some products to get started!',
  actionText: 'Shop Now',
});

<EmptyState
  {...customConfig}
  icon={Package}
  onAction={() => navigation.navigate('Home')}
  iconSize={100}
  iconColor="#F4A300"
  containerStyle={{ backgroundColor: '#f8f9fa' }}
/>
```

## Refresh Functionality

### With Pull-to-Refresh
```jsx
import { ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';

const MyComponent = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchMyData,
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#F4A300']}
            tintColor="#F4A300"
          />
        }
      >
        <EmptyState
          icon={EMPTY_STATE_CONFIGS.LOADING.icon}
          title="Loading..."
          subtitle="Please wait while we fetch your data."
          iconColor="#F4A300"
        />
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={['#F4A300']}
            tintColor="#F4A300"
          />
        }
      >
        <EmptyState
          icon={EMPTY_STATE_CONFIGS.ERROR.icon}
          title="Failed to Load Data"
          subtitle="We couldn't load the data. Please try again."
          actionText="Retry"
          onAction={handleRefresh}
          isLoading={isRefetching}
          iconColor="#FF6B6B"
        />
      </ScrollView>
    );
  }

  // Your content here
};
```

### With Loading State on Action Button
```jsx
const [isRefreshing, setIsRefreshing] = useState(false);

const handleRefresh = async () => {
  setIsRefreshing(true);
  try {
    await refetch();
  } finally {
    setIsRefreshing(false);
  }
};

<EmptyState
  icon={EMPTY_STATE_CONFIGS.ERROR.icon}
  title="Something Went Wrong"
  subtitle="We encountered an error. Please try again."
  actionText="Retry"
  onAction={handleRefresh}
  isLoading={isRefreshing}
  iconColor="#FF6B6B"
/>
```

## Predefined Configurations

### Data States
- `NO_CATEGORIES` - No categories available
- `NO_PRODUCTS` - No products found
- `NO_ORDERS` - No orders yet
- `NO_FAVORITES` - No favorites yet
- `NO_ADDRESSES` - No addresses saved
- `NO_CART_ITEMS` - Empty cart

### Search States
- `NO_SEARCH_RESULTS` - No search results found

### Network States
- `NO_INTERNET` - No internet connection
- `ERROR` - General error state

### Profile States
- `NO_PROFILE` - Profile not found

### Content States
- `NO_CONTENT` - No content available
- `NO_IMAGES` - No images available

### Loading States
- `LOADING` - Loading state with spinner icon

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | LucideIcon | - | Icon component to display |
| `title` | string | - | Main title text |
| `subtitle` | string | - | Subtitle text (optional) |
| `actionText` | string | - | Action button text (optional) |
| `onAction` | function | - | Action button callback (optional) |
| `iconSize` | number | 80 | Size of the icon |
| `iconColor` | string | '#AAB2BD' | Color of the icon |
| `isLoading` | boolean | false | Show loading state on action button |
| `containerStyle` | StyleSheet | - | Custom container styles |
| `titleStyle` | StyleSheet | - | Custom title styles |
| `subtitleStyle` | StyleSheet | - | Custom subtitle styles |
| `actionStyle` | StyleSheet | - | Custom action button styles |

## Examples

### Loading State
```jsx
<EmptyState
  icon={EMPTY_STATE_CONFIGS.LOADING.icon}
  title="Loading Categories..."
  subtitle="Please wait while we fetch the latest categories for you."
  iconColor="#F4A300"
/>
```

### Error State with Retry
```jsx
<EmptyState
  icon={EMPTY_STATE_CONFIGS.ERROR.icon}
  title="Failed to Load Categories"
  subtitle="We couldn't load the categories. Please check your connection and try again."
  actionText="Retry"
  onAction={() => refetch()}
  isLoading={isRefetching}
  iconColor="#FF6B6B"
/>
```

### Empty State with Action
```jsx
<EmptyState
  icon={EMPTY_STATE_CONFIGS.NO_ORDERS.icon}
  title="No Orders Yet"
  subtitle="You haven't placed any orders yet. Start shopping to see your orders here."
  actionText="Start Shopping"
  onAction={() => navigation.navigate('Home')}
/>
```

### Cart Empty State
```jsx
<EmptyState
  icon={EMPTY_STATE_CONFIGS.NO_CART_ITEMS.icon}
  title="Your Cart is Empty"
  subtitle="Add some products to your cart to get started!"
  actionText="Start Shopping"
  onAction={() => navigation.navigate('Products')}
/>
```

### Custom Styling
```jsx
<EmptyState
  icon={Heart}
  title="No Favorites"
  subtitle="You haven't added any items to your favorites yet."
  actionText="Explore Products"
  onAction={() => navigation.navigate('Products')}
  iconSize={100}
  iconColor="#FF6B6B"
  containerStyle={{ backgroundColor: '#f8f9fa' }}
  titleStyle={{ color: '#333', fontSize: 24 }}
  actionStyle={{ backgroundColor: '#FF6B6B' }}
/>
```

## Integration with TanStack Query

```jsx
import { useQuery } from '@tanstack/react-query';
import { EmptyState, EMPTY_STATE_CONFIGS } from '../components/EmptyState';

const MyComponent = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['myData'],
    queryFn: fetchMyData,
  });

  if (isLoading) {
    return (
      <EmptyState
        icon={EMPTY_STATE_CONFIGS.LOADING.icon}
        title="Loading..."
        subtitle="Please wait while we fetch your data."
        iconColor="#F4A300"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={EMPTY_STATE_CONFIGS.ERROR.icon}
        title="Failed to Load Data"
        subtitle="We couldn't load the data. Please try again."
        actionText="Retry"
        onAction={() => refetch()}
        isLoading={isRefetching}
        iconColor="#FF6B6B"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={EMPTY_STATE_CONFIGS.NO_PRODUCTS.icon}
        title="No Data Available"
        subtitle="We couldn't find any data at the moment."
        actionText="Refresh"
        onAction={() => refetch()}
        isLoading={isRefetching}
      />
    );
  }

  // Render your data here
  return <YourDataComponent data={data} />;
};
```

## Best Practices

1. **Use Appropriate Icons** - Choose icons that match the context
2. **Clear Messaging** - Write clear, actionable titles and subtitles
3. **Provide Actions** - Always include an action when possible
4. **Show Loading States** - Use `isLoading` prop for better UX
5. **Implement Pull-to-Refresh** - Wrap with ScrollView and RefreshControl
6. **Consistent Styling** - Use consistent colors and fonts
7. **Responsive Design** - Test on different screen sizes
8. **Error Handling** - Always handle loading, error, and empty states 