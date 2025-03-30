
![worksync_logo](https://github.com/user-attachments/assets/b38586f5-7658-4020-9998-0c6eb48cfbae)

## Overview

Built in 24 hours for UA Hackathon 2025. This project automatically provisions inventory and suggestion-tracking workflows on Google Cloud. It leverages Terraform and GitHub Actions to provision Cloud Run, store container images in Artifact Registry, and manage secrets via Secrets Manager. The application features a Next.js frontend (with React, Redux, and NextAuth-style sessions) and a FastAPI backend connected to CockroachDB via SQLAlchemy. The NextJS app is zipped and run in Google Cloud Functions, which Firebase points to. Administrators can manage requests, calculate costs, maintain inventory, and track spending/request data on a dashboard, while end users submit and monitor requests in real time.

## Demo
[
https://drive.google.com/file/d/1GSbjWGnQeYZLSXnVpPSrn1_3c7VFLWOJ/view?usp=sharing](https://discord.com/channels/1011733149178409021/1355570917849436391/1355921475210580080)

## Architechture

<img src="https://github.com/user-attachments/assets/a219a942-204f-4569-8677-54d1adb15b2e" alt="worksync_arch" width="800" />



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


### Landing Page
<img width="1360" alt="Screenshot 2025-03-30 at 12 57 33 AM" src="https://github.com/user-attachments/assets/51b15b4c-5239-44e2-9fc3-cd63cc03b256" />

### Admin Requests
<img width="1360" alt="Screenshot 2025-03-30 at 12 57 23 AM" src="https://github.com/user-attachments/assets/e6513673-2872-4b8a-81bf-fb4604233528" />

### Admin Suggestions
<img width="1354" alt="Screenshot 2025-03-30 at 12 59 11 AM" src="https://github.com/user-attachments/assets/f43e8498-87e1-4eab-8945-83dfb55b8044" />

### Admin Inventory
<img width="1322" alt="Screenshot 2025-03-30 at 12 58 49 AM" src="https://github.com/user-attachments/assets/f5932133-d72b-4979-9f6e-8c2395a54aae" />

### Admin Analytics
<img width="1314" alt="Screenshot 2025-03-30 at 12 59 39 AM" src="https://github.com/user-attachments/assets/6547b961-63d4-432d-8ed2-d27d10fbf5ab" />

### Employee Requests
<img width="1306" alt="Screenshot 2025-03-30 at 1 00 13 AM" src="https://github.com/user-attachments/assets/d71a3716-7b7a-4a6c-89e5-b24e7e068634" />

and so on...
