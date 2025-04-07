data "aws_secretsmanager_secret" "password" {
  name = "test-db-password-11"
}

data "aws_secretsmanager_secret_version" "password" {
  secret_id = data.aws_secretsmanager_secret.password.id
}

resource "aws_db_instance" "chirper" {
  allocated_storage   = 10
  db_name             = "chirper_db"
  engine              = "postgres"
  engine_version      = "17"
  instance_class      = "db.t3.micro"
  username            = var.db_username
  password            = data.aws_secretsmanager_secret_version.password.secret_string
  skip_final_snapshot = true
}
