# 🚀 VanishDrop

> **A simple, temporary, and anonymous way to share files between devices.**

VanishDrop is an open-source file-sharing application that lets users upload a file from one device and download it from another without creating an account.

Files are temporary and automatically expire after a configurable period.

**Upload → Share → Download → Vanish**

---

## ✨ Features

- 📄 Support for **PDF, DOC, DOCX, XLS, and XLSX**
- 📦 Configurable maximum file size
- 🖱️ Drag-and-drop file upload
- ⌨️ Keyboard-friendly file picker
- 🌐 Public active-file feed
- ⏳ File expiration countdown
- 🔐 Anonymous ownership using secure deletion tokens
- 🗑️ Manual file deletion after a configurable lock period
- 🧹 Automatic cleanup of expired files
- 🚦 IP-based rate limiting
- ☁️ Supabase Storage support
- 💾 Local filesystem fallback for development
- 📱 Responsive user interface
- 🧩 Modular storage provider architecture
- 🚫 No login or registration required

---

## 🎯 Why VanishDrop?

Sometimes you just want to move a file from one device to another.

```text
Laptop
   ↓
Upload
   ↓
VanishDrop
   ↓
Open on another device
   ↓
Download
```

No account.  
No email.  
No complicated setup.

Just upload, share, download, and let the file vanish automatically.

---

## 🖥️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript

### Database

- MongoDB
- Mongoose

### File Storage

- Supabase Storage
- Local filesystem fallback

### Testing

- Vitest

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  React Client   │
                    │ TypeScript/Vite │
                    └────────┬────────┘
                             │
                             │ HTTP API
                             ▼
                    ┌─────────────────┐
                    │ Express Server  │
                    │   TypeScript    │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
        ┌────────────────┐      ┌─────────────────┐
        │    MongoDB     │      │ StorageProvider │
        │                │      │                 │
        │ File Metadata  │      │ Supabase / Local│
        └────────────────┘      └─────────────────┘
```

### MongoDB stores

- File metadata
- Original filename
- File size
- MIME type
- Upload time
- Expiration time
- Secure deletion token hash

### Storage provider stores

- The actual uploaded file

---

## 🔐 Security

VanishDrop keeps sensitive operations under backend control.

### Deletion tokens

When a user uploads a file:

```text
Upload File
     ↓
Generate Delete Token
     ↓
Return Token Once
     ↓
Store Token Hash in Database
```

The raw deletion token should only be available to the uploader.

The public API should not expose:

- Storage credentials
- Supabase secret keys
- Internal storage configuration
- Raw deletion token hashes

---

## 📁 Project Structure

```text
VanishDrop/
│
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── pages/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── jobs/
│   │   └── utils/
│   │
│   └── tests/
│
├── README.md
└── package.json
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Node.js `20+`
- npm
- MongoDB
- A Supabase account for cloud storage

---

## 1️⃣ Clone the repository

```bash
git clone https://github.com/PrithwiKumarSingh/Vanishdrop.git
```

Move into the project:

```bash
cd Vanishdrop
```

---

## 2️⃣ Install dependencies

Install the required dependencies:

```bash
npm install
```

If the frontend and backend are separate applications, install dependencies in their respective directories.

---

## 3️⃣ Configure environment variables

Create a `.env` file for the backend.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

MAX_FILE_SIZE_MB=10

FILE_EXPIRATION_HOURS=12

DELETE_LOCK_MINUTES=5

UPLOAD_RATE_LIMIT=10
REQUEST_RATE_LIMIT=240
DOWNLOAD_RATE_LIMIT=120

STORAGE_PROVIDER=supabase

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_BUCKET=temporary-files

CLIENT_URL=http://localhost:5173

TOKEN_SECRET=your_secure_random_secret
```

> ⚠️ Never commit `.env` files or secret keys to GitHub.

---

## ☁️ Supabase Storage Setup

Create a private bucket in Supabase Storage.

Example:

```text
temporary-files
```

Configure your backend:

```env
STORAGE_PROVIDER=supabase

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_BUCKET=temporary-files
```

### Important

Your Supabase secret key must only be used on the backend.

```text
❌ React Frontend
        ↓
   Secret Key


✅ Express Backend
        ↓
   Secret Key
        ↓
Supabase Storage
```

---

## ▶️ Run the Application

Start the development server:

```bash
npm run dev
```

Typical local URLs:

```text
Frontend
http://localhost:5173

Backend
http://localhost:5000
```

---

# 🔌 API Reference

## Health Check

### `GET /api/health`

Returns the API status.

Example response:

```json
{
  "status": "ok"
}
```

---

## Get Active Files

### `GET /api/files`

Returns active and non-expired files.

Files are typically sorted from newest to oldest.

---

## Upload File

### `POST /api/files`

Send the request as:

```text
multipart/form-data
```

Field name:

```text
file
```

Supported formats:

```text
.pdf
.doc
.docx
.xls
.xlsx
```

Example response:

```json
{
  "success": true,
  "file": {
    "id": "file-id",
    "originalName": "document.pdf",
    "size": 102400
  },
  "deleteToken": "..."
}
```

> The deletion token should be stored securely by the uploader.

---

## Download File

### `GET /api/files/:id/download`

Downloads the requested file if:

- The file exists
- The file has not expired
- The file is available

---

## Delete File

### `DELETE /api/files/:id`

Requires a deletion token:

```text
Authorization: Bearer <deleteToken>
```

The backend verifies the token before deleting the file.

---

# ⏳ File Lifecycle

Each uploaded file has important timestamps:

```text
uploadedAt
      │
      ▼

deleteAvailableAt
      │
      ▼

expiresAt
```

Example:

```text
10:00 AM
Upload File

     ↓

10:05 AM
Manual deletion becomes available

     ↓

10:00 PM
File expires automatically
```

A cleanup worker can:

1. Find expired files
2. Delete the actual file from storage
3. Remove the associated database record

---

# 🧩 Storage Providers

VanishDrop uses a storage abstraction:

```text
StorageProvider
      │
      ├── SupabaseStorageProvider
      │
      └── LocalStorageProvider
```

This architecture makes it easier to switch storage providers without rewriting core business logic.

Potential future providers:

- AWS S3
- Cloudflare R2
- Google Cloud Storage

---

# ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | — |
| `MAX_FILE_SIZE_MB` | Maximum upload size | `10` |
| `FILE_EXPIRATION_HOURS` | File lifetime | `12` |
| `DELETE_LOCK_MINUTES` | Delay before manual deletion | `5` |
| `UPLOAD_RATE_LIMIT` | Upload limit | `10` |
| `REQUEST_RATE_LIMIT` | General request limit | `240` |
| `DOWNLOAD_RATE_LIMIT` | Download limit | `120` |
| `STORAGE_PROVIDER` | Storage provider | `supabase` |
| `SUPABASE_URL` | Supabase project URL | — |
| `SUPABASE_SECRET_KEY` | Backend secret key | — |
| `SUPABASE_BUCKET` | Storage bucket name | `temporary-files` |
| `CLIENT_URL` | Frontend origin | `http://localhost:5173` |
| `TOKEN_SECRET` | Application secret | — |

---

# 🧪 Testing

Run type checking:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

> Available commands may vary depending on the final project structure.

---

# 🌍 Deployment

Recommended production architecture:

```text
                 Frontend
                    │
                    ▼
        Vercel / Netlify / Cloudflare
                    │
                    ▼
               Express API
                    │
            ┌───────┴────────┐
            │                │
            ▼                ▼
        MongoDB          Supabase
         Atlas            Storage
```

### Recommended services

| Service | Options |
|---|---|
| Frontend | Vercel, Netlify, Cloudflare Pages |
| Backend | Render, Railway, Fly.io |
| Database | MongoDB Atlas |
| File Storage | Supabase Storage |

---

# 🗺️ Roadmap

Future improvements may include:

- [ ] QR code file sharing
- [ ] Shareable file links
- [ ] Password-protected files
- [ ] Multi-file uploads
- [ ] Image support
- [ ] File preview
- [ ] Virus scanning
- [ ] Resumable uploads
- [ ] Download analytics
- [ ] Additional storage providers

---

# 🤝 Contributing

Contributions are welcome! 🎉

If you would like to improve VanishDrop:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "feat: add amazing feature"
```

5. Push the branch.

```bash
git push origin feature/amazing-feature
```

6. Open a Pull Request.

Please ensure that your contribution is:

- Clean
- Tested
- Documented

---

# 🐛 Reporting Bugs

Found a bug?

Please open an issue and include:

- A clear description of the problem
- Steps to reproduce it
- Expected behavior
- Actual behavior
- Screenshots, if applicable

---

# 💡 Feature Requests

Have an idea?

Open an issue describing:

- The problem you want to solve
- Your proposed solution
- Any alternative approaches

---

# 📄 License

This project is intended to be open source.

Consider adding an MIT License:

```text
MIT License
```

---

# 👨‍💻 Author

**Prithwi Kumar Singh**

VanishDrop is built as an open-source project for exploring:

- Full-stack development
- Backend architecture
- File storage systems
- API design
- Application security
- Temporary file sharing

---

# ⭐ Support

If you find VanishDrop useful:

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute to the project

---

<div align="center">

## 🚀 VanishDrop

### **Upload. Share. Download. Vanish.**

Made with ❤️ using React, TypeScript, Express, MongoDB, and Supabase.

</div>