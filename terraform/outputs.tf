output "firebase_hosting_url" {
  value = "https://${google_firebase_hosting_site.worksync_ui_site.site_id}.web.app"
}

output "cloud_function_url" {
  value = google_cloudfunctions_function.nextjs_function.https_trigger_url
}
