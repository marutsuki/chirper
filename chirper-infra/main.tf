provider "aws" {
  region = var.aws_region
}

module "secret" {
  source = "./modules/secret"
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

  secretsmanager_secret_arn = module.secret.secrets_manager_arn

  depends_on = [module.secret]
}

# API Gateway module
module "api_gateway" {
  source = "./modules/api_gateway"

  api_gateway_name  = "${var.project_name}-api-gateway"
  allow_origins     = split(",", var.allowed_origins)
  stage_name        = var.environment
  log_group_arn     = module.cloudwatch.api_gateway_log_group_arn
  lambda_invoke_arn = module.lambda.lambda_invoke_arn

}

# Lambda module
module "lambda" {
  source = "./modules/lambda"

  function_name      = "${var.project_name}-api"
  lambda_zip_path    = var.lambda_zip_path
  lambda_handler     = var.lambda_handler
  lambda_runtime     = var.lambda_runtime
  lambda_role_arn    = module.iam.lambda_role_arn
  lambda_timeout     = var.lambda_timeout
  lambda_memory_size = var.lambda_memory_size

  environment_variables = {
    NODE_ENV        = var.environment
    ALLOWED_ORIGINS = var.allowed_origins
    DATABASE_URL    = module.rds.db_connection_string
  }

  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids

  # API Gateway execution ARN for Lambda permissions
  api_gateway_execution_arn = module.api_gateway.api_gateway_execution_arn

  # Depends on CloudWatch for logging
  depends_on = [module.cloudwatch]
}


module "rds" {
  source = "./modules/rds"

  depends_on = [module.secret]
}

# Migration Lambda module for running database migrations
module "migration_lambda" {
  source = "./modules/migration_lambda"

  function_name   = "${var.project_name}-db-migrations"
  lambda_zip_path = var.lambda_zip_path
  lambda_runtime  = var.lambda_runtime
  lambda_role_arn = module.iam.lambda_role_arn
  environment     = var.environment
  database_url    = module.rds.db_connection_string

  rds_endpoint = module.rds.db_endpoint
  rds_username = module.rds.db_username
  rds_db_name  = module.rds.db_name

  subnet_ids         = var.subnet_ids
  security_group_ids = var.security_group_ids

  depends_on = [module.rds]
}

# Output the API Gateway URL
output "api_gateway_url" {
  value       = module.api_gateway.api_gateway_url
  description = "The URL of the API Gateway"
}
