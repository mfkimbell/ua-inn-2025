#### Terraform Service Account ####

resource "google_service_account" "terraform_sa" {
  account_id   = var.service_account_name
  display_name = "Terraform Service Account"

  depends_on = [google_project_service.enable_services]
}


resource "google_project_iam_member" "terraform_sa_secret_manager" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

resource "google_project_iam_member" "terraform_sa_gcr" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

resource "google_project_iam_member" "terraform_sa_gar" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

resource "google_project_iam_member" "terraform_sa_gcs" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

#### GitHub Actions Service Account ####

resource "google_service_account" "github_actions_sa" {
  account_id   = "github-actions-sa"
  display_name = "GitHub Actions Service Account"
}

resource "google_project_iam_member" "github_actions_gar_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

#### Worksync API Service Account ####

resource "google_service_account" "worksync_api_service_account" {
  account_id   = "worksync-api-service-account"
  display_name = "Worksync API Service Account"
}


resource "google_cloud_run_service_iam_member" "worksync_api_service_invoker" {
  service  = google_cloud_run_service.worksync_api_service.name
  location = google_cloud_run_service.worksync_api_service.location
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.worksync_api_service_account.email}"
}

#### Compute Service Account ####

resource "google_project_iam_member" "compute_service_account_access" {
  project = var.project_id
  role    = "roles/cloudfunctions.invoker"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "compute_service_account_access_2" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
}
resource "google_project_iam_member" "compute_service_account_access_3" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "compute_service_account_access" {
  secret_id = google_secret_manager_secret.JWT_SECRET.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.JWT_SECRET]
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_access" {
  secret_id = google_secret_manager_secret.JWT_SECRET.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.JWT_SECRET]
}

resource "google_secret_manager_secret_iam_member" "app_mode_access" {
  secret_id = google_secret_manager_secret.APP_MODE.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.APP_MODE]
}

resource "google_secret_manager_secret_iam_member" "database_url_access" {
  secret_id = google_secret_manager_secret.DATABASE_URL.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:362027342886-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.DATABASE_URL]
}


### Firebase Service Account ###

resource "google_project_iam_member" "firebase_service_account_access" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:uahackathon-455214@appspot.gserviceaccount.com"
}
