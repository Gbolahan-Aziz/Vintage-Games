# Vintage Arcade

A browser-based retro arcade with five fully playable classic games. No installs, no accounts, no backend. Just open and play.

**Live:** [https://vintage-games.onrender.com](https://vintage-games.onrender.com)

---

## Games

| | Game | Genre | Controls |
|---|---|---|---|
| 🟦 | **Tetris** | Puzzle | Arrow keys, Space to hard drop |
| 🔢 | **2048** | Strategy | Arrow keys or swipe |
| 🐍 | **Snake** | Arcade | Arrow keys |
| 🧱 | **Breakout** | Action | Mouse or arrow keys |
| 👾 | **Space Invaders** | Shooter | Arrow keys, Space to shoot |

Every game includes procedurally generated retro sound effects and a background chiptune, all running entirely in the browser via the Web Audio API, with zero audio files to load.

---

## Architecture

All web content lives in `home/` and is the single source of truth for both deployments. No code is duplicated between them.

```
Vintage-Games/
,
,-- home/                   Source of truth for all web content
,   ,-- index.html          Arcade homepage
,   ,-- games/              Five self-contained HTML5 games
,   ,   ,-- tetris.html
,   ,   ,-- 2048.html
,   ,   ,-- snake.html
,   ,   ,-- breakout.html
,   ,   ,-- space-invaders.html
,   ,-- sounds/
,   ,   ,-- sfx.js          Web Audio sound engine (shared)
,   ,   ,-- background-music.mp3
,   ,   ,-- click-sound.mp3
,   ,-- nginx.conf
,   ,-- Dockerfile
,
,-- render.yaml             Render.com static site config
,-- docker-compose.yml      Local dev / ministack
,-- kube-manifest/          Kubernetes manifests for AWS EKS
,   ,-- base/
,   ,-- overlays/
,       ,-- dev/
,       ,-- staging/
,-- terraform/              AWS infrastructure (EKS cluster)
,-- .github/workflows/      CI/CD pipelines
```

---

## Running Locally with Docker Compose

Docker Compose mirrors the Kubernetes architecture locally. No Kubernetes setup required.

**Prerequisites:** Docker and Docker Compose installed.

```bash
git clone https://github.com/Gbolahan-Aziz/Vintage-Games.git
cd Vintage-Games
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

The `home/` directory is volume-mounted, so changes to HTML and JS files are reflected immediately without a rebuild.

To stop:

```bash
docker compose down
```

---

## Deploying to AWS EKS

The project is designed for AWS Elastic Kubernetes Service using NGINX Ingress and a single container that serves all five games.

### Infrastructure

Terraform provisions the EKS cluster in `us-east-1`:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Required AWS credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ACCOUNT_ID`.

### Kubernetes Manifests

The base manifests deploy one NGINX pod (two replicas) that serves the full arcade:

```bash
# Configure kubectl for your cluster
aws eks update-kubeconfig --region us-east-1 --name game-cluster

# Apply namespace
kubectl apply -f ns.yaml

# Deploy base (production)
kubectl apply -k kube-manifest/base

# Or deploy dev overlay
kubectl apply -k kube-manifest/overlays/dev
```

Add this to your `/etc/hosts` to access locally:

```
127.0.0.1  vintage-games.local
```

Then open [http://vintage-games.local](http://vintage-games.local).

### CI/CD

Pushing to `main` triggers the GitHub Actions workflow at `.github/workflows/main.yml`, which runs Terraform to provision or update the EKS cluster, then applies the Kubernetes manifests automatically.

Required GitHub Secrets:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Games | Vanilla HTML5 Canvas, JavaScript |
| Sound | Web Audio API (procedural, no files) |
| Server | NGINX Alpine |
| Container | Docker |
| Orchestration | Kubernetes, Kustomize |
| Infrastructure | AWS EKS, Terraform |
| CI/CD | GitHub Actions |
| Free Hosting | Render.com static site |

---

## License

MIT
