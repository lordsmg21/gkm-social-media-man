# GKM Portal - Social Media Management Platform

**Complete social media management portal for agencies and clients with role-based access, real-time collaboration, and comprehensive project tracking.**

**Experience Qualities**:
1. **Professional** - Clean, business-focused interface that instills confidence and trust
2. **Intuitive** - Streamlined workflows that reduce cognitive load and increase productivity  
3. **Collaborative** - Seamless communication tools that bridge the gap between teams and clients

**Complexity Level**: Complex Application (advanced functionality, accounts)
Multi-user platform with role-based permissions, real-time features, file management, and comprehensive business logic for social media project management.

## Essential Features

### Dashboard & Analytics
- **Functionality**: KPI tracking dashboard with business and social media metrics
- **Purpose**: Central command center for monitoring performance and business health
- **Trigger**: User login or navigation to home
- **Progression**: Login → Dashboard load → View KPI cards → Interact with charts → Navigate to details
- **Success criteria**: All metrics display correctly, charts are interactive, data updates in real-time

### Role-Based Access Control
- **Functionality**: Admin (full access) and Client (limited to own projects) user roles
- **Purpose**: Secure access control and appropriate feature visibility per user type
- **Trigger**: User authentication
- **Progression**: Login → Role detection → Permission-based UI rendering → Feature access control
- **Success criteria**: Users only see authorized content, all actions respect role permissions

### Project Board Management
- **Functionality**: Kanban-style project boards with drag-and-drop functionality
- **Purpose**: Visual project tracking from conception to completion
- **Trigger**: Navigate to My Projects
- **Progression**: Projects page load → Board view → Drag tasks between columns → Auto-save → Real-time updates
- **Success criteria**: Tasks move smoothly, changes persist, other users see updates immediately

### Real-Time Messaging
- **Functionality**: Direct 1-on-1 messaging between admins and clients
- **Purpose**: Streamlined communication without external tools
- **Trigger**: Click on Messages or start new conversation
- **Progression**: Messages page → Select conversation → Type message → Send → Real-time delivery → Read receipts
- **Success criteria**: Messages deliver instantly, typing indicators work, read status updates

### Task Management System
- **Functionality**: Complete task lifecycle with 3-step creation workflow and detailed modals
- **Purpose**: Comprehensive project organization and tracking
- **Trigger**: Create new task or click existing task card
- **Progression**: Task creation → Step-by-step form → Team assignment → Task detail view → Progress tracking
- **Success criteria**: Tasks contain all necessary information, team members receive notifications

### File Management & Sharing
- **Functionality**: Drag-and-drop file uploads with in-app preview and role-based permissions
- **Purpose**: Centralized asset management and client deliverable sharing
- **Trigger**: Upload files or access file browser
- **Progression**: File selection → Upload progress → Preview generation → Permission assignment → Sharing
- **Success criteria**: Files upload reliably, previews work for all supported formats, permissions enforced

### Calendar Integration
- **Functionality**: Interactive calendar with event management and Google Calendar sync
- **Purpose**: Deadline tracking and meeting coordination
- **Trigger**: Navigate to calendar or click date picker
- **Progression**: Calendar view → Click date → Create event → Set details → Save → Sync with external calendars
- **Success criteria**: Events display correctly, external sync works, reminders trigger appropriately

## Edge Case Handling

- **Offline Mode**: Cache critical data and queue actions for when connection returns
- **Large File Uploads**: Progress indicators, resume capability, and clear size limits (200MB)
- **Concurrent Editing**: Lock mechanism for tasks being edited by multiple users
- **Role Changes**: Immediate UI updates when user permissions change
- **Network Failures**: Graceful degradation with retry mechanisms and error messages
- **Mobile Touch Interactions**: Optimized drag-and-drop for touch devices

## Design Direction

The design should feel premium and professional with a modern glassmorphism aesthetic that conveys innovation while maintaining business credibility. Rich interface with selective glass effects on cards and modals, creating depth and sophistication without overwhelming the user experience.

## Color Selection

Custom palette using GKM's signature gold-orange branding with professional contrasts.

- **Primary Color**: Warm Orange `oklch(0.70 0.15 60)` - Represents energy, creativity, and GKM brand identity
- **Secondary Colors**: Deep Charcoal `oklch(0.25 0.02 240)` for professional grounding, Soft Gold `oklch(0.85 0.08 80)` for premium touches
- **Accent Color**: Vibrant Orange `oklch(0.75 0.20 50)` for CTAs and important interactive elements
- **Foreground/Background Pairings**: 
  - Background (Soft White #FAFAFA): Charcoal text `oklch(0.25 0.02 240)` - Ratio 12.8:1 ✓
  - Card (Glass White #FFFFFF90): Charcoal text `oklch(0.25 0.02 240)` - Ratio 10.2:1 ✓
  - Primary (Warm Orange): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Accent (Vibrant Orange): White text `oklch(1 0 0)` - Ratio 5.2:1 ✓

## Font Selection

Typography should convey modern professionalism with clear hierarchy for complex business information.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Poppins Bold/32px/tight letter spacing
  - H2 (Section Headers): Poppins SemiBold/24px/normal spacing  
  - H3 (Card Titles): Poppins Medium/18px/normal spacing
  - Body (Content): Inter Regular/16px/relaxed line height
  - Small (Metadata): Inter Regular/14px/tight line height
  - Button Text: Inter SemiBold/16px/normal spacing

## Animations

Subtle and purposeful animations that enhance usability without creating distraction, focusing on smooth state transitions and micro-interactions that provide clear feedback.

- **Purposeful Meaning**: Motion communicates professional efficiency and guides attention to important actions
- **Hierarchy of Movement**: Task drag-and-drop, modal transitions, and hover states receive animation priority

## Component Selection

- **Components**: Dialog for task details, Card for project/KPI displays, Sheet for mobile navigation, Tabs for dashboard sections, Form for task creation workflow, Table for file listings, Calendar for scheduling, Avatar for team member display, Badge for task status, Progress for upload/completion tracking
- **Customizations**: Glassmorphism Card variant with backdrop-blur and subtle borders, Custom KanbanBoard component for drag-and-drop, Enhanced FileUpload with preview capabilities, RealTimeChat component with typing indicators
- **States**: Interactive elements use consistent hover (scale-105), active (scale-95), focus (ring-2 ring-primary), disabled (opacity-50) states
- **Icon Selection**: Lucide React icons with orange accent colors - MessageSquare for chat, FolderOpen for files, Calendar for scheduling, Users for team, BarChart for analytics, Settings for preferences
- **Spacing**: Consistent padding (p-4, p-6, p-8) and margin (space-y-4, gap-6) using Tailwind's spacing scale
- **Mobile**: Responsive grid layouts (grid-cols-1 md:grid-cols-2 xl:grid-cols-4), collapsible sidebar, touch-optimized drag handles, bottom sheet navigation for mobile-first progressive enhancement