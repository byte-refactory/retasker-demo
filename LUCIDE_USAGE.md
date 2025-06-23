# Lucide Icons Integration

This project uses [Lucide](https://lucide.dev) - a beautiful & consistent icon library.

## Installation ✅ 
Already installed: `lucide-react`

## Usage

### Import icons directly from lucide-react:
```tsx
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Plus size={16} />
      <Edit size={20} color="#666" />
      <Calendar size={24} className="my-icon-class" />
    </div>
  );
}
```

### Or use the common icons utility:
```tsx
import { Plus, Edit, Trash, Calendar } from '../utils/icons';
```

## Icon Props
- `size`: number (default: 24)
- `color`: string
- `strokeWidth`: number (default: 2)
- `className`: string
- All standard SVG props

## Examples Used in TaskCard
- `FileText` - Document/task icon
- `Calendar` - Date display
- `ExternalLink` - Attribution link

## Attribution ✅
Attribution component added to the app footer with link to Lucide.

## Available Icons
Over 1,000+ icons available at [lucide.dev](https://lucide.dev/icons/)

Common categories:
- **Actions**: Plus, Edit, Trash, Save, Check, X
- **Navigation**: ArrowLeft, ArrowRight, ChevronDown
- **Content**: FileText, Calendar, Clock, User
- **Status**: AlertCircle, CheckCircle, Info
- **UI**: Search, Filter, Settings, MoreHorizontal
