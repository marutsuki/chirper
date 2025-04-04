# CloudWatch log group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = var.api_gateway_log_group_name
  retention_in_days = var.log_retention_days
}
