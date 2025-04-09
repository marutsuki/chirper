provider "aws" {
  region = var.aws_region
}

module "secret" {
  source = "./modules/secret"

  db_secret_name = var.db_secret_name
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
  deployment_bucket  = aws_s3_bucket.deployment_bucket.bucket

  depends_on = [module.secret]
}

module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
}

# API Gateway module
module "api_gateway" {
  source = "./modules/api_gateway"

  api_gateway_name  = "${var.project_name}-api-gateway"
  allow_origins     = split(",", var.allowed_origins)
  stage_name        = var.environment
  log_group_arn     = module.cloudwatch.api_gateway_log_group_arn
  backend_endpoint  = module.ec2.ec2_endpoint

  depends_on = [module.ec2]
}

# S3 bucket for deployment packages
resource "aws_s3_bucket" "deployment_bucket" {
  bucket = "${var.project_name}-deployments-${random_string.bucket_suffix.result}"

  tags = {
    Name = "${var.project_name}-deployment"
  }
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# EC2 module
module "ec2" {
  source = "./modules/ec2"

  project_name              = var.project_name
  environment               = var.environment
  role_name                 = module.iam.ec2_role_name
  key_name                  = var.ec2_key_name
  subnet_id                 = module.vpc.public_subnet_ids[0]
  vpc_id                    = module.vpc.vpc_id
  allowed_origins           = var.allowed_origins
  database_url              = module.rds.db_connection_string
  deployment_bucket         = aws_s3_bucket.deployment_bucket.bucket
  log_group_name            = module.cloudwatch.ec2_log_group_name
  log_retention_days        = var.log_retention_days
  secretsmanager_secret_arn = module.secret.secrets_manager_arn
  security_group_ids        = [module.vpc.ec2_security_group_id]

  depends_on = [module.vpc, module.cloudwatch, aws_s3_bucket.deployment_bucket]
}

# RDS module
module "rds" {
  source = "./modules/rds"

  project_name          = var.project_name
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnet_ids
  security_group_ids    = [module.vpc.rds_security_group_id]
  db_secret_name        = var.db_secret_name
  depends_on = [module.vpc, module.secret]
}

# Migration Lambda module for running database migrations
module "migration_lambda" {
  source = "./modules/migration_lambda"

  function_name   = "${var.project_name}-db-migrations"
  lambda_zip_path = "../out/backend-deployment-lambda.zip"
  lambda_runtime  = "nodejs22.x"
  lambda_role_arn = module.iam.lambda_role_arn
  environment     = var.environment
  database_url    = module.rds.db_connection_string

  rds_endpoint = module.rds.db_endpoint
  rds_username = module.rds.db_username
  rds_db_name  = module.rds.db_name

  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.vpc.lambda_security_group_id]

  depends_on = [module.vpc, module.rds]
}

# Outputs
output "api_gateway_url" {
  value       = module.api_gateway.api_gateway_url
  description = "The URL of the API Gateway"
}

output "ec2_public_ip" {
  value       = module.ec2.ec2_public_ip
  description = "Public IP address of the EC2 instance"
}

output "ec2_endpoint" {
  value       = module.ec2.ec2_endpoint
  description = "HTTP endpoint for the EC2 instance"
}

output "deployment_bucket" {
  value       = aws_s3_bucket.deployment_bucket.bucket
  description = "S3 bucket for deployment packages"
}
