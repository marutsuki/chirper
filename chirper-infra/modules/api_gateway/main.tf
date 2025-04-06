# API Gateway REST API
resource "aws_api_gateway_rest_api" "chirper_api_gateway" {
  name          = var.api_gateway_name
}

resource "aws_api_gateway_stage" "chirper_api_stage" {
  rest_api_id = aws_api_gateway_rest_api.chirper_api_gateway.id
  stage_name  = var.stage_name
  deployment_id = aws_api_gateway_deployment.chirper_api_deployment.id
}

resource "aws_api_gateway_deployment" "chirper_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.chirper_api_gateway.id
  
  depends_on = [ aws_api_gateway_integration.lambda_integration ]
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_resource" "chirper_api_proxy" {
  rest_api_id      = aws_api_gateway_rest_api.chirper_api_gateway.id
  parent_id        = aws_api_gateway_rest_api.chirper_api_gateway.root_resource_id
  path_part        = "{proxy+}"
}

resource "aws_api_gateway_method" "chirper_api_proxy" {
  rest_api_id      = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id      = aws_api_gateway_resource.chirper_api_proxy.id
  http_method      = "ANY"
  authorization    = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id      = aws_api_gateway_rest_api.chirper_api_gateway.id
  resource_id      = aws_api_gateway_resource.chirper_api_proxy.id
  http_method      = aws_api_gateway_method.chirper_api_proxy.http_method

  type = "AWS_PROXY"
  integration_http_method = "POST"  
  uri              = var.lambda_invoke_arn
}
