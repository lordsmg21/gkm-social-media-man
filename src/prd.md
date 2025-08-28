# GKM Portal - Product Requirements Document

## Core Purpose & Success
- **Mission Statement**: Provide a premium social media management portal for Gilton Karso Media (GKM) with glassmorphism design, serving admin team and clients.
- **Success Indicators**: Seamless project tracking, efficient team-client communication, streamlined file collaboration, and focused KPI monitoring (Started Conversations).
- **Experience Qualities**: Premium, Professional, Intuitive

## Project Classification & Approach
- **Complexity Level**: Complex Application (advanced functionality, user accounts, role-based permissions)
- **Primary User Activity**: Creating and Managing (project management and social media content)

## Essential Features

### Authentication & User Management
- Role-based authentication (Admin/Client)
- User profile management
- Permission-based access control

### Dashboard Analytics
- KPI tracking (Started Conversations primary metric)
- Social media metrics (Facebook/Instagram)
- Project progress visualization
- Real-time data updates

### Project & Task Management
- Board view with drag-and-drop functionality
- Role-specific columns and permissions
- File attachments to tasks
- Task mentions in chat system

### Communication System
- Direct messaging between team members
- Team chat with @mentions
- File sharing in conversations
- Real-time messaging

### File Management
- Role-based file access
- Drag & drop uploads
- In-app file preview
- Project-organized file structure

### Calendar Integration
- Project timeline visualization
- Google Calendar sync
- Event creation and management

### Settings & Administration
- User management (admin only)
- Client data management
- Notification preferences
- Billing/invoice management

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional confidence and premium quality
- **Design Personality**: Modern, elegant, and sophisticated
- **Visual Metaphors**: Glass surfaces suggesting transparency and clarity
- **Simplicity Spectrum**: Clean minimal interface with selective premium details

### Color Strategy
- **Color Scheme Type**: Monochromatic with gold/orange accent
- **Primary Color**: GKM Brand Gold/Orange (oklch(0.70 0.15 60))
- **Secondary Colors**: Neutral grays for backgrounds and borders
- **Accent Color**: Bright gold for CTAs and important actions
- **Color Psychology**: Gold conveys premium quality and success
- **Foreground/Background Pairings**: White text on primary, dark charcoal on light backgrounds

### Typography System
- **Font Pairing Strategy**: Inter for body text, Poppins for headings
- **Typographic Hierarchy**: Clear distinction between heading levels
- **Font Personality**: Clean, modern, and highly legible
- **Typography Consistency**: Consistent sizing and spacing system

### Visual Hierarchy & Layout
- **Attention Direction**: Primary gold color guides to important actions
- **White Space Philosophy**: Generous spacing for premium feel
- **Grid System**: Responsive grid adapting to all screen sizes
- **Content Density**: Balanced information with visual clarity

### Component Design
- **Glassmorphism Elements**: Cards, modals, and overlay components
- **Interactive States**: Subtle hover effects and transitions
- **Icon Usage**: Simple flat icons with single colors
- **Button Design**: Clean buttons with glassmorphism styling

## Current Status: Troubleshooting
**Issue**: Application showing blank/white screen in preview
**Diagnosis**: Fixed critical import errors in all components - User types were imported from wrong paths
**Resolution**: Updated all imports to use proper type imports from '@/types'

## Implementation Status
- ✅ Project structure and component organization
- ✅ Type definitions and interfaces
- ✅ Authentication system
- ✅ All major components created
- ❌ **CRITICAL**: Import path fixes applied, testing needed
- ✅ Glassmorphism styling system
- ✅ Responsive design implementation

## Next Steps
1. Test application startup after import fixes
2. Verify all components render correctly
3. Test user authentication flow
4. Validate data persistence with useKV hooks
5. Test file upload functionality
6. Verify real-time features work correctly