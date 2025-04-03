# Provider configuration
provider "aws" {
  region = var.aws_region
}

# CloudWatch module for logging
module "cloudwatch" {
  source = "./modules/cloudwatch"

  api_gateway_log_group_name = "/aws/apigateway/${var.project_name}-api-gateway"
  lambda_log_group_name      = "/aws/lambda/${var.project_name}-api"
  log_retention_days         = var.log_retention_days
}

# IAM module for roles and policies
module "iam" {
  source = "./modules/iam"
}

# API Gateway module
module "api_gateway" {
  source = "./modules/api_gateway"

  api_gateway_name   = "${var.project_name}-api-gateway"
  allow_origins      = split(",", var.allowed_origins)
  stage_name         = var.environment
  log_group_arn      = module.cloudwatch.api_gateway_log_group_arn
  lambda_invoke_arn  = module.lambda.lambda_invoke_arn

}

# Lambda module
module "lambda" {
  source = "./modules/lambda"

  function_name     = "${var.project_name}-api"
  lambda_zip_path   = var.lambda_zip_path
  lambda_handler    = var.lambda_handler
  lambda_runtime    = var.lambda_runtime
  lambda_role_arn   = module.iam.lambda_role_arn
  lambda_timeout    = var.lambda_timeout
  lambda_memory_size = var.lambda_memory_size
  
  environment_variables = {
    NODE_ENV        = var.environment
    ALLOWED_ORIGINS = var.allowed_origins
    DATABASE_URL    = var.database_url
  }
  
  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids
  
  # API Gateway execution ARN for Lambda permissions
  api_gateway_execution_arn = module.api_gateway.api_gateway_execution_arn

  # Depends on CloudWatch for logging
  depends_on = [module.cloudwatch]
}

# Output the API Gateway URL
output "api_gateway_url" {
  value = module.api_gateway.api_gateway_url
  description = "The URL of the API Gateway"
}
