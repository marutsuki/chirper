output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.chirper_vpc.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = [aws_subnet.chirper_public_vpc.id]
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = [aws_subnet.chirper_private_vpc_1.id, aws_subnet.chirper_private_vpc_2.id]
}

output "ec2_security_group_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.chirper_ec2_sg.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds_sg.id
}

output "lambda_security_group_id" {
  description = "ID of the Lambda security group"
  value       = aws_security_group.chirper_lambda_sg.id
}