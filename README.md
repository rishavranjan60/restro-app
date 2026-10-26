# Restaurant App

A restaurant application with separate customer and administrator frontends and a Node.js/Express API. The repository contains menu, order and table functionality, MongoDB models and Cloudinary upload integration.

## Structure

| Directory | Purpose |
| --- | --- |
| `client/` | Customer React + TypeScript application |
| `admin/` | Administrator React + TypeScript application |
| `backend/` | Express + TypeScript API, database models and upload routes |

Each application has its own `package.json` and lockfile. The root package does not provide application scripts.

## Backend

Install Node.js and npm, provide a MongoDB database, and configure the values documented in [backend/.env.example](backend/.env.example) in a local `backend/.env` file.

```bash
cd backend
npm ci
npm run dev
```

## Customer frontend

In a separate terminal, from the repository root:

```bash
cd client
npm ci
npm start
```

## Administrator frontend

In another terminal, from the repository root:

```bash
cd admin
npm ci
npm start
```

If the customer app already uses port 3000, accept the prompt to run the admin app on another port.

Both frontends read `REACT_APP_API_BASE_URL` and default to `http://localhost:5000/api`. Set that variable in each frontend's local `.env` file if the backend runs elsewhere, then restart the development server. Browser-exposed variables must not contain secrets.

## Build checks

Run `npm run build` separately in `backend/`, `client/` and `admin/`. The frontend packages also expose `npm test`.

Cloud deployment configuration is in `backend/template.yaml` and `.github/workflows/`; local development does not require deploying those resources.
