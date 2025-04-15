locals {
    cdn_origin_id = "chirperS3Origin"
}

resource "aws_cloudfront_origin_access_identity" "chirper_oai" {
    comment = "Origin Access Identity for Chirper CDN"
}

resource "aws_cloudfront_distribution" "chirper_distribution" {
    origin {
        domain_name = var.bucket_domain_name
        origin_id   = local.cdn_origin_id

        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.chirper_oai.cloudfront_access_identity_path
        }
    }

    enabled = true
    is_ipv6_enabled = true
    comment = "Chirper CDN Distribution"
    default_root_object = "index.html"
    
    custom_error_response {
        error_code = 403
        response_page_path = "/index.html"
        response_code = 200
        error_caching_min_ttl = 0
    }

    custom_error_response {
        error_code = 404
        response_page_path = "/index.html"
        response_code = 200
        error_caching_min_ttl = 0
    }

    aliases = var.cdn_domain_names

    default_cache_behavior {
        target_origin_id = local.cdn_origin_id

        allowed_methods = ["GET", "HEAD", "OPTIONS"]
        cached_methods = ["GET", "HEAD"]

        viewer_protocol_policy = "redirect-to-https"
        compress = true

        forwarded_values {
            query_string = false
            cookies {
                forward = "none"
            }
        }

        min_ttl     = 0
        default_ttl = 86400
        max_ttl     = 31536000
    }

    price_class = "PriceClass_100"

    viewer_certificate {
        cloudfront_default_certificate = true
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }
}