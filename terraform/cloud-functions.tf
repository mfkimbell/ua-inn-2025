resource "google_cloudfunctions_function" "nextjs_function" {
  provider  = google
  name      = "nextjs-ssr-function"
  runtime   = "nodejs22"
  region    = var.region
  available_memory_mb = 512
  timeout   = 60
  entry_point = "server"

  source_archive_bucket = google_storage_bucket.nextjs_server_bucket.name
  source_archive_object = google_storage_bucket_object.nextjs_source.name

  trigger_http = true

  environment_variables = {
    NODE_ENV = "production"
    API_URL = google_secret_manager_secret.API_URL.id
    NEXTAUTH_SECRET = google_secret_manager_secret.NEXTAUTH_SECRET.id
  }
}

resource "google_cloudfunctions_function_iam_member" "public_invoker" {
  project        = var.project_id
  region         = var.region
  cloud_function = google_cloudfunctions_function.nextjs_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

resource "google_secret_manager_secret_iam_member" "cloud_function_access_api_url" {
  secret_id = google_secret_manager_secret.API_URL.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_cloudfunctions_function.nextjs_function.service_account_email}"
}


resource "google_secret_manager_secret_iam_member" "cloud_function_access_nextauth_secret" {
  secret_id = google_secret_manager_secret.NEXTAUTH_SECRET.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_cloudfunctions_function.nextjs_function.service_account_email}"
}
