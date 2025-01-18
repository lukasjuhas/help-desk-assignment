# Help Desk Assignment

## Run this locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create .env

Create `.env` in the root with database details:

```bash
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
```

### 3. Run migrations to create tables in the DB

```bash
npm run db:migrate
```

### 4. Run in dev mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### To build

```bash
npm run build
```

Or view it on vercel: [https://help-desk-assignment.vercel.app](https://help-desk-assignment.vercel.app).