# EC2 instance for Chirper backend
resource "aws_instance" "chirper_backend" {
  ami                    = var.ami_id # Amazon Linux 2023 AMI
  instance_type          = "t2.micro" # Free tier eligible
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.chirper_ec2_sg.id]
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
    aws_security_group.chirper_ec2_sg,
    aws_iam_instance_profile.chirper_ec2_profile
  ]
}

# Security group for EC2 instance
resource "aws_security_group" "chirper_ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for Chirper backend EC2 instance"

  # Allow HTTP from API Gateway
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # In production, restrict this to API Gateway IPs
    description = "Allow HTTP access from API Gateway"
  }

  # Allow SSH access for management
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_allowed_cidr_blocks
    description = "Allow SSH access"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
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
