terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "chirper_bucket" {
  bucket = var.chirper_bucket_name
}

resource "aws_s3_bucket_public_access_block" "chirper_bucket" {
  bucket = aws_s3_bucket.chirper_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "chirper_bucket" {
  bucket = aws_s3_bucket.chirper_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "chirper_bucket" {
  bucket = aws_s3_bucket.chirper_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "chirper_bucket" {
  bucket = aws_s3_bucket.chirper_bucket.id

  acl = "public-read"
  depends_on = [
    aws_s3_bucket_ownership_controls.chirper_bucket,
    aws_s3_bucket_public_access_block.chirper_bucket
  ]
}

resource "aws_s3_bucket_policy" "chirper_bucket" {
  bucket = aws_s3_bucket.chirper_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.chirper_bucket.arn,
          "${aws_s3_bucket.chirper_bucket.arn}/*",
        ]
      },
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.chirper_bucket
  ]
}
