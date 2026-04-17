# Personal Blog Frontend Plan

## Scope
Build a React frontend (Vite) for two sections:

- Guest Section (public access)
- Admin Section (authenticated access)

---

## Guest Section Requirements

### 1) Home Page
- Route: `/`
- Purpose: Display list of published articles
- Each item should show:
  - Title
  - Date of publication
- Each item should link to its article page

### 2) Article Page
- Route: `/article/:id`
- Purpose: Display full article details
- Should show:
  - Title
  - Date of publication
  - Full content

---

## Admin Section Requirements

### 1) Dashboard
- Route: `/admin`
- Purpose: Manage all published articles
- Should show:
  - List of articles
  - Add new article action
  - Edit action per article
  - Delete action per article

### 2) Add Article Page
- Route: `/admin/new`
- Purpose: Create a new article
- Form fields:
  - Title
  - Content
  - Date of publication

### 3) Edit Article Page
- Route: `/admin/edit/:id`
- Purpose: Update an existing article
- Form fields:
  - Title
  - Content
  - Date of publication

---

## Build Plan (Implementation Order)

1. Set up routing and page shells
   - Create all required routes and empty pages first.

2. Build API layer
   - Centralize fetch calls for guest and admin endpoints.
   - Add auth header support for admin API calls.

3. Implement Guest flows
   - Home page article list
   - Article details page

4. Implement Admin auth and protected routes
   - Login page for admin credentials
   - Protect `/admin/*` pages

5. Implement Admin CRUD pages
   - Dashboard list + actions
   - Add Article form + submit
   - Edit Article form + submit
   - Delete action with confirmation

6. Add UX polish and validation
   - Loading states
   - Error/success messages
   - Empty states

7. End-to-end verification
   - Guest browsing flow
   - Admin create/edit/delete flow

---

## Suggested Directory Structure

```text
src/
├── api/
│   ├── httpClient.js
│   └── articlesApi.js
├── context/
│   └── AuthContext.jsx
├── routes/
│   └── AppRoutes.jsx
├── components/
│   ├── common/
│   │   ├── ArticleForm.jsx
│   │   ├── ArticleList.jsx
│   │   └── ProtectedRoute.jsx
│   └── layout/
│       └── BlogShell.jsx
├── pages/
│   ├── guest/
│   │   ├── HomePage.jsx
│   │   └── ArticlePage.jsx
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── AddArticlePage.jsx
│   │   └── EditArticlePage.jsx
│   └── auth/
│       └── LoginPage.jsx
├── styles/
│   └── app.css
├── utils/
│   └── dateFormat.js
├── App.jsx
└── main.jsx
```

---

## Backend Compatibility Note

Current backend automatically sets timestamps and does not currently accept a custom publication date in create/update payloads.

If you need the publication date field from Add/Edit forms to be editable, add backend support for a user-provided publication date.
