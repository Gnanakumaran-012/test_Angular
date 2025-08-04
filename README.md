# Auction Management System - Angular Frontend

A modern, responsive Angular frontend application for an online auction management system. This application provides a comprehensive platform for users to browse auctions, place bids, manage products, and handle seller operations.

## 🚀 Features

### User Features
- **Home Dashboard**: Featured auctions, ending soon items, and popular categories
- **Auction Browsing**: Search, filter, and browse auctions with real-time updates
- **Bidding System**: Place bids with instant feedback and notifications
- **Watchlist**: Save auctions to watchlist for easy tracking
- **User Dashboard**: Personal statistics, bid history, and activity tracking
- **Product Shopping**: Browse and purchase products from verified sellers

### Seller Features
- **Seller Portal**: Comprehensive dashboard for managing auctions and products
- **Auction Management**: Create, edit, and monitor auctions
- **Product Management**: Add, update, and manage product inventory
- **Analytics**: View sales statistics and performance metrics
- **Order Management**: Track orders and manage customer interactions

### Admin Features
- **Category Management**: Organize auctions and products by categories
- **User Management**: Monitor user activities and manage accounts
- **System Analytics**: Platform-wide statistics and insights

## 🛠️ Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material Design
- **Styling**: CSS3 with Flexbox/Grid
- **State Management**: RxJS Observables
- **HTTP Client**: Angular HttpClient
- **Notifications**: ngx-toastr
- **Icons**: Material Icons
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── auction-component/
│   │   ├── category-component/
│   │   ├── home-component/
│   │   ├── login-component/
│   │   ├── product-component/
│   │   ├── seller-component/
│   │   └── user-dashboard-component/
│   ├── pages/               # Page-level components
│   │   ├── home-page/
│   │   ├── login-page/
│   │   ├── auction-page/
│   │   ├── category-page/
│   │   ├── product-page/
│   │   ├── seller-page/
│   │   └── userdashboard-page/
│   └── services/            # Business logic and API calls
│       ├── auth.service.ts
│       ├── auction.service.ts
│       ├── category.service.ts
│       ├── product.service.ts
│       └── notification.service.ts
├── assets/                  # Static assets
└── styles.css              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Angular CLI (v17 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auction-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔧 Configuration

### Environment Variables
Create environment files in `src/environments/`:

- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

### API Configuration
Update the API base URL in services:
```typescript
private readonly API_URL = 'http://localhost:8080/api';
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Design System

### Color Palette
- **Primary**: #1976d2 (Blue)
- **Accent**: #ff6b6b (Coral)
- **Warn**: #f44336 (Red)
- **Success**: #4caf50 (Green)
- **Background**: #f5f5f5 (Light Gray)

### Typography
- **Font Family**: Roboto
- **Headings**: 700 weight
- **Body**: 400 weight
- **Captions**: 500 weight

## 🔐 Authentication

The application includes a complete authentication system:
- User registration and login
- JWT token management
- Role-based access control
- Session management
- Password reset functionality

## 📊 Features Overview

### Auction System
- Real-time bidding with countdown timers
- Reserve price functionality
- Bid history tracking
- Auction status management
- Featured and ending soon sections

### Product Management
- Product catalog with filtering
- Stock management
- Condition tracking (New, Used, Refurbished)
- Brand and category organization
- Image gallery support

### User Experience
- Intuitive navigation
- Search and filtering capabilities
- Responsive design
- Loading states and error handling
- Toast notifications
- Progressive Web App features

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run e2e
```

## 📦 Deployment

### Build for Production
```bash
npm run build --prod
```

### Deploy to Various Platforms
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **Firebase**: Use Firebase CLI
- **AWS S3**: Upload to S3 bucket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core auction functionality
- **v1.1.0** - Added seller portal and product management
- **v1.2.0** - Enhanced UI/UX and responsive design
- **v1.3.0** - Added real-time notifications and analytics

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Material Design for the UI components
- The open-source community for various libraries and tools

---

**Note**: This is a frontend application that requires a backend API to function properly. Make sure to configure the backend URL in the environment files before running the application.