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

resource "google_compute_backend_bucket" "static_backend" {
  name        = "${local.component_name}-backend-bucket"
  description = "Backend bucket for frontend of ${var.app_name}"
  bucket_name = "${google_storage_bucket.static_site.name}"
  enable_cdn  = true
}

resource "google_compute_url_map" "static_map" {
  name            = "${local.component_name}-lb"
  default_service = "${google_compute_backend_bucket.static_backend.self_link}"
}

resource "google_compute_global_forwarding_rule" "ipv4-https" {
  name       = "${local.component_name}-https"
  target     = "${google_compute_backend_bucket.static_backend.self_link}"
  ip_address = "${google_compute_global_address.ipv4.address}"
  port_range = "443"
  depends_on = ["google_compute_global_address.default"]
}
resource "google_compute_global_address" "ipv4" {
  name       = "${var.app_name}-fe-address"
}