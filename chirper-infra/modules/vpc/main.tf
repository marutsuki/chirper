resource "aws_vpc" "chirper_vpc" {
  cidr_block = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "chirper_private_vpc_1" {
  vpc_id = aws_vpc.chirper_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-southeast-2a"

  tags = {
    name = "Chirper Private VPC 1"
  }
}

resource "aws_subnet" "chirper_private_vpc_2" {
  vpc_id = aws_vpc.chirper_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-southeast-2b"

  tags = {
    name = "Chirper Private VPC 2"
  }
}

resource "aws_subnet" "chirper_public_vpc" {
  vpc_id = aws_vpc.chirper_vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "ap-southeast-2a"
  tags = {
    name = "Chirper Public VPC"
  }
}

resource "aws_internet_gateway" "chirper_gw" {
  vpc_id = aws_vpc.chirper_vpc.id

  tags = {
    Name = "${var.project_name} VPC Internet Gateway"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.chirper_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.chirper_gw.id
  }
  tags = {
    Name = "${var.project_name} Public Route Table"
  }
}

resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.chirper_public_vpc.id
  route_table_id = aws_route_table.public_rt.id
}

# Security group for EC2 instance
resource "aws_security_group" "chirper_ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for Chirper backend EC2 instance"
  vpc_id      = aws_vpc.chirper_vpc.id

  # Allow HTTP from API Gateway
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP access from API Gateway"
  }

  # Allow SSH access for management
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

  depends_on = [ aws_vpc.chirper_vpc ]
}

# Security group for Lambda instance
resource "aws_security_group" "chirper_lambda_sg" {
  name        = "${var.project_name}-lambda-sg"
  description = "Security group for Chirper backend Lambda instance"
  vpc_id      = aws_vpc.chirper_vpc.id

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

  depends_on = [ aws_vpc.chirper_vpc ]
}

# Security group for RDS instance
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = aws_vpc.chirper_vpc.id

  # Allow PostgreSQL connections from EC2 security group
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.chirper_ec2_sg.id, aws_security_group.chirper_lambda_sg.id]
    description     = "Allow PostgreSQL access from EC2 instance"
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
    Name = "${var.project_name}-rds-sg"
  }
  
  depends_on = [ aws_vpc.chirper_vpc ]
}