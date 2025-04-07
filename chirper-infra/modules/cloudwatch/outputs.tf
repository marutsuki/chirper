output "api_gateway_log_group_arn" {
  description = "ARN of the CloudWatch log group for API Gateway"
  value       = aws_cloudwatch_log_group.api_gateway_logs.arn
}

output "ec2_log_group_name" {
  description = "Name of the CloudWatch log group for EC2 instance"
  value       = aws_cloudwatch_log_group.ec2_logs.name
}