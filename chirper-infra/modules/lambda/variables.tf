variable "function_name" {
  type        = string
  default     = "chirper-serverless"
}

variable "lambda_zip_path" {
  type        = string
}

variable "lambda_handler" {
  type        = string
  default     = "lambda.lambdaHandler"
}

variable "lambda_runtime" {
  type        = string
  default     = "nodejs22.x"
}

variable "lambda_role_arn" {
  type        = string
}

variable "lambda_timeout" {
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  type        = number
  default     = 512
}

variable "environment_variables" {
  type        = map(string)
  default     = {}
}
