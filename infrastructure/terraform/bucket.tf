resource "google_storage_bucket" "static_site" {
  name     = "${var.app_name}-frontend"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_compute_backend_bucket" "static_backend" {
  name        = "${var.app_name}-backend-bucket"
  description = "Backend bucket for frontend of ${var.app_name}"
  bucket_name = "${google_storage_bucket.static_site.name}"
  enable_cdn  = true
}