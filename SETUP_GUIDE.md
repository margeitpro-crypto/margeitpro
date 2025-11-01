# MargeItPro - Complete Setup Guide

## 🚀 Project Overview

MargeItPro एक powerful Google Sheets/Docs/Slides merge automation tool हो जसले:
- Google Sheets data लाई Google Docs/Slides templates मा merge गर्छ
- Firebase authentication र Firestore database use गर्छ
- Google Apps Script backend use गर्छ
- React + TypeScript + Tailwind CSS frontend

## 📋 Prerequisites

1. **Node.js** (v16 या नयाँ)
2. **Google Account** (Firebase र Google Apps Script को लागि)
3. **Firebase Project** (already configured)
4. **Google Apps Script Project** (already deployed)

## 🛠️ Installation Steps

### 1. Dependencies Install गर्नुहोस्

```bash
cd margeitpro-gas
npm install
```

### 2. Environment Variables Setup

`.env.local` file मा:
```
GEMINI_API_KEY=AIzaSyCjMKfSJXuJcMsbZjMjEgN_urHia3hNoCU
```

### 3. Development Server Start गर्नुहोस्

```bash
npm run dev
```

Application `http://localhost:3001` मा चल्नेछ।

## 🔧 How It Works

### 1. **Authentication Flow**
- Google OAuth login via Firebase Auth
- Admin email: `margeitpro@gmail.com` (automatic admin access)
- User data stored in Firestore

### 2. **Core Features**

#### A. **Merge Functionality**
- **Templates**: Google Docs/Slides templates with `{{ColumnName}}` placeholders
- **Data Source**: Google Sheets with headers matching placeholders
- **Merge Types**:
  - **Custom**: Individual file per row
  - **All-in-One**: Single file with all data

#### B. **User Roles**
- **Admin**: Full access to all features
- **User**: Limited access based on plan

#### C. **Billing System**
- **Free Plan**: 100 merges/month
- **Pro Plan**: $15/month, unlimited merges
- **Enterprise**: Custom pricing

### 3. **Technical Architecture**

```
Frontend (React) → Firebase Auth → Firestore DB
                ↓
Google Apps Script API → Google Drive/Docs/Sheets APIs
```

### 4. **File Structure**

```
margeitpro-gas/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API services (Firebase, GAS)
├── context/            # React context (Auth)
├── hooks/              # Custom React hooks
├── types.ts            # TypeScript definitions
└── code.gs             # Google Apps Script backend
```

## 🎯 Key Features

### 1. **Dashboard**
- User statistics
- Recent merge activity
- Quick actions

### 2. **Merge Interface**
- Template selection
- Data range configuration
- Preview functionality
- Batch processing

### 3. **Admin Panel**
- User management
- System analytics
- Payment tracking

### 4. **Billing System**
- Plan comparison
- Payment processing
- Usage tracking

## 🔐 Security Features

- Firebase Authentication
- Role-based access control
- Secure API endpoints
- Data validation

## 📱 Responsive Design

- Mobile-first approach
- Dark/Light theme support
- Facebook-inspired UI design
- Tailwind CSS styling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🔧 Configuration

### Firebase Config
- Already configured in `services/firebase.ts`
- Project ID: `margeitpro-ee747`

### Google Apps Script
- Deployed URL configured in `vite.config.ts`
- Handles merge operations and file generation

## 📊 Usage Analytics

The system tracks:
- Merge operations
- User activity
- Payment history
- System performance

## 🎨 UI/UX Features

- **Facebook-themed design**
- **Smooth animations**
- **Interactive components**
- **Responsive layout**
- **Dark mode support**

## 🔄 Data Flow

1. User logs in via Google OAuth
2. Selects template and data source
3. Configures merge parameters
4. System processes via Google Apps Script
5. Generated files stored in organized folders
6. User receives download links

## 📈 Scalability

- Firebase handles user management
- Google Apps Script processes merges
- Organized folder structure
- Efficient data processing

## 🛡️ Error Handling

- Comprehensive error messages
- Fallback mechanisms
- User-friendly notifications
- Logging for debugging

## 📞 Support

- Email: margeitpro@gmail.com
- In-app help documentation
- FAQ section
- Contact forms

यो project पूर्ण रूपमा functional छ र production-ready छ!