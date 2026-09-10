# VanishDrop

VanishDrop is a public, no-login file bridge for moving supported documents between devices. Upload from a laptop, open the same page on a phone, and download the file. Every file is publicly visible for up to 12 hours and is then removed.

## Features

- PDF, DOC, DOCX, XLS and XLSX uploads
- 10 MB configurable maximum file size
- Drag-and-drop plus keyboard-friendly file picker
- Public active-file feed with expiration countdowns   
- Anonymous ownership tokens stored only in the uploader's browser
- Manual deletion available five minutes after upload
- Automatic storage cleanup every five minutes
- IP-based request, upload and download rate limits
- Supabase Storage provider with a local filesystem fallback
- Responsive React + Tailwind UI for phones, tablets and desktop

## Architecture

```text
client/ React + Vite + TypeScript + Tailwind
        |
        v
server/ Express + TypeScript + Mongoose
        |                    |
        v                    v
     MongoDB          StorageProvider
                      (Supabase by default, local fallback)
```

The API owns all permission checks. The browser's deletion token is never returned by the public list endpoint and is only stored as a SHA-256 digest in MongoDB.

## Project structure

```text
client/src/components  Reusable UI components
client/src/hooks       Data fetching and countdown hooks
client/src/pages       Route-level screens
server/src/services    File business logic and storage
server/src/jobs        Scheduled cleanup
server/src/models      Mongoose models
server/src/middleware  Validation, upload and error handling
server/tests           Vitest business/API tests
```

## Local setup

Requirements: Node.js 20+, npm 10+, and MongoDB 7+ (local or Atlas). Create a Supabase project and a private Storage bucket for production.

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, Supabase credentials and a real `TOKEN_SECRET`.
2. For a split frontend/backend deployment, copy `client/.env.example` to `client/.env` and set `VITE_API_URL` to the API base URL.
3. Install dependencies from the repository root:

   ```bash
   npm install
   ```

4. Start the API and Vite client together:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173).

The API listens on port 5000. The Vite dev server proxies `/api` requests to it.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Express port | `5000` |
| `MONGODB_URI` | MongoDB connection string | local VanishDrop DB |
| `MAX_FILE_SIZE_MB` | Upload limit | `10` |
| `FILE_EXPIRATION_HOURS` | Public lifetime | `12` |
| `DELETE_LOCK_MINUTES` | Ownership deletion lock | `5` |
| `UPLOAD_RATE_LIMIT` | Uploads per window per IP | `10` |
| `REQUEST_RATE_LIMIT` | General requests per window per IP | `240` |
| `DOWNLOAD_RATE_LIMIT` | Downloads per window per IP | `120` |
| `STORAGE_PROVIDER` | Storage adapter selector | `supabase` |
| `LOCAL_STORAGE_PATH` | Local storage directory when using `local` | `./uploads` |
| `SUPABASE_URL` | Supabase project URL | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only Supabase service key | — |
| `SUPABASE_BUCKET` | Supabase Storage bucket | `VanishDrop-files` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `TOKEN_SECRET` | Required secret for token hashing | — |
| `VITE_API_URL` | Frontend API base URL | `/api` |

For Supabase Storage, create a bucket named `VanishDrop-files` and keep it private. `SUPABASE_SERVICE_ROLE_KEY` is backend-only; never expose it through Vite or browser code.

## API

### `GET /api/health`

Returns `{ "status": "ok", "timestamp": "..." }`.

### `GET /api/files`

Returns active, non-expired files sorted newest first. No ownership credentials or storage paths are returned.

### `POST /api/files`

Send `multipart/form-data` with a `file` field. Allowed extensions: `.pdf`, `.xls`, `.xlsx`, `.doc`, `.docx`. The response contains public metadata and a one-time `deleteToken` for the uploader.

### `GET /api/files/:id/download`

Streams an active file if it exists and has not reached `expiresAt`.

### `DELETE /api/files/:id`

Requires `Authorization: Bearer <deleteToken>`. The backend verifies the token and rejects requests before `deleteAvailableAt`.

## Expiration and deletion

Each document stores `uploadedAt`, `deleteAvailableAt` and `expiresAt`. The cleanup worker runs every five minutes, removes expired files from the configured storage provider, then removes the MongoDB record. Cleanup is idempotent and logs failures for operational visibility. The database also has an index on `expiresAt` for efficient expiration scans; the application worker remains responsible for physical file deletion.

## Testing and production build

```bash
npm run typecheck
npm test
npm run build
```

The Vitest suite covers the security-sensitive validation, token, expiry and deletion-window rules without needing a database. For a full endpoint smoke test, run MongoDB locally, start the API and exercise the documented upload/list/download/delete endpoints.

## Production deployment

- Build the client and serve its `client/dist` from Vercel, Netlify, Cloudflare Pages or a CDN. Set `VITE_API_URL` to the public API base URL at build time.
- Run the Express server on Render, Railway, Fly.io, a VPS or AWS. Supabase Storage means the API server does not need a persistent local disk.
- Use MongoDB Atlas.
- Use `STORAGE_PROVIDER=supabase` with the Supabase Storage credentials for production. The `StorageProvider` interface keeps storage concerns isolated from the file business logic.
- Set `CLIENT_URL` to the exact frontend origin and use HTTPS.
- Do not use an ephemeral local disk in a horizontally scaled deployment.

## Troubleshooting

- `MONGODB_URI is not configured`: copy `server/.env.example` to `server/.env` and set it.
- `STORAGE_PROVIDER=supabase requires ...`: add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the backend environment.
- `Invalid path specified in request URL`: set `SUPABASE_URL` to the project URL only, such as `https://your-project-ref.supabase.co`; do not paste `/storage/v1` or `/storage/v1/s3`. Set `SUPABASE_BUCKET` to only the bucket ID, such as `VanishDrop-files`.
- Uploads are rejected: check the file extension, detected MIME/signature and 10 MB limit.
- Files disappear after a restart with local storage: use `STORAGE_PROVIDER=supabase` in production or attach a persistent volume when intentionally using the local fallback.

## Future improvements

QR handoff links, password-protected rooms, multi-file batches, image support, virus scanning, resumable uploads and download analytics can be layered onto the existing API without changing the anonymous core flow.
