# EC2 instance for Chirper backend
resource "aws_instance" "chirper_backend" {
  ami                    = var.ami_id
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id

  tags = {
    Name = "${var.project_name}-backend"
  }

  user_data = templatefile("${path.module}/install.sh", {
    environment      = var.environment
    allowed_origins  = var.allowed_origins
    database_url     = var.database_url
    deployment_bucket = var.deployment_bucket
  })

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
    delete_on_termination = true
  }

  iam_instance_profile = aws_iam_instance_profile.chirper_ec2_profile.name

  depends_on = [
    aws_iam_instance_profile.chirper_ec2_profile
  ]
}

resource "aws_iam_instance_profile" "chirper_ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = var.role_name
}

# Elastic IP for EC2 instance
resource "aws_eip" "chirper_backend_eip" {
  instance = aws_instance.chirper_backend.id
  domain   = "vpc"
  
  tags = {
    Name = "${var.project_name}-backend-eip"
  }
}
