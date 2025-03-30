resource "google_project_service" "enable_services" {
  for_each = toset([
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "containerregistry.googleapis.com",
    "storage.googleapis.com",
    "iam.googleapis.com"
  ])

  project = var.project_id
  service = each.key
}
