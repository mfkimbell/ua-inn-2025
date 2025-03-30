resource "google_storage_bucket" "nextjs_server_bucket" {
  name = "worksync-nextjs-server-bucket"
  location = "US"
  uniform_bucket_level_access = true
  public_access_prevention = "enforced"
}

resource "google_storage_bucket_object" "nextjs_source" {
  name   = "worksync-ui.zip"
  bucket = google_storage_bucket.nextjs_server_bucket.name
  source = "../frontend/worksync-ui.zip"
}