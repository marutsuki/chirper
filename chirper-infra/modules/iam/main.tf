# IAM role for Lambda execution
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "chirper_lambda_role" {
  name               = "chirper_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.chirper_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Attach VPC access policy (needed for RDS access)
resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.chirper_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_policy" "lambda_secrets_access" {
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
        ],
        Resource = [
          var.secretsmanager_secret_arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_secrets_access" {
  role = aws_iam_role.chirper_lambda_role.name
  policy_arn = aws_iam_policy.lambda_secrets_access.arn
}

resource "aws_iam_role" "chirper_ec2_role" {
  name = "chirper-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "chirper_ec2_policy_attachment" {
  role       = aws_iam_role.chirper_ec2_role.name
  policy_arn = aws_iam_policy.chirper_ec2_policy.arn
}

resource "aws_iam_policy" "chirper_ec2_policy" {
  name        = "chirper-ec2-policy"
  description = "Policy for Chirper backend EC2 instance"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${var.deployment_bucket}",
          "arn:aws:s3:::${var.deployment_bucket}/*"
        ]
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Effect   = "Allow"
        Resource = var.secretsmanager_secret_arn
      }
    ]
  })
}