# TaskFlow - Professional Task Management

A sleek, professional full-stack task management application built with React, Express, Node.js, and MongoDB.

## Features

- Create, edit, and organize tasks with an intuitive interface
- Assign priority levels (low, medium, high) to tasks
- Track task status (pending, in-progress, completed)
- Set due dates for deadline management
- Filter and search functionality for easy task navigation
- Responsive design with professional light blue color scheme
- Containerized with Docker for simple deployment

## Tech Stack

### Frontend:
- React.js
- React Router for navigation
- Axios for API requests
- Modern UI with custom CSS and light blue palette

### Backend:
- Node.js
- Express.js
- MongoDB for data storage
- Mongoose for object modeling

### DevOps:
- Docker for containerization
- Docker Compose for orchestration
- Nginx for serving the frontend

## Project Structure

```
taskflow/
├── frontend/           # React frontend
├── backend/            # Express & Node.js backend
├── docker-compose.yml  # Docker composition file
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js and npm (for local development)

### Running with Docker

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command:

```bash
docker-compose up
```

This will:
- Build the frontend and backend images
- Start the MongoDB database
- Connect all services via a Docker network
- Expose the application on http://localhost:3000

### Local Development

#### Backend Setup:

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:5000

#### Frontend Setup:

```bash
cd frontend
npm install
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

- `GET /api/todos` - Get all tasks
- `GET /api/todos/:id` - Get a specific task
- `POST /api/todos` - Create a new task
- `PUT /api/todos/:id` - Update a task
- `DELETE /api/todos/:id` - Delete a task

