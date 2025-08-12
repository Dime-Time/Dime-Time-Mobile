# Dime Time - Debt Management App

## Overview

Dime Time is a modern web application designed to help users manage their debt through an automated round-up payment system. The app tracks user transactions, rounds up purchases to the nearest dollar, and uses the spare change to make payments toward debts. Built with a React frontend and Express backend, it provides users with insights into their spending patterns, debt progress tracking, and automated debt reduction strategies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with minimal bundle size impact  
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui components for accessible, customizable design system
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Charts**: Chart.js for data visualization of debt progress and spending analytics
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the stack for consistency and type safety
- **Data Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Storage**: PostgreSQL database with Drizzle ORM and DatabaseStorage implementation for persistent data
- **API Design**: RESTful endpoints following convention with proper HTTP status codes and error handling

### Database Design
The schema includes four main entities:
- **Users**: Core user authentication and profile information
- **Debts**: Debt accounts with balance tracking, interest rates, and payment schedules
- **Transactions**: Purchase history with automatic round-up calculations
- **Payments**: Payment records linking round-ups to specific debts
- **Round-up Settings**: User preferences for automated payment behavior

### Key Features & Components
- **Round-up System**: Automatically calculates spare change from transactions and allocates to debt payments
- **Dashboard**: Real-time overview of total debt, progress tracking, and recent activity
- **Transaction Management**: Categorized spending with visual indicators and round-up amounts
- **Debt Tracking**: Individual debt progress with payment history and payoff projections  
- **Analytics**: Spending insights by category and debt reduction visualizations
- **Payment Processing**: Manual and automated payment capabilities with debt selection

### Development Environment
- **Hot Reload**: Vite development server with HMR for rapid iteration
- **Type Checking**: Comprehensive TypeScript configuration across client, server, and shared code
- **Path Aliases**: Simplified imports with @ prefixes for cleaner code organization
- **Error Handling**: Runtime error overlay integration for development debugging

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Modern TypeScript ORM for type-safe database operations
- **@tanstack/react-query**: Powerful data synchronization for server state management
- **wouter**: Minimalist routing library for React applications

### UI & Design System
- **@radix-ui/***: Complete set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Utility for creating consistent component variants
- **chart.js**: Canvas-based charting library for data visualization

### Development Tools
- **vite**: Next-generation frontend build tool with lightning-fast HMR
- **typescript**: Static type checking for JavaScript applications
- **drizzle-kit**: CLI companion for Drizzle ORM schema management and migrations
- **@replit/vite-plugin-***: Replit-specific development enhancements and debugging tools

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library for formatting and manipulation
- **zod**: TypeScript-first schema validation for runtime type checking
- **react-hook-form**: Performant forms library with minimal re-renders
- **lucide-react**: Beautiful & consistent icon set as React components