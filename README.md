
![worksync_logo](https://github.com/user-attachments/assets/b38586f5-7658-4020-9998-0c6eb48cfbae)

## Overview

Built in 24 hours for UA Hackathon 2025. This project automatically provisions inventory and suggestion-tracking workflows on Google Cloud. It leverages Terraform and GitHub Actions to provision Cloud Run, store container images in Artifact Registry, and manage secrets via Secrets Manager. The application features a Next.js frontend (with React, Redux, and NextAuth-style sessions) and a FastAPI backend connected to CockroachDB via SQLAlchemy. Firebase provides additional user-facing services and authentication. Administrators can manage requests, calculate costs, maintain inventory, and track spending/request data on a dashboard, while end users submit and monitor requests in real time.


## Architechture

<img src="https://github.com/user-attachments/assets/8ae8e413-85f8-4487-af99-0b50463c727a" alt="worksync_arch" width="800" />


## Tools

- **Terraform** – Infrastructure as Code on GCP  
- **GitHub Actions** – CI/CD pipeline for container builds and deployments  
- **Next.js** – React-based frontend framework  
- **Redux** – Global state management in the frontend  
- **Firebase** – User services, authentication, and hosting for parts of the app  
- **FastAPI** – Python backend with secure endpoints  
- **SQLAlchemy** – ORM for database interaction  
- **CockroachDB** – Production database for scalability  
- **SQLite** – Dev/test database for local development  
- **Cloud Run** – Serverless container environment for the backend  
- **Artifact Registry** – Secure storage of Docker images  
- **Secrets Manager** – Manages secrets for the application  

