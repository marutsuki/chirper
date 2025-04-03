resource "aws_db_instance" "default" {
  allocated_storage    = 10
  db_name              = "chirper_db"
  engine               = "postgresql"
  engine_version       = "17.0"
  instance_class       = "db.t3.micro"
  username             = "foo"
  password             = "foobarbaz"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
}