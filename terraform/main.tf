terraform {
  required_version = ">= 1.3.2"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.57"
    }
  }

  backend "s3" {
    bucket = "terraform01-state-bucket"
    key    = "terraform/state/game.tfstate"
    region = "us-east-1"
  }
}


module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.27"
  subnet_ids      = module.vpc.public_subnets
  vpc_id          = module.vpc.vpc_id
  eks_managed_node_groups = {
    fargate = {
      min_size     = 1
      max_size     = 2
      desired_size = 1

      instance_type = "t3.medium"

      key_name = var.key_name
    }
  }
}


module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"
  name    = "eks-vpc"
  cidr    = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  map_public_ip_on_launch = true

  enable_nat_gateway = true
  single_nat_gateway = true
}
