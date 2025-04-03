# API Gateway REST API
resource "aws_apigatewayv2_api" "chirper_api_gateway" {
  name          = var.api_gateway_name
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins     = var.allow_origins
    allow_methods     = var.allow_methods
    allow_headers     = var.allow_headers
    allow_credentials = var.allow_credentials
  }
}

# API Gateway stage
resource "aws_apigatewayv2_stage" "chirper_api_stage" {
  api_id      = aws_apigatewayv2_api.chirper_api_gateway.id
  name        = var.stage_name
  auto_deploy = true
  
  access_log_settings {
    destination_arn = var.log_group_arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      path           = "$context.path"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      integrationLatency = "$context.integrationLatency"
    })
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.chirper_api_gateway.id
  integration_type = "AWS_PROXY"
  
  integration_uri    = var.lambda_invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "api_route" {
  api_id    = aws_apigatewayv2_api.chirper_api_gateway.id
  route_key = "ANY /{proxy+}"
  
  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}
