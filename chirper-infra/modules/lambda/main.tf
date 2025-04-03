# Lambda function
resource "aws_lambda_function" "chirper_api" {
  function_name = var.function_name
  description   = "Chirper API backend"
  
  # Use the deployment package from the backend build
  filename      = var.lambda_zip_path
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime
  
  role          = var.lambda_role_arn
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size
  
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  
  environment {
    variables = var.environment_variables
  }
}