output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.chirper_serverless.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.chirper_serverless.arn
}

output "lambda_invoke_arn" {
  description = "Invoke ARN of the Lambda function"
  value       = aws_lambda_function.chirper_serverless.invoke_arn
}
