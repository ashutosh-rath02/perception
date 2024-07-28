# Perception

This project is a real-time feedback system that allows users to join rooms, submit feedback, and see real-time updates using Socket.IO. The system consists of two main parts: the client application and the server application.

## Features

- Real-time feedback updates using Socket.IO
- Room management and user connection handling with Redis
- Screenshot functionality in the client application
- Floating feedback container with sharing feature

## Technologies

- Node.js
- Express
- Socket.IO
- Redis
- React
- Next.js
- Framer Motion
- HTML2Canvas
- TanStack React Query

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Redis

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/real-time-feedback-system.git
cd real-time-feedback-system
```

2. Install dependencies for both client and server:

```bash
# Navigate to the client directory and install dependencies
cd client
npm install
# or
yarn install

# Navigate to the server directory and install dependencies
cd ../server
npm install
# or
yarn install
```

### Configuration

- Create a .env file in the server directory and add your environment variables:

```
PORT=8080
REDIS_CONNECTION_STRING=your_redis_connection_string
```

- Create a .env.local file in the client directory and add your environment variables:

```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Running the application

1. Start the server:

```bash
cd server
npm start
# or
yarn start
```

2. Start the client:

```bash
cd ../client
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to `http://localhost:3000`.

### Contributing

Feel free to submit issues and pull requests.

### License

Distributed under the MIT License. See `LICENSE` for more information.
