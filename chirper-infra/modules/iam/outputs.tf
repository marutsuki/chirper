output "lambda_role_arn" {
  description = "ARN of the IAM role for Lambda execution"
  value       = aws_iam_role.chirper_lambda_role.arn
}

output "lambda_role_name" {
  description = "Name of the IAM role for Lambda execution"
  value       = aws_iam_role.chirper_lambda_role.name
}

output "lambda_secret_arn" {
  description = "ARN of the IAM role for accessing secrets"
  value       = aws_iam_role_policy_attachment.lambda_secrets_access
}

output "ec2_role_name" {
  description = "Name of the IAM role for EC2 instance"
  value       = aws_iam_role.chirper_ec2_role.name
}