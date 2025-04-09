variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g., production, staging)"
}

variable "ami_id" {
  type        = string
  description = "AMI ID for the EC2 instance (Amazon Linux 2023 recommended)"
  default     = "ami-04b3f96fa99d40135"
}

variable "key_name" {
  type        = string
  description = "Name of the SSH key pair for EC2 instance access"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the EC2 instance will be launched"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC where the EC2 instance will be created"
}

variable "allowed_origins" {
  type        = string
  description = "Comma-separated list of allowed origins for CORS"
}

variable "database_url" {
  type        = string
  description = "Database connection string"
  sensitive   = true
}

variable "deployment_bucket" {
  type        = string
  description = "S3 bucket name for deployment packages"
}

variable "log_group_name" {
  type        = string
  description = "CloudWatch log group name for EC2 instance logs"
}

variable "log_retention_days" {
  type        = number
  description = "Number of days to retain logs"
  default     = 30
}

variable "secretsmanager_secret_arn" {
  type        = string
  description = "ARN of the Secrets Manager secret"
}

variable "role_name" {
  type        = string
  description = "IAM role name for the EC2 instance"
}

variable "security_group_ids" {
  type        = list(string)
  description = "Security group ID for the EC2 instance"
}