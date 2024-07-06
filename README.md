# 2048 Game Deployment on EKS

## Project Overview

This project involves deploying the popular game 2048 on an Amazon EKS cluster and exposing it via a Load Balancer. The EKS cluster and the 2048 game deployment are monitored using Prometheus and Grafana.

## Flowchart

```mermaid
graph TD;
    A[Start] --> B[Create EKS Cluster]
    B --> C[Deploy 2048 Game]
    C --> D[Configure Load Balancer]
    D --> E[Set up Prometheus and Grafana]
    E --> F[Monitor Cluster and Game]
    F --> G[End]
