# Foundly - Lost and Found Management System

## Overview
Foundly is a full-stack web application designed to help users report and track lost and found items. The system consists of:
- A React-based frontend (frontend-V1)
- A Spring Boot backend (foundly-app2)

## Features

### Frontend Features
- **User Authentication**: Login and Signup functionality
- **Item Reporting**: Forms for reporting lost/found items
- **Item Browsing**: View lost/found items with filtering options
- **User Dashboard**: Track your reported items and their status
- **Responsive Design**: Works on desktop and mobile devices

### Backend Features
- RESTful API endpoints
- User management (register, login, CRUD operations)
- Item management (report, search, update status)
- Image upload handling
- Database integration

## Project Structure

### Frontend (frontend-V1)
```
src/
├── App.js                # Main application router
├── components/           # React components
│   ├── LoginForm.js      # User login form
│   ├── Navbar.js         # Navigation bar
│   ├── HomePage.js       # Landing page
│   ├── SignUpForm.js     # User registration form
│   ├── ReportItem.js     # Lost/found item reporting
│   ├── LostItems.js      # Lost items listing
│   ├── FoundItems.js     # Found items listing
│   └── MyActivity.js     # User activity dashboard
└── styles/               # CSS stylesheets
```

### Backend (foundly-app2)
```
com.example.lostandfound
├── config/            # Application configurations
├── controller/        # REST controllers
├── service/           # Business logic layer
├── repository/        # Data access layer
├── dto/               # Data Transfer Objects
├── entity/            # Database entities
└── exception/         # Custom exception handling
```

## Technologies Used

### Frontend
- React.js
- React Router
- Axios (for API calls)
- CSS Modules

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL/PostgreSQL
- Swagger (API documentation)

## Setup Instructions

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend-V1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd foundly-app2
   ```
2. Configure database in `application.properties`
3. Build and run:
   ```bash
   mvn spring-boot:run
   ```

## API Documentation
Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

## Environment Variables
Create a `.env` file in the frontend root with:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## License
MIT License

## Contributors
- Team-2

## Future Enhancements
- User authentication and authorization
- Push notifications for item matches
- Advanced search functionality
- Mobile app version
