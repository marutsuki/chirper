variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC where the RDS instance will be created"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs where the RDS instance can be created"
}

variable "db_username" {
  type    = string
  default = "postgres"
}

variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for the RDS instance"
}

variable "db_secret_name" {
  type        = string
  description = "Name of the secret to store the database password"
}