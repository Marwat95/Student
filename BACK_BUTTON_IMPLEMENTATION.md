# Back Button Implementation Guide

This document explains how to add the back button component to pages in the platform.

## Shared Back Button Component

A reusable back button component has been created at:
- Component: `src/app/components/shared/back-button/back-button.ts`
- Styles: `src/app/components/shared/back-button/back-button.scss`

The component uses Angular's Location service to navigate back in the browser history without refreshing the entire platform.

## How to Add Back Button to a Page

### 1. Import the Component

Add the BackButton import to your component's TypeScript file:

```typescript
import { BackButton } from '../../shared/back-button/back-button';
```

### 2. Add to Imports Array

Include BackButton in the component's imports array:

```typescript
@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [CommonModule, BackButton], // Add BackButton here
  templateUrl: './your-component.html',
  styleUrl: './your-component.scss',
})
```

### 3. Add to Template

Add the back button to your HTML template:

```html
<!-- Back Button -->
<div class="back-button-container">
  <app-back-button></app-back-button>
</div>
```

### 4. Add Styles (if needed)

Add styling for the back button container in your component's SCSS file:

```scss
.back-button-container {
  margin-bottom: 1.5rem;
}
```

## Customization Options

The back button component accepts two optional inputs:

- `text`: Custom text for the button (defaults to "Back")
- `ariaLabel`: Custom accessibility label (defaults to "Go back to previous page")

Example with custom text:
```html
<app-back-button text="Return to Dashboard" ariaLabel="Return to dashboard"></app-back-button>
```

## Pages with Back Button Already Implemented

1. Student Profile Page (`src/app/components/student/profile/`)
2. Student My Courses Page (`src/app/components/student/my-courses/`)
3. Instructor My Courses Page (`src/app/components/instructor/my-courses/`)

## Benefits

- Uses browser history navigation (no full page refresh)
- Consistent styling across the platform
- Accessible with proper ARIA labels
- Responsive design
- Easy to implement on any page