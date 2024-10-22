# Photographer Appointment Booking

This is a **MERN Stack** (MongoDB, Express, React, Node.js) booking application designed for clients to book appointments for services. It features **authentication** via JWT, **email notifications** via SendGrid, an admin dashboard for managing bookings as well as the website pages informations, and a client dashboard as well to make bookings and manage their bookings.

## Features

- **User Registration/Login**: Users can sign up, log in, and recover their passwords.
- **Booking System**: Users can book services, view available time slots, and provide additional details.
- **Admin Dashboard**: Admin can view, manage bookings and website pages, receive notifications of new bookings, and replies to the quries they have.
- **Client Dashboard**: Client can view, manage bookings, receive notifications of bookings they has made and view replies of their quries.
- **Email Notifications**: Users and admins receive email notifications for bookings and cancellations via **SendGrid**.
- **JWT Authentication**: Ensures secure routes for booking and user authentication.
- **Real-time Notifications**: Admins can see notifications when a booking or contact form is submitted.

## Technologies Used

- **MongoDB**: Database to store user and booking information.
- **Express.js**: Backend framework for handling API requests.
- **React.js**: Frontend framework for creating a dynamic user interface.
- **Node.js**: Backend runtime for handling server-side code.
- **Zustand**: For state management.
- **Axios**: For making HTTP requests from the client-side.
- **SendGrid**: For sending emails for booking confirmations and cancellations.
- **Framer Motion**: For animations in the frontend.

## Getting Started

### Prerequisites

- Node.js (>= v14)
- MongoDB
- SendGrid API key

### Installation

**Clone the repository:**

````bash
git clone [https://github.com/samvaarv/capstone.git](https://github.com/samvaarv/capstone.git)
cd capstone


### Setup .env file

```bash
PORT=8888
DBUSER=your_mongo_user
DBPWD=your_mongo_password
DBHOST=your_mongo_host
DATABASE=your_mongo_database
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
SENDGRID_API_KEY=your_sendgrid_api_key

CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your_sendgrid_verified_email
FROM_EMAIL=your_sendgrid_verified_sender_email
````

If you want to run this app locally, put this env file in frontend folder

```bash
VITE_BACKEND_URL=http://localhost:8888
```

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```

## Directory Structure

capstone/
├── backend/ # Express server and APIs
│ ├── controllers/ # Controllers for handling API logic
│ ├── models/ # MongoDB models (User, Booking, Notification)
│ ├── routes/ # API routes
│ ├── middleware/ # JWT authentication and other middlewares
│ ├── index.js # Main entry point for the backend server
│ └── ...
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # React pages (UserBookingPage, AdminDashboard, etc.)
│ │ ├── store/ # Zustand state management
│ │ ├── App.jsx # Main app component
│ │ └── ...
│ └── ...
|
├── .env # Global Environment variables
└── README.md # Project documentation

## API Endpoints

### Authentication

- POST /auth/signup - Register a new user
- POST /auth/login - Log in a user
- POST /auth/logout - Log out the current user
- POST /auth/verify-email - Verify user's email after registration

### Bookings

- POST /api/client/book - Book a service
- GET /api/booking-dates - Fetch available booking dates
- GET /api/booking/:date - Get available time slots for a date
- DELETE /api/client/bookings/:id - Cancel a booking

### Notifications

- GET /api/notifications - Get notifications for a logged-in user
- POST /api/notifications/:id/read - Mark a notification as read

## Deployment

This project can be deployed to services like Heroku, Vercel, or Netlify. Make sure to set the appropriate environment variables for production (such as MONGO_URI for a production database).

## Contributing

Feel free to open an issue or submit a pull request if you have any improvements or suggestions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
