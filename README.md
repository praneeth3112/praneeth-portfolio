# Praneeth Reddy Kadavakolla | AI/ML Portfolio (Flask)

A Flask-powered version of my portfolio. Content is typed Python data in
`portfolio/content.py`, rendered with Jinja2 and also served as JSON.

## Run it

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py          # http://127.0.0.1:5000
python -m unittest -v  # run the tests
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | The portfolio page |
| GET | `/api/health` | Health check |
| GET | `/api/profile`, `/api/skills` | Profile and skills as JSON |
| GET | `/api/projects?tech=python` | Projects, optionally filtered by tech |
| GET | `/api/projects/<slug>` | One project |
| GET | `/api/github` | My public repos (server-side cached for 10 min) |
| POST | `/api/contact` | Contact form: validated, rate-limited, stored in SQLite |
| GET | `/api/messages` | Read messages; needs `X-Admin-Token` and `ADMIN_TOKEN` set |

## Configuration (environment variables)

`SECRET_KEY`, `DATABASE`, `GITHUB_USER`, `GITHUB_CACHE_SECONDS`, `ADMIN_TOKEN`,
`CONTACT_LIMIT_PER_HOUR`, `SITE_URL`, `PORT`. Set `TRUST_PROXY=1` when
running behind a reverse proxy so the real client IP is used for rate limiting.

Read messages from the terminal: `flask --app run messages`

## Deploy

`gunicorn wsgi:app` (set `SECRET_KEY` and `ADMIN_TOKEN` first).
Note: Netlify only hosts static files; use Render, Railway, Fly.io or PythonAnywhere for Flask.
