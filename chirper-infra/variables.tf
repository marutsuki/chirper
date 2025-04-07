variable "aws_region" {
  type        = string
  default     = "ap-southeast-2"
}

variable "project_name" {
  type        = string
  default     = "chirper"
}

variable "environment" {
  type        = string
  default     = "production"
}

variable "log_retention_days" {
  type        = number
  default     = 30
}

variable "allowed_origins" {
  type        = string
  default     = "https://chirper.marutsuki.io"
}

# EC2 variables
variable "ec2_key_name" {
  type        = string
  description = "Name of the SSH key pair for EC2 instance access"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the EC2 instance will be launched"
  default     = ""
}

variable "ssh_allowed_cidr_blocks" {
  type        = list(string)
  description = "CIDR blocks allowed for SSH access"
  default     = ["0.0.0.0/0"] # In production, restrict this to specific IPs
}

# Lambda variables for migration Lambda
variable "lambda_zip_path" {
  type        = string
  default     = "../out/backend-deployment-lambda.zip"
  description = "Path to the Lambda deployment package (still needed for migration Lambda)"
}

variable "lambda_runtime" {
  type        = string
  default     = "nodejs22.x"
  description = "Runtime for the migration Lambda function"
}

variable "subnet_ids" {
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  type        = list(string)
  default     = []
}
