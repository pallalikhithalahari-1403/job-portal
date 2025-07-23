# Job Portal Application

A web-based job portal application with user authentication and profile management.

## Project Structure
```
.
├── backend
│   ├── models
│   │   └── userModel.js
│   ├── package.json
│   └── server.js
├── public
│   └── css
│       ├── jobs.css
│       ├── login.css
│       ├── profile.css
│       ├── register.css
│       └── styles.css
└── views
    ├── index.html
    ├── jobs.html
    ├── login.html
    ├── profile.html
    └── register.html
```

## Setup Instructions

1. Navigate to backend directory:
```
cd backend
```

2. Initialize project:
```
npm init -y
```

3. Install dependencies:
```
npm i body-parser cors dotenv express mongoose multer nodemon
```

4. Start the server:
```
nodemon server.js
```

## Features
- User authentication (login/register)
- Profile management with resume upload
- Job listings with filtering
- Responsive design

## Dependencies
- body-parser: ^2.2.0
- cors: ^2.8.5
- dotenv: ^16.5.0
- express: ^5.1.0
- mongoose: ^8.13.2
- multer: ^1.4.5-lts.2
- nodemon: ^3.1.9

## Environment Variables
The application requires the following environment variables:
- PORT: Server port (defaults to 5000)
- MONGO_URI: MongoDB connection string

## API Endpoints
- POST /login - User authentication
- POST /register - New user registration
- POST /update-profile - Update user profile
- GET /profile - Get user profile information

## User Model
Supports the following fields:
- name (required)
- email (required, unique)
- password (required)
- contact (required, 10-digit)
- address (required)
- resume (optional)
- role (required: Web Developer, Backend Developer, or Data Analyst)