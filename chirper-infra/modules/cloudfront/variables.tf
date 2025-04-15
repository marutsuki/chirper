variable bucket_domain_name {
  description = "The name of the S3 bucket to store the Lambda zip file"
  type        = string
}

variable cdn_domain_names {
  description = "The domain name for the CloudFront distribution"
  type        = list(string)
}