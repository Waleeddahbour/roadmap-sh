# Personal Blog Frontend

Frontend for the Personal Blog project built with React and Vite.

This app includes:

- a public guest section for browsing articles
- an admin login flow
- a protected admin dashboard
- add, edit, and delete article flows

## Features

### Guest Section

- Home page with article list
- Single article page
- Publication date display

### Admin Section

- Admin login page
- Protected dashboard
- Create article page
- Edit article page
- Delete article action

## Tech Stack

- React
- Vite
- React Router
- Fetch API

## Routes

### Public Routes

- `/` - Home page
- `/article/:id` - Article details page
- `/login` - Admin login page

### Protected Admin Routes

- `/admin` - Admin dashboard
- `/admin/new` - Add article page
- `/admin/edit/:id` - Edit article page

Unknown routes redirect back to `/`.

## Project Structure

```text
src/
├── api/
│   ├── articlesApi.js
│   └── httpClient.js
├── components/
│   ├── common/
│   │   ├── ArticleForm.jsx
│   │   ├── ArticleList.jsx
│   │   └── ProtectedRoute.jsx
│   └── layout/
│       └── BlogShell.jsx
├── context/
│   └── authContext.jsx
├── pages/
│   ├── admin/
│   │   ├── AddArticlePage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── EditArticlePage.jsx
│   ├── auth/
│   │   └── LoginPage.jsx
│   └── guest/
│       ├── ArticlePage.jsx
│       └── HomePage.jsx
├── routes/
│   └── AppRoutes.jsx
├── utils/
│   └── dateFormat.js
├── App.css
├── App.jsx
└── main.jsx
```

## Environment Variables

Create a `.env` file in the frontend root and use:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Notes:

- `VITE_BACKEND_URL` points to the Express backend

## Installation

From the frontend folder:

1. Install dependencies
2. Create your `.env` file
3. Start the dev server

## Available Scripts

- `npm run dev` - start Vite development server
- `npm run build` - build the app for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Admin Authentication

The frontend uses the backend's Basic Auth flow.

- Admin credentials are entered on `/login`
- The frontend encodes them and stores the auth token locally
- Protected admin pages require a valid admin token

## Architecture Notes

This frontend is structured to stay maintainable and DRY:

- API logic is centralized in `api/`
- shared UI lives in `components/common/`
- route protection is isolated in `ProtectedRoute`
- auth state is centralized in `authContext`
- pages focus on page-level data loading and orchestration

## Backend Expectations

This frontend expects the backend to provide:

- guest article list from `GET /`
- admin article list from `GET /admin`
- create article with `POST /admin/new`
- edit article with `PATCH /admin/edit/:id`
- delete article with `DELETE /admin/delete/:id`

It also expects guest article responses to include:

- `id`
- `title`
- `content`
- `createdAt`

## Status

The frontend currently builds successfully with:

- `npm run build`
