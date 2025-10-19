# Next.js Meet UI Demo

A Google Meet inspired interface built with Next.js 14, Tailwind CSS, and shadcn/ui components.

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+
- Docker and Docker Compose (for containerized development)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Compose workflow

To start the development environment in Docker:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

The container runs `npm install` before launching `npm run dev`, so local dependencies stay in sync.

## Transmit button

On the home page you will find a **Transmit** button that sends a POST request to `http://localhost:8000/demo` with a randomly generated payload:

```json
{
  "seq_no": 123456,
  "tokens": ["abcd1", "efgh2", "ijkl3", "mnop4"]
}
```

The last payload and request status are displayed beneath the controls.
