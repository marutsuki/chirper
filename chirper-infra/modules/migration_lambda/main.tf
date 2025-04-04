resource "aws_lambda_function" "db_migration_lambda" {
  function_name = var.function_name
  description   = "lambda function to run Knex migrations"
  
  filename      = var.lambda_zip_path
  handler       = "lambda/lambda-migration.runMigrations"
  runtime       = var.lambda_runtime
  
  role          = var.lambda_role_arn
  timeout       = 300
  memory_size   = 512  # More memory for migrations
  
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  
  environment {
    variables = {
      NODE_ENV     = var.environment
      DATABASE_URL = var.database_url
    }
  }
  
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_cloudwatch_log_group" "migration_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.db_migration_lambda.function_name}"
  retention_in_days = 30
}

resource "aws_lambda_invocation" "run_migrations" {
  function_name = aws_lambda_function.db_migration_lambda.function_name
  
  input = jsonencode({
    action = "run_migrations"
  })
  
  triggers = {
    redeployment = sha256(jsonencode({
      rds_endpoint = var.rds_endpoint
      rds_username = var.rds_username
      rds_db_name  = var.rds_db_name
    }))
  }
}
