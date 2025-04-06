output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.chirper_api_gateway.id
}

output "api_gateway_execution_arn" {
  description = "Execution ARN of the API Gateway"
  value       = aws_api_gateway_rest_api.chirper_api_gateway.execution_arn
}

output "api_gateway_url" {
  description = "URL of the API Gateway stage"
  value       = aws_api_gateway_stage.chirper_api_stage.invoke_url
}
