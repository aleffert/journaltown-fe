locals {
    component_name = "${var.app_name}-frontend"
}

resource "google_storage_bucket" "static_site" {
  name     = "${local.component_name}"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket_acl" "static_site" {
  bucket = "${google_storage_bucket.static_site.name}"
  default_acl = "publicRead"
  predefined_acl = "publicRead"
}

resource "google_compute_backend_bucket" "static_backend" {
  name        = "${local.component_name}-backend-bucket"
  description = "Backend bucket for frontend of ${var.app_name}"
  bucket_name = "${google_storage_bucket.static_site.name}"
  enable_cdn  = true
}
