# Blog-Less

A modern blogging platform built with Node.js, Express, MongoDB, and Next.js.

## Features

- Server-side rendering (SSR) with Next.js
- RESTful API with Express
- MongoDB database
- TypeScript throughout
- JWT Authentication
- Responsive design with Tailwind CSS
- Type-safe query parameters
- Tag-based filtering

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized setup)

## Quick Start with Docker Compose

The easiest way to get started is using Docker Compose, which will set up all required services in one go.

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blog-less
   ```

2. Start the application using the convenience script:

   ````
     Docker Compose:

   ```bash
   docker compose up
   ````

   This will:

   - Start MongoDB
   - Start the backend server
   - Automatically run database seed script
   - Start the frontend server

3. Access the application:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Manual Setup (Without Docker)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   # Copy the example .env file
   cp .env.example .env

   # Edit the .env file with your settings
   # Especially update MONGODB_URI to your MongoDB connection string
   ```

4. Seed the database:

   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   # Copy the example .env file
   cp .env.example .env

   # Update the backend URL if needed
   # Default is http://localhost:8080
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the frontend at: http://localhost:3000

## Docker Commands

- Start services: `docker compose up`
