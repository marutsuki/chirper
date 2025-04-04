output "migration_lambda_arn" {
  description = "ARN of the migration Lambda function"
  value       = aws_lambda_function.db_migration_lambda.arn
}

output "migration_lambda_name" {
  description = "Name of the migration Lambda function"
  value       = aws_lambda_function.db_migration_lambda.function_name
}

output "migration_status" {
  description = "Status of the migration Lambda invocation"
  value       = aws_lambda_invocation.run_migrations.result
}
