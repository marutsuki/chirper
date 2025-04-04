# Lambda function
resource "aws_lambda_function" "chirper_serverless" {
  function_name = var.function_name
  description   = "Chirper API backend"

  # Use the deployment package from the backend build
  filename = var.lambda_zip_path
  handler  = var.lambda_handler
  runtime  = var.lambda_runtime

  role        = var.lambda_role_arn
  timeout     = var.lambda_timeout
  memory_size = var.lambda_memory_size

  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = var.environment_variables
  }

  dynamic "vpc_config" {
    for_each = length(var.subnet_ids) > 0 ? [1] : []
    content {
      subnet_ids         = var.subnet_ids
      security_group_ids = var.security_group_ids
    }
  }
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chirper_serverless.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = var.api_gateway_execution_arn
}

# CloudWatch log group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.chirper_serverless.function_name}"
  retention_in_days = 30
}
