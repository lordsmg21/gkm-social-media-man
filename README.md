# GKM Portal - Optimized Structure

## 🏗️ Project Architecture

### Directory Structure
```
src/
├── components/
│   ├── layout/              # Layout components (Sidebar, NotificationCenter)
│   ├── views/               # Main view components (Dashboard, Messages, etc.)
│   ├── modals/              # Modal components (CreateTaskModal, etc.)
│   ├── shared/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   └── index.ts             # Component exports
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Authentication management
│   ├── useProjects.ts       # Projects & tasks management
│   ├── useMessages.ts       # Messaging system
│   ├── useFileUpload.ts     # File management
│   ├── useNotifications.ts  # Notification system
│   ├── useUserManagement.ts # User & client management
│   └── index.ts             # Hook exports
├── types/                   # TypeScript type definitions
│   └── index.ts             # All interfaces and types
├── lib/                     # Utilities and constants
│   ├── utils.ts             # Utility functions
│   └── constants.ts         # App constants
└── assets/                  # Static assets
    ├── images/
    ├── video/
    ├── audio/
    └── documents/
```

## 📦 Core Components

### Layout Components (`/components/layout/`)
- **Sidebar**: Main navigation with glassmorphism theme
- **NotificationCenter**: Real-time notification panel

### View Components (`/components/views/`)
- **Dashboard**: KPI cards and analytics
- **Messages**: Team communication system
- **Projects**: Kanban board with task management
- **CalendarView**: Google Calendar integration
- **FileManager**: File upload/preview system
- **BillingView**: Invoice management
- **SettingsView**: User preferences & management
- **LoginView**: Authentication interface

### Modal Components (`/components/modals/`)
- **CreateTaskModal**: Task creation form
- **CreateProjectModal**: Project creation form

## 🎣 Custom Hooks

### Authentication (`useAuth`)
```typescript
const { currentUser, login, logout, updateUser, isAdmin, isClient } = useAuth()
```

### Projects & Tasks (`useTasks`, `useProjects`)
```typescript
const { tasks, addTask, updateTask, deleteTask } = useTasks()
const { projects, addProject, deleteProject } = useProjects()
```

### Messaging (`useMessages`)
```typescript
const { messages, sendMessage, createConversation } = useMessages()
```

### File Management (`useFileUpload`)
```typescript
const { files, uploadFile, deleteFile, getFilesByUser } = useFileUpload()
```

### Notifications (`useNotifications`)
```typescript
const { addNotification, getUserNotifications, markAsRead } = useNotifications()
```

### User Management (`useUserManagement`)
```typescript
const { users, addUser, getClientUsers, updateClientData } = useUserManagement()
```

## 🎨 Design System

### Glassmorphism Theme
- **Primary Color**: GKM Gold/Orange gradient
- **Background**: Semi-transparent cards with backdrop blur
- **Consistency**: Unified design language across components

### Component Organization
- Centralized exports via index files
- Consistent import patterns
- Type-safe interfaces

## 🔧 Optimizations Implemented

1. **Modular Architecture**: Components organized by function
2. **Custom Hooks**: Business logic separated from UI
3. **Type Safety**: Centralized TypeScript definitions
4. **Reusable Utilities**: Common functions in utils library
5. **Constants Management**: Centralized configuration
6. **Clean Imports**: Index files for organized imports
7. **Performance**: Optimized state management with useKV hooks

## 🚀 Usage Examples

### Adding New Features
```typescript
// Import optimized hooks and types
import { useTasks, useNotifications } from '@/hooks'
import type { Task } from '@/types'

// Use centralized business logic
const { addTask } = useTasks()
const { addNotification } = useNotifications()
```

### Component Organization
```typescript
// Clean imports from organized structure
import { 
  Dashboard, 
  Projects, 
  CreateTaskModal 
} from '@/components'
```

This optimized structure provides:
- ✅ Better maintainability
- ✅ Improved code reusability
- ✅ Type safety throughout
- ✅ Consistent patterns
- ✅ Easier testing and debugging
- ✅ Scalable architecture for future features