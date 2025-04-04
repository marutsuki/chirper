variable "function_name" {
  type        = string
  default     = "chirper-db-migrations"
}

variable "lambda_zip_path" {
  type        = string
}

variable "lambda_runtime" {
  type        = string
  default     = "nodejs22.x"
}

variable "lambda_role_arn" {
  type        = string
}

variable "environment" {
  type        = string
  default     = "production"
}

variable "database_url" {
  type        = string
  sensitive   = true
}

variable "subnet_ids" {
  type        = list(string)
}

variable "security_group_ids" {
  type        = list(string)
}

variable "rds_endpoint" {
  type        = string
}

variable "rds_username" {
  type        = string
}

variable "rds_db_name" {
  type        = string
}
