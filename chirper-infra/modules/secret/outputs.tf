output "secrets_manager_arn" {
    description = "Secrets Manager ARN"
    value = aws_secretsmanager_secret.password.arn
}
output "secrets_db_password" {
    description = "Password for the RDS DB"
    value = aws_secretsmanager_secret_version.password
}