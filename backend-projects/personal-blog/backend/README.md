# Personal Blog Backend API

Express-based backend API for managing blog articles with JSON-file persistence and Basic HTTP Authentication for admin routes.

Project source: https://roadmap.sh/projects/personal-blog

## Tech Stack

- Node.js (ES Modules)
- Express
- dotenv
- nodemon
- File-based storage (`db/articles.json`)

## Project Structure

```
backend/
├─ db/
│  └─ articles.json
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ adminControllers.js
│  │  └─ guestControllers.js
│  ├─ middleware/
│  │  ├─ asyncHandler.js
│  │  └─ authMiddleware.js
│  ├─ routes/
│  │  ├─ adminRoutes.js
│  │  └─ guestRoutes.js
│  └─ utils/
│     ├─ authDecoder.js
│     └─ dateTime.js
├─ .env.example
├─ package.json
└─ server.js
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example`:

   ```env
   PORT=3000
   ADMIN_USERNAME=YOUR_PREFERED_USERNAME
   ADMIN_PASSWORD=HIGHLY-SECURE
   ```

3. Start development server:

   ```bash
   npm start
   ```

## Scripts

- `npm start` - Run server with nodemon
- `npm test` - Run Node.js built-in test runner (`node --test`)

## Database File Behavior

- Default database file is `db/articles.json`.
- You can override the filename with `DB_FILE`.
- `DB_FILE` is resolved inside the `db/` directory.

Example:

```env
DB_FILE=articles.test.json
```

This resolves to `db/articles.test.json`.

## Test Isolation

- Full-flow tests run with `DB_FILE=articles.test.json`.
- The test flow does not use your main `db/articles.json` file.
- If `articles.test.json` existed before tests, its original content is restored.
- If it did not exist, the file is removed after tests.

## Authentication

All `/admin/*` endpoints are protected with Basic HTTP Auth.

- Username: `ADMIN_USERNAME` from `.env`
- Password: `ADMIN_PASSWORD` from `.env`

In tools like Postman, use Authorization type: **Basic Auth**.

## API Endpoints

### Guest Routes

- `GET /` - Get all articles

### Admin Routes (Basic Auth Required)

- `POST /admin/new` - Create article
- `PATCH /admin/edit/:id` - Update article
- `DELETE /admin/delete/:id` - Delete article

### Request Body Examples

Create / Update payload:

```json
{
  "title": "Article title",
  "content": "Article content"
}
```

## Notes

- Database is a JSON file stored at `db/articles.json`.
- Accessing `GET /admin` in browser returns `Cannot GET /admin` by design because no GET handler is defined for that path.