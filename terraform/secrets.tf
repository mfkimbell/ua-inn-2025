data "google_project" "project" {
}

#### JWT Secret ####

resource "google_secret_manager_secret" "JWT_SECRET" {
  secret_id = "JWT_SECRET"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret" "APP_MODE" {
  secret_id = "APP_MODE"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "DATABASE_URL" {
  secret_id = "DATABASE_URL"
  replication {
    auto {}
  }
}


resource "google_secret_manager_secret" "API_URL" {
  secret_id = "API_URL"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "NEXTAUTH_SECRET" {
  secret_id = "NEXTAUTH_SECRET"
  replication {
    auto {}
  }
}
