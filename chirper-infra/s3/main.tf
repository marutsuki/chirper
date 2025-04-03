provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_s3_bucket" "chirper_bucket" {
  bucket = var.chirper_bucket
}
