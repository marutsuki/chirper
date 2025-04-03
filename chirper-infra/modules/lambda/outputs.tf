output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.chirper_api.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.chirper_api.arn
}

output "lambda_invoke_arn" {
  description = "Invoke ARN of the Lambda function"
  value       = aws_lambda_function.chirper_api.invoke_arn
}
