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

variable "db_secret_name" {
  type        = string
  default     = "chirper-db-secret"
}