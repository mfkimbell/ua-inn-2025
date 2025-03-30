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

  secret_environment_variables {
    key     = "API_URL"
    secret  = "API_URL"
    version = 1
  }

  secret_environment_variables {
    key     = "NEXTAUTH_SECRET"
    secret  = "NEXTAUTH_SECRET"
    version = 2
  }

  secret_environment_variables {
    key     = "NEXTAUTH_URL"
    secret  = "NEXTAUTH_URL"
    version = 1
  }

  secret_environment_variables {
    key     = "JWT_SECRET"
    secret  = "JWT_SECRET"
    version = 2
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
  member    = "serviceAccount:uahackathon-455214@appspot.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "cloud_function_access_nextauth_secret" {
  secret_id = google_secret_manager_secret.NEXTAUTH_SECRET.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:uahackathon-455214@appspot.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "cloud_function_access_nextauth_url" {
  secret_id = google_secret_manager_secret.NEXTAUTH_URL.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:uahackathon-455214@appspot.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "cloud_function_access_jwt_secret" {
  secret_id = google_secret_manager_secret.JWT_SECRET.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:uahackathon-455214@appspot.gserviceaccount.com"
}
