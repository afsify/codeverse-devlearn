# Codeverse DevLearn

Welcome to the Codeverse DevLearn project! This platform is designed to a freelancer offers his services, provide courses, and establish connections between developers and users. Prime members enjoy additional benefits such as support group chat, personal support, meeting sessions, and a Prime Badge. The Codeverse DevLearn project ensures flawless functionality with a captivating design, delivering a smooth experience across all devices.

## Features

- **User Authentication:** Securely log in and manage your profile, services, and courses with our robust user authentication system.
- **Service and Course Offerings:** Freelancers can offer services, provide courses, and users can explore and enroll in them.
- **Prime Membership:** Prime members enjoy exclusive benefits, including support group chat, personal support, meeting sessions, and a Prime Badge.
- **Live Chat:** Engage in real-time conversations with other users and freelancers through the live chat feature.
- **DevHub for Developers:** A dedicated space for developers to showcase their skills, share insights, and collaborate with others.
- **Library for Purchased Courses:** Access a centralized library to manage and revisit purchased courses conveniently.
- **Responsive Design:** The platform is designed to provide a seamless experience across various devices.
- **Modular Architecture:** Embrace a modular architecture that enhances flexibility and scalability for future development.

## Tools and Technologies

### Client-Side Libraries

- **React.js:** A JavaScript library for building user interfaces.
- **Redux.js:** A predictable state container for JavaScript apps.
- **TailwindCSS:** A utility-first CSS framework for rapidly building custom designs.
- **Ant Design:** A design system for enterprise-level products.

**HTTP Client:**

- **Axios:** A promise-based HTTP client for making requests to APIs. Axios is used to interact with the server-side API.

### Server-Side Technologies

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **Socket.io:** Real-time bidirectional event-based communication.
- **MongoDB (Mongoose):** A NoSQL database used to store and retrieve data.
- **JWT Token:** JSON Web Token for user authentication.

## Access the live project

The live project can be accessed at [https://devcodeverse.vercel.app](https://devcodeverse.vercel.app)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mhdafs/codeverse-devlearn.git
   ```

2. **Set up environment variables:**

    Create a `.env` file in the root directory or rename the current `.env.sample` file and configure necessary variables for client and server sides.

    **Client ENV**

   ```bash
   VITE_STRIPE_KEY = stripe-payment-key
   VITE_GOOGLE_ID = google-auth-id
   VITE_JITSI_ID = jitsi-meeting-id
   VITE_USER_URL = user-backend-url
   VITE_ADMIN_URL = admin-backend-url
   VITE_CLOUD_NAME = cloudinary-upload-name
   VITE_CHAT_PRESET = cloudinary-chat-preset
   VITE_CLOUD_PRESET = cloudinary-upload-preset
   VITE_PROFILE_PRESET = cloudinary-profile-preset
   ```

    **Server ENV**

   ```bash
   STRIPE_KEY = stripe-secret-key
   MONGO_URL =  mongo-atlas-url
   JWT_SECRET = jwt-secret-code
   GMAIL_USER = smtp-gmail-email
   GMAIL_PASS = smtp-gmail-password
   CLIENT_URL = react-frontend-url
   PRIME_GROUP = prime-group-id
   ```

3. **Navigate to the client directory:**

    Open a terminal in Visual Studio Code and split it into two terminals. In the first terminal, navigate to the client directory:

    ```bash
    cd client
    ```

4. **Install client side dependencies:**

    ```bash
    npm install
    ```

5. **Start the client-side application:**

    ```bash
    npm start
    ```

    The client-side application will be running on [http://localhost:3000](http://localhost:3000)

6. **Navigate to the server directory:**

    In the second terminal, navigate to the server directory:

    ```bash
    cd server
    ```

7. **Install server side dependencies:**

    ```bash
    npm install
    ```

8. **Start the server:**

    ```bash
    npm start
    ```

    The server will be running on [http://localhost:5000](http://localhost:5000)

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.
