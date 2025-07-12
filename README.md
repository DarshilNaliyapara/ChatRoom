# ChatRoom

A real-time web chat application with multiple chat-room support, built using \[Your Tech Stack: e.g., Node.js, Socket.IO, Express, React].

## 🚀 Features

* **Real-time messaging**: Exchange messages between users in real-time
* **Multiple rooms**: Create and join multiple chat rooms (channels)
* **User presence**: See when users join or leave a room
* **Message history**: Scroll through past messages in the current session
* **Responsive UI**: Clean and mobile-friendly design
* **Secure hashing** (if included): Passwords hashed using bcrypt

## 💠 Tech Stack

| Component        | Technology                  |
| ---------------- | --------------------------- |
| Backend          | Node.js, Express            |
| WebSockets       | Socket.IO                   |
| Frontend         | React / Vue / Plain JS      |
| UI Framework     | Bootstrap / Material-UI     |
| Database\*       | MongoDB / MySQL / In-Memory |
| Authentication\* | JWT / Session / None        |

*\* Optional based on your project.*

## 📦 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v14+
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DarshilNaliyapara/ChatRoom.git
   cd ChatRoom
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file (if applicable):

   ```env
   PORT=3000
   DB_URI=mongodb://localhost/chatroom
   JWT_SECRET=your_jwt_secret
   ```

### Running the App

Start both backend and frontend servers:

```bash
# Start backend
npm run server
# In a separate terminal, start frontend
npm start
```

Navigate to `http://localhost:3000` (or the port you configured).

## 🎯 Usage

1. Create or join a chat room.
2. Enter a username (or log in).
3. Send messages in real-time.
4. (Optional) Refresh to see the chat history load automatically.

## 🧩 Project Structure

```
ChatRoom/
├── server/
│   ├── index.js             # Entry point for server
│   ├── sockets.js           # WebSocket event handling
│   ├── routes/              # REST API endpoints (auth, rooms, etc.)
│   └── models/              # Database schemas/models
├── client/
│   ├── src/
│   │   ├── App.jsx          # Root React/Vue component
│   │   ├── components/      # UI components (Chat, RoomList, etc.)
│   │   └── utils/           # Helpers (socket setup, API calls)
├── .env.example
├── package.json
└── README.md
```

*(Adjust according to your actual structure)*

## ✅ Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

Please follow the existing code style and run tests if added.

## 📝 License

This project is licensed under the [MIT License](LICENSE).
