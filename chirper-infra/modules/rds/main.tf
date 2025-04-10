data "aws_secretsmanager_secret" "password" {
  name = var.db_secret_name
}

data "aws_secretsmanager_secret_version" "password" {
  secret_id = data.aws_secretsmanager_secret.password.id
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project_name}-rds-subnet-group"
  }
}

resource "aws_db_parameter_group" "rds_parameter_group" {
  name        = "${var.project_name}-rds-parameter-group"
  family      = "postgres17"

  tags = {
    Name = "${var.project_name} RDS Parameter Group"
  }

  parameter {
    name  = "rds.force_ssl"
    value = false
  }
}

resource "aws_db_instance" "chirper" {
  allocated_storage      = 10
  db_name                = "chirper_db"
  engine                 = "postgres"
  engine_version         = "17"
  instance_class         = "db.t3.micro"
  username               = var.db_username
  password               = data.aws_secretsmanager_secret_version.password.secret_string
  skip_final_snapshot    = true
  vpc_security_group_ids = var.security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  publicly_accessible    = false
  parameter_group_name = aws_db_parameter_group.rds_parameter_group.name

  tags = {
    Name = "${var.project_name}-database"
  }
}
