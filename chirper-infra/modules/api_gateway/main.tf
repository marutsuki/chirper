# API Gateway REST API
resource "aws_api_gateway_rest_api" "chirper_api_gateway" {
  name          = var.api_gateway_name
}

# Enable CORS for the API Gateway
resource "aws_api_gateway_gateway_response" "cors" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'${join(",", var.allow_origins)}'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'${join(",", var.allow_headers)}'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'${join(",", var.allow_methods)}'"
    "gatewayresponse.header.Access-Control-Allow-Credentials" = "'${var.allow_credentials}'"
  }
}

resource "aws_api_gateway_stage" "chirper_api_stage" {
  rest_api_id = aws_api_gateway_rest_api.chirper_api_gateway.id
  stage_name  = var.stage_name
  deployment_id = aws_api_gateway_deployment.chirper_api_deployment.id
}

resource "aws_api_gateway_deployment" "chirper_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.chirper_api_gateway.id
  
  depends_on = [
    aws_api_gateway_integration.root_integration,
    aws_api_gateway_integration.options_integration,
    aws_api_gateway_integration_response.options_integration_response
  ]
  lifecycle {
    create_before_destroy = true
  }
}

# Root resource method and integration
resource "aws_api_gateway_method" "root_method" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root_integration" {
  rest_api_id             = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id             = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method             = aws_api_gateway_method.root_method.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = "ANY"
  uri                     = var.backend_endpoint
  connection_type         = "INTERNET"
}

# OPTIONS method for CORS
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  type          = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  status_code   = "200"
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id   = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  http_method   = aws_api_gateway_method.options_method.http_method
  status_code   = aws_api_gateway_method_response.options_200.status_code
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'${join(",", var.allow_headers)}'"
    "method.response.header.Access-Control-Allow-Methods" = "'${join(",", var.allow_methods)}'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${join(",", var.allow_origins)}'"
    "method.response.header.Access-Control-Allow-Credentials" = "'${var.allow_credentials}'"
  }
}
