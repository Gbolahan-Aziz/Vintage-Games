# 🕹️ Vintage Arcade

A retro-styled browser arcade with **5 classic games**, deployable for free on [Render.com](https://render.com) or on AWS EKS via Kubernetes.

![Vintage Arcade](images/tetris.gif)

---

## Games

| Game | Genre | Controls |
|------|-------|----------|
| 🟦 Tetris | Puzzle | ← → rotate, ↓ drop, Space hard-drop |
| 🔢 2048 | Strategy | Arrow keys / swipe |
| 🐍 Snake | Arcade | Arrow keys |
| 🧱 Breakout | Action | Mouse / ← → |
| 👾 Space Invaders | Shooter | ← → move, Space shoot |

All games run entirely in the browser — no backend, no installs.

---

## Deployment Options

### Option 1 — Render (Free Static Site)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Static Site
3. Connect your repo — Render auto-detects `render.yaml`
4. Done. Your arcade is live at `https://vintage-arcade.onrender.com`

Or use the Render CLI / API with token from your secrets.

### Option 2 — Local / Ministack (Docker Compose)

```bash
docker compose up --build
# Open http://localhost:8080
```

This mirrors the Kubernetes architecture locally without needing AWS.

### Option 3 — AWS EKS (Kubernetes)

```bash
# Apply base manifests
kubectl apply -k kube-manifest/base

# Or dev overlay
kubectl apply -k kube-manifest/overlays/dev

# Add to /etc/hosts: 127.0.0.1 vintage-games.local
# Then open http://vintage-games.local
```

CI/CD via GitHub Actions (`.github/workflows/main.yml`) handles Terraform + EKS deploy automatically on push to `main`.

---

## Project Structure

```
Vintage-Games/
├── home/                  # All web content (single source of truth)
│   ├── index.html         # Arcade homepage
│   ├── games/             # Self-contained game HTML files
│   │   ├── tetris.html
│   │   ├── 2048.html
│   │   ├── snake.html
│   │   ├── breakout.html
│   │   └── space-invaders.html
│   ├── sounds/            # Audio assets
│   ├── nginx.conf         # NGINX config for Docker/k8s
│   └── Dockerfile
├── render.yaml            # Render.com static site config
├── docker-compose.yml     # Local dev / ministack
├── kube-manifest/         # Kubernetes manifests (EKS)
├── terraform/             # AWS infrastructure (EKS cluster)
└── .github/workflows/     # CI/CD pipelines
```

---

## Architecture

```
[Browser] → [Render CDN] ──────────────────────────────── (free hosting)
         → [Docker Compose / localhost:8080] ──────────── (local dev)
         → [AWS ALB] → [EKS Ingress] → [NGINX Pod] ────── (production)
                                           └── serves all 5 games
```

All games are embedded HTML5/JS — no separate game containers needed. The single NGINX container serves everything.

---

## Tech Stack

- **Games:** Vanilla HTML5 Canvas + JavaScript
- **Server:** NGINX (Alpine)
- **Container:** Docker
- **Orchestration:** Kubernetes + Kustomize
- **Infrastructure:** AWS EKS + Terraform
- **Free Hosting:** Render.com static site
- **CI/CD:** GitHub Actions

---

## License

MIT — © 2025 Azeez Razaq
