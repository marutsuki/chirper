output "api_gateway_log_group_arn" {
  description = "ARN of the CloudWatch log group for API Gateway"
  value       = aws_cloudwatch_log_group.api_gateway_logs.arn
}

output "lambda_log_group_arn" {
  description = "ARN of the CloudWatch log group for Lambda"
  value       = aws_cloudwatch_log_group.lambda_logs.arn
}
