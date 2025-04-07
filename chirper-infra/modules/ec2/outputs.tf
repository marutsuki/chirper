output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.chirper_backend.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.chirper_backend_eip.public_ip
}

output "ec2_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.chirper_backend.private_ip
}

output "ec2_security_group_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.chirper_ec2_sg.id
}

output "ec2_endpoint" {
  description = "HTTP endpoint for the EC2 instance"
  value       = "http://${aws_eip.chirper_backend_eip.public_ip}:3000"
}
