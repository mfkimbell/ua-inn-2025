resource "google_cloud_run_service" "worksync_api_service" {
  name     = "worksync-api"
  location = var.region
  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "1"
      }
    }
    spec {
      containers {
        image   = "us-central1-docker.pkg.dev/${var.project_id}/worksync/worksync-api:latest"
        command = ["./start.sh"]
        ports {
          container_port = 8000
        }
        env {
          name = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = "JWT_SECRET"
              key  = "latest"
            }
          }
        }
        env {
          name = "APP_MODE"
          value_from {
            secret_key_ref {
              name = "APP_MODE"
              key  = "latest"
            }
          }
        }
        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = "DATABASE_URL"
              key  = "latest"
            }
          }
        }
      }
      container_concurrency = 1
    }
  }
  metadata {
    annotations = {
      "run.googleapis.com/service-account" = google_service_account.worksync_api_service_account.email
    }
  }
}