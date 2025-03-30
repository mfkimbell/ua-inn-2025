resource "google_artifact_registry_repository" "worksync" {
  provider = google
  repository_id = "worksync"
  format = "DOCKER"
  location = var.region
  description = "Docker repository for worksync"
}