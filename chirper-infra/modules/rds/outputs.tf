output "db_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.chirper.endpoint
}

output "db_name" {
  description = "The database name"
  value       = aws_db_instance.chirper.db_name
}

output "db_username" {
  description = "The master username for the database"
  value       = aws_db_instance.chirper.username
}

output "db_port" {
  description = "The database port"
  value       = 5432
}

output "db_connection_string" {
  description = "PostgreSQL connection string for the database"
  value       = "postgresql://${aws_db_instance.chirper.username}:${data.aws_secretsmanager_secret_version.password.secret_string}@${aws_db_instance.chirper.endpoint}/${aws_db_instance.chirper.db_name}"
  sensitive   = true
}
