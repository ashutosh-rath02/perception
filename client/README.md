# Description

This project is a client application built with React and Next.js to provide a real-time feedback system using Socket.IO.

## Features

- Real-time updates using Socket.IO
- Gradient background with a floating feedback container
- Ability to join rooms and submit feedback
- Screenshot functionality

## Technologies

- React
- Next.js
- Socket.IO Client
- Framer Motion
- HTML2Canvas
- TanStack React Query

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/client.git
cd client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:3000`.

### Configuration

Ensure that your environment variables are set correctly. You can create a .env.local file in the root directory and add your variables:

```
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

### Contributing

Feel free to submit issues and pull requests.

### License

This project is licensed under the MIT License.
