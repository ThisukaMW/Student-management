# Student Management System — Frontend

The web frontend for the Student Management System. Students can register and sign in through a responsive interface that talks to the [Spring Boot backend](https://github.com/ThisukaMW/Student-management-backend) over REST.

## Tech stack

- HTML5, CSS3, Bootstrap
- JavaScript (Fetch API)

## Pages

| File           | Script        | Purpose                              | API call                     |
|----------------|---------------|--------------------------------------|------------------------------|
| `index.html`   | `js/app.js`   | Student registration form            | `POST /api/v1/students`      |
| `content.html` | `js/main.js`  | Sign in                              | `POST /api/v1/auth/login`    |
| `login.html`   | `js/login.js` | List of registered students          | `GET /api/v1/students`       |

`js/api.js` holds the shared helpers: the backend URL (`API_BASE_URL`), a small `fetch` wrapper, error-message formatting and HTML escaping. Styles are in `css/`.

Errors from the backend (for example "password: size must be between 8 and 72") are shown in an alert. The student list shows up to 100 students, the largest page the API allows.

## Getting started

1. Start the backend first. See the [backend README](https://github.com/ThisukaMW/Student-management-backend#getting-started). It runs on `http://localhost:8080`.
2. Serve this folder with the VS Code **Live Server** extension (it opens `http://127.0.0.1:5500`), then go to `index.html`.

Don't open the HTML files straight from disk (`file://...`). The browser then blocks the requests to the backend (CORS). The backend allows `http://127.0.0.1:5500`, `http://localhost:5500`, `http://localhost:5173` and `http://localhost:3000` by default. To use another address, add it to `app.cors.allowed-origins` in the backend.

To point the frontend at a different backend, change `API_BASE_URL` in `js/api.js`.

## Screenshots

<!-- ![Landing page](screenshots/home.png) -->
<!-- ![Login](screenshots/login.png) -->

## Related

- Backend: [Student-management-backend](https://github.com/ThisukaMW/Student-management-backend)
