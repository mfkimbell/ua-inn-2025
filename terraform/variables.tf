variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "service_account_name" {
  description = "Terraform Service Account Name"
  type        = string
  default     = "terraform-sa"
}

variable "gcs_bucket_name" {
  description = "GCS bucket name for Terraform state"
  type        = string
  default     = "terraform-state-bucket"
}