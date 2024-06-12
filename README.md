# Chat Application

This is a real-time chat application built with React, Socket.IO, and Node.js.

## Getting Started

Follow these instructions to set up and run the application on your local machine.

### Prerequisites

- Node.js (https://nodejs.org/)
- npm (comes with Node.js)

# Installation

## Client-side Setup

Navigate to the root directory of the project and install the dependencies:

```bash
npm install
```

### Run the Client

Start the React application:
```bash
npm start
```

## Server-side Setup

Open a new terminal window/tab, navigate to the server directory, and install the dependencies:

```bash
cd server
npm install
```

### Run the Server

Start the Node.js server:

```bash
npm start
```

### Access the Application

```bash
http://localhost:3000
```

# Important Note:
As the application uses same local storage. So, to test it correctly side by side, follow the instructions below.

- Open 2 different browsers, or 2 windows of same browser.
- Create 2 accounts with same username on both browsers/windows.
- Login on both of windows, but make sure, both windows don't logged in with same user.
- Start chat and test



# Features
- Real-time messaging
- Typing indicators
- Persistent chat history across refreshes
- Authentication with local storage

# Technologies Used
- React
- Socket.IO
- Node.js
- Express


