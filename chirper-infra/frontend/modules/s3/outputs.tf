output website_endpoint {
    description = "Website endpoint of the S3 bucket"
    value       = aws_s3_bucket.chirper_bucket.website_endpoint
}