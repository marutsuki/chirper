variable "api_gateway_name" {
  type        = string
  default     = "chirper-api-gateway"
}

variable "allow_origins" {
  type        = list(string)
  default     = ["https://chirper.marutsuki.io"]
}

variable "allow_methods" {
  type        = list(string)
  default     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}

variable "allow_headers" {
  type        = list(string)
  default     = ["Content-Type", "Authorization"]
}

variable "allow_credentials" {
  type        = bool
  default     = true
}

variable "stage_name" {
  type        = string
  default     = "prod"
}

variable "log_group_arn" {
  type        = string
}

variable "lambda_invoke_arn" {
  type        = string
}
