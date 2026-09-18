\# TodoApp



A simple full-stack To-Do app built as a technical assignment.



The app lets users create an account, log in, and manage their tasks with deadlines and priorities.



\## Features



\- User registration and login

\- JWT authentication

\- Create, edit and delete tasks

\- Mark tasks as completed

\- Set task deadline (date \& time)

\- Set priority: High, Medium, Low

\- Filter tasks by status

\- Filter tasks by priority

\- Sort tasks

\- Overdue task indication

\- Persistent login



\## Tech Stack



\*\*Frontend\*\*

\- React Native CLI

\- TypeScript

\- Redux Toolkit

\- React Navigation

\- Axios

\- React Hook Form + Yup



\*\*Backend\*\*

\- Node.js

\- Express

\- TypeScript

\- MongoDB

\- Mongoose

\- JWT

\- bcrypt



\## Project Structure



```text

todoassignment/

├── backend/

└── mobile/



The `backend` contains the REST API and MongoDB logic, while `mobile` contains the React Native application.

## Running the Project

### Backend

```cmd
cd backend
npm install
npm run dev

The backend runs on port 5001.

Make sure MongoDB is running and create a .env file using .env.example.

Mobile

Open another terminal:

cd mobile
npm install

For a physical Android device:

adb reverse tcp:5001 tcp:5001
adb reverse tcp:8081 tcp:8081

Then run:

npx react-native run-android

API
Authentication:

POST /api/auth/register
POST /api/auth/login

Tasks:

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
Notes
Passwords are hashed using bcrypt.
JWT is used for authentication.
The backend uses MongoDB for storing users and tasks.
The mobile app was tested on a physical Android device.
Future Improvements
Task categories/tags
Search
Notifications for upcoming deadlines
Recurring tasks
Offline support

