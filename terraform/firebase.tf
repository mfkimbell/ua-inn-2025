resource "google_firebase_project" "worksync_project" {
  provider = google-beta
  project  = var.project_id
}

resource "google_firebase_web_app" "worksync_ui" {
  provider = google-beta
  project  = var.project_id
  display_name = "Worksync UI"
}

resource "google_firebase_hosting_site" "worksync_ui_site" {
  provider = google-beta
  project  = var.project_id
  site_id  = "worksync-ui-123"
}

resource "google_firebase_hosting_version" "worksync_ui_version" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.worksync_ui_site.site_id
  config {
    rewrites {
      glob = "/**"
      function = google_cloudfunctions_function.nextjs_function.name
    }
  }
}

resource "google_firebase_hosting_release" "worksync_ui_release" {
  provider = google-beta
  site_id  = google_firebase_hosting_site.worksync_ui_site.site_id
  version_name = google_firebase_hosting_version.worksync_ui_version.name
}
