# Course Management System

A React-based course management application that allows users to manage courses and students. Users can create, edit, and delete courses and students, as well as assign students to specific courses.

## Features

- **User Authentication**: Simple login system to access the application
- **Course Management**: Create, read, update, and delete courses
- **Student Management**: Create, read, update, and delete student profiles
- **Course-Student Assignment**: Assign students to specific courses
- **Form Validation**: Input validation using Yup schema validation
- **Responsive Design**: Fully responsive UI using Ant Design components

## Technology Stack

- **Frontend**:

  - React 18+
  - Redux Toolkit for state management
  - React Router for navigation
  - Ant Design for UI components
  - Formik & Yup for form handling and validation
  - SCSS for styling

- **Backend** (Development only):
  - Node.js with Express
  - In-memory data storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Running the Application

#### Development Mode (with local server)

1. Start the backend server:

```bash
cd server
npm start
```

2. In a separate terminal, start the frontend:

```bash
npm run dev
```

3. Visit `http://localhost:5173` in your browser

#### Production Mode (static, without backend)

The application can also run as a static site (e.g., on GitHub Pages) without a backend server. In this mode, it uses localStorage to simulate a backend API.

```bash
npm run build
npm run preview
```

## Usage

1. **Login**: Use any username/password combination to log in (authentication is simulated)
2. **Courses Page**: View all courses, add new courses, edit or delete existing ones
3. **Students Page**: View all students, add new students, edit or delete existing ones
4. **Course Details**: Click on a course name to view its details and manage enrolled students
5. **Student Assignment**: From a course detail page, click "Assign Student" to add students to a course

## Project Structure

- `/src`: Frontend source code

  - `/components`: React components
  - `/store`: Redux store configuration and slices
  - `/services`: API and utility services
  - `/assets`: Static assets

- `/server`: Backend Express server (for development only)
  - `/src/routes`: API routes for courses and students

## License

This project is licensed under the MIT License.
