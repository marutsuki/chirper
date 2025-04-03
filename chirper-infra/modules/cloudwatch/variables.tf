variable "api_gateway_log_group_name" {
  type        = string
  default     = "/aws/apigateway/chirper-api-gateway"
}

variable "lambda_log_group_name" {
  type        = string
  default     = "/aws/lambda/chirper-serverless"
}

variable "log_retention_days" {
  type        = number
  default     = 30
}
