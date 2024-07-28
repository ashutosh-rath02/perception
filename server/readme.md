## Server README

# Server

This project is a server application built with Node.js and Express to provide real-time feedback functionality using Socket.IO and Redis.

## Features

- Real-time updates using Socket.IO
- Room management with Redis
- Graceful handling of connections and disconnections

## Technologies

- Node.js
- Express
- Socket.IO
- Redis
- ioredis

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Redis

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/server.git
cd server
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a .env file in the root directory and add your environment variables:

```bash
PORT=8080
REDIS_CONNECTION_STRING=your_redis_connection_string
```

### Running the Application

1. Start the server

```bash
npm start
# or
yarn start
```

2. The server should be running at `http://localhost:8080`.

### API Endpoints

`POST /submit-feedback`

- Submit feedback to a specific room.
- Request body

```json
{
  "feedback": "Your feedback here",
  "roomCode": "room-code"
}
```

### WebSocket events

- `join-room`: Join a specific room.
- `room-update`: Receive updates for a specific room.
- `disconnect`: Handle client disconnection.

### Contributing

Feel free to submit issues and pull requests.

### License

This project is licensed under the MIT License.
