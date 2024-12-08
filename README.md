# Vintage Games Platform

Welcome to the **Vintage Games Platform**, a delightful fusion of retro classics and modern technology. Relive the charm of *Tetris* and *2048* right in your browser, locally hosted for an optimal demonstration experience.

![Preview](images/2048.gif)
![Preview](images/tetris.gif)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [How to Access the Platform](#how-to-access-the-platform)
6. [Technical Architecture Flowchart](#technical-architecture-flowchart)
7. [Contributing](#contributing)
8. [License](#license)

---

## Introduction

The Vintage Games Platform is a Kubernetes-based project featuring:
- A **static default homepage**.
- Options to play the legendary *Tetris* or *2048*.
- Scalable and lightweight deployment using **Ingress NGINX Controller**.

---

## Architecture Overview

The platform architecture is designed for simplicity and scalability. Below are the key components:

1. **Load Balancer**: Managed via the **Ingress NGINX Controller**.
2. **Static Homepage**: Provides a gateway to select games.
3. **Game Microservices**: Independent deployments for *Tetris* and *2048*.
4. **Local DNS Configuration**: Routes `vintage-games.local` to your localhost for testing.

---

## Prerequisites

Ensure the following tools are installed on your machine:

- [Docker](https://www.docker.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Ingress NGINX Controller](https://kubernetes.github.io/ingress-nginx/)
- Basic understanding of Kubernetes and local DNS configuration.

---

## Setup Instructions

### Step 1: Configure Local DNS
1. Open your `/etc/hosts` file (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows).
2. Add the following entry:
   ```plaintext
   127.0.0.1 vintage-games.local
   ```

### Step 2: Forward NGINX Controller to Localhost and create required resources
1. Use `kubectl` to port-forward the Ingress NGINX Controller to localhost:
   ```bash
   kubectl port-forward svc/ingress-nginx-controller -n ingress-nginx 80:80
   ```
2. Create Ingress Class in default namespace:
    ```bash
    kubectl apply -f ingress-class.yaml
    ```

### Step 3: Apply Namespace Manifest
1. Create a dedicated namespace for the platform:
   ```bash
   kubectl apply -f ns.yaml
   ```

### Step 4: Deploy the Application
1. Check configuration
    ```bash
    kustomize build overlays/dev
    ```
2. Use the provided Kubernetes manifests to deploy all resources:
   ```bash
   kubectl apply -k overlays/dev
   ```
   This will:
   - Create deployments for the static homepage, *Tetris*, and *2048*.
   - Configure services and ingress rules.

### Step 5: Verify Deployments
Ensure all pods and services are running:
```bash
kubectl get pods -n dev
kubectl get svc -n dev
```

---

## How to Access the Platform

1. Open your browser and navigate to:
   ```
   http://vintage-games.local
   ```
2. Explore the static homepage and choose between *Tetris* and *2048*.

---

## Technical Architecture Flowchart

```plaintext
                    +-----------------------+
                    |    User's Browser     |
                    +-----------------------+
                               |
                               v
                 +--------------------------+
                 |    NGINX Ingress LB      |
                 +--------------------------+
                      |                |
              +-------+------+   +-----+-------+
              | Static Homepage |   | Game Microservices |
              +----------------+   +--------------------+
                     / \                      /    \
          +---------+   +---------+   +---------+   +---------+
          | Tetris Pod|   | 2048 Pod|   | Other Pods (Future) |
          +-----------+   +---------+   +---------------------+
```

---

## Contributing

We welcome contributions! If you have ideas to enhance the platform, please submit a pull request or file an issue on GitHub.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Enjoy the nostalgia, and happy gaming!

