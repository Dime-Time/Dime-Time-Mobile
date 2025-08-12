# Dime Time - Fintech Debt Reduction App

## Project Overview
Dime Time is an innovative fintech application that transforms debt reduction into an engaging, user-friendly experience, now featuring advanced sweep account integration with JP Morgan Chase and **full Replit-based user authentication**.

The application leverages automated financial tracking, micro-investment strategies, and round-up collection mechanisms to help users systematically reduce debt through small, consistent actions and intelligent fund management.

## Recent Changes (December 2024)

### Authentication Implementation ✓
- **Added Replit OpenID Connect Authentication**: Complete login/logout system with secure session management
- **Updated Database Schema**: Migrated from username/password auth to Replit auth with profile integration
- **Protected All API Routes**: All endpoints now require authentication and use actual user IDs
- **Landing Page**: Created beautiful landing page for unauthenticated users with feature highlights
- **Navigation Updates**: Added logout functionality and responsive authentication states

### Technical Architecture
- **Frontend**: React.js with TypeScript, Tailwind CSS, wouter routing
- **Backend**: Node.js Express with PostgreSQL database
- **Authentication**: Replit OpenID Connect with session storage
- **Database**: PostgreSQL with Drizzle ORM and proper user isolation
- **API Security**: All routes protected with isAuthenticated middleware

## User Preferences
- Clean, modern UI with focus on user experience
- Secure authentication flow without disrupting existing data
- Comprehensive error handling and user feedback
- Mobile-responsive design with intuitive navigation

## Project Architecture

### Authentication Flow
1. **Unauthenticated Users**: See landing page with login button
2. **Login Process**: Redirect to `/api/login` → Replit OAuth → callback → dashboard
3. **Authenticated State**: Full app access with user-specific data
4. **Logout Process**: `/api/logout` → Replit logout → landing page

### Database Schema
- **Users**: Replit-compatible schema (id, email, firstName, lastName, profileImageUrl)
- **Sessions**: PostgreSQL session storage for authentication persistence
- **All user data**: Properly isolated by authenticated user ID

### Security Features
- Session-based authentication with PostgreSQL storage
- CSRF protection and secure cookies
- All API endpoints protected with authentication middleware
- User data isolation and proper authorization checks

## Key Features Implemented
1. **Round-up Technology**: Automated spare change collection
2. **JP Morgan Integration**: Secure sweep accounts with competitive rates
3. **Smart Analytics**: Detailed insights and debt-free projections
4. **One-tap Payments**: Streamlined debt payment interface
5. **Crypto Integration**: Optional cryptocurrency micro-investments
6. **Secure Authentication**: Full user account management

## Next Steps
- User testing of authentication flow
- Error handling enhancements
- Production deployment considerations
- Additional security hardening if needed