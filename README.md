![worksync_logo-1](https://github.com/user-attachments/assets/0794ac07-de95-4aa8-a7f2-488c3f57c53d)

## Overview

Built in 24 hours for UA Hackathon 2025. An automated DevOps template for digitizing an organization’s inventory and suggestion-tracking workflows on Google Cloud. 
It leverages Terraform and GitHub Actions to provision infrastructure on Cloud Run, store container images in Artifact Registry, 
and manage secrets in Secrets Manager. The web application is built with Next.js, React, Redux, and NextAuth‐style session handling 
on the frontend, with a FastAPI backend connected to CockroachDB via SQLAlchemy. Firebase is integrated for additional user-facing 
services and authentication flows. Administrators can view all suggestions/requests, automatically calculate costs, add items to 
inventory, and visualize spending data in a dashboard. End users can submit and track requests in real time.


## Architechture

![worksync_arch](https://github.com/user-attachments/assets/8ae8e413-85f8-4487-af99-0b50463c727a)
