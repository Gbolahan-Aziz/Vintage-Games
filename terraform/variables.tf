variable "region" {
  description = "The AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "game-cluster"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}
