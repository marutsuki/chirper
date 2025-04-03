variable "aws_region" {
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  default     = "chirper"
}

variable "environment" {
  type        = string
  default     = "prod"
}

variable "log_retention_days" {
  type        = number
  default     = 30
}

variable "allowed_origins" {
  type        = string
  default     = "https://chirper.marutsuki.io"
}

variable "lambda_zip_path" {
  type        = string
  default     = "../chirper-backend/dist/lambda-deployment.zip"
}

variable "lambda_handler" {
  type        = string
  default     = "lambda.lambdaHandler"
}

variable "lambda_runtime" {
  type        = string
  default     = "nodejs22.x"
}

variable "lambda_timeout" {
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  type        = number
  default     = 512
}

variable "database_url" {
  type        = string
  default     = ""
  sensitive   = true
}

variable "subnet_ids" {
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  type        = list(string)
  default     = []
}
