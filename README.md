# 2048 Game Deployment on EKS

## Project Overview

This project involves deploying the popular game 2048 on an Amazon EKS cluster and exposing it via a Load Balancer. The EKS cluster and the 2048 game deployment are monitored using Prometheus and Grafana.

## Flowchart




```mermaid
graph TD;
    subgraph CI/CD Pipeline
        A[Code Repository (GitHub/CodeCommit)] -->|Code Changes| B[CodePipeline];
        B --> C[CodeBuild];
        C --> D[AWS Amplify];
        C --> E[Lambda Deployment];
    end

    subgraph AWS Infrastructure
        subgraph Frontend
            D --> I[AWS Amplify];
        end

        subgraph Backend
            E --> F[API Gateway];
            F --> G[Lambda Functions];
        end

        subgraph Database
            G --> H[Amazon RDS (MySQL)];
        end

        subgraph Networking
            I --> J[CloudFront (CDN)];
            F --> K[VPC];
            H --> K;
        end
    end
