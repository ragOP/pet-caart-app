# CustomDialog Component

A beautiful, reusable dialog component built with React Native Paper that matches the PetCaart theme design.

## Features

- ✅ **Beautiful Design**: Modern, rounded corners with proper shadows
- ✅ **Icon Support**: Different icons for different dialog types
- ✅ **Type Variants**: Success, warning, error, and default types
- ✅ **Customizable**: Title, message, buttons, colors, loading state
- ✅ **PetCaart Theme**: Consistent colors and fonts
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Loading States**: Built-in loading indicators

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | - | Controls dialog visibility |
| `onDismiss` | function | - | Called when dialog is dismissed |
| `title` | string | - | Dialog title |
| `message` | string | - | Dialog message |
| `primaryButtonText` | string | 'OK' | Primary button text |
| `secondaryButtonText` | string | 'Cancel' | Secondary button text |
| `onPrimaryPress` | function | - | Called when primary button is pressed |
| `onSecondaryPress` | function | - | Called when secondary button is pressed |
| `primaryButtonColor` | string | '#f79e1b' | Primary button color |
| `secondaryButtonColor` | string | '#666' | Secondary button text color |
| `showSecondaryButton` | boolean | true | Whether to show secondary button |
| `loading` | boolean | false | Shows loading state on primary button |
| `children` | ReactNode | - | Custom content to render |
| `type` | string | 'default' | Dialog type: 'default', 'success', 'warning', 'error' |

## Dialog Types

### Default Dialog
```jsx
<CustomDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Information"
  message="This is a default dialog with info icon."
  type="default"
/>
```

### Success Dialog
```jsx
<CustomDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Success!"
  message="Your action was completed successfully."
  type="success"
  primaryButtonText="Great!"
/>
```

### Warning Dialog (Logout)
```jsx
<CustomDialog
  visible={showLogoutDialog}
  onDismiss={() => setShowLogoutDialog(false)}
  title="Logout"
  message="Are you sure you want to logout from your account?"
  type="warning"
  primaryButtonText="Logout"
  secondaryButtonText="Cancel"
  onPrimaryPress={handleLogout}
/>
```

### Error Dialog
```jsx
<CustomDialog
  visible={showErrorDialog}
  onDismiss={() => setShowErrorDialog(false)}
  title="Error"
  message="Something went wrong. Please try again."
  type="error"
  primaryButtonText="OK"
  showSecondaryButton={false}
/>
```

## Usage Examples

### Basic Confirmation
```jsx
import CustomDialog from '../../components/CustomDialog';

const [showDialog, setShowDialog] = useState(false);

<CustomDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  primaryButtonText="Yes"
  secondaryButtonText="No"
  onPrimaryPress={() => {
    console.log('Confirmed!');
  }}
/>
```

### Loading State
```jsx
<CustomDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Processing"
  message="Please wait while we process your request..."
  primaryButtonText="OK"
  showSecondaryButton={false}
  loading={true}
/>
```

### Custom Content
```jsx
<CustomDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Custom Content"
  primaryButtonText="Done"
  showSecondaryButton={false}
>
  <View style={{ alignItems: 'center', paddingVertical: 10 }}>
    <Text>Custom content goes here</Text>
    <Image source={require('../../assets/images/icon.png')} />
  </View>
</CustomDialog>
```

## Design Features

### **Visual Elements**
- **Rounded Corners**: 20px border radius for modern look
- **Shadows**: Subtle elevation with proper shadow effects
- **Icons**: Contextual icons for different dialog types
- **Color-coded Backgrounds**: Different background colors for each type

### **Typography**
- **Title**: Gotham-Rounded-Bold, 20px, centered
- **Message**: Gotham-Rounded-Medium, 16px, centered
- **Buttons**: Gotham-Rounded-Bold, 16px, no text transform

### **Color Scheme**
- **Primary Button**: `#f79e1b` (PetCaart orange)
- **Secondary Button**: `#666` (Gray)
- **Success**: Green theme with checkmark icon
- **Warning**: Orange theme with alert triangle
- **Error**: Red theme with X circle icon
- **Default**: PetCaart orange theme with info icon

### **Layout**
- **Icon Section**: Top section with colored background
- **Content Section**: Middle section with title and message
- **Actions Section**: Bottom section with buttons
- **Responsive**: Adapts to different screen sizes

## Integration

The component is already integrated into the ProfileScreen for logout confirmation with warning type. You can use it anywhere in the app by importing:

```jsx
import CustomDialog from '../../components/CustomDialog';
```

## Type Icons and Colors

| Type | Icon | Icon Color | Background Color |
|------|------|------------|------------------|
| `default` | Info | `#f79e1b` | `#FFF5E1` |
| `success` | CheckCircle | `#4CAF50` | `#E8F5E8` |
| `warning` | AlertTriangle | `#FF9800` | `#FFF3E0` |
| `error` | XCircle | `#F44336` | `#FFEBEE` | 