resource "aws_eks_fargate_profile" "fargate_profile" {
  cluster_name          = var.cluster_name
  fargate_profile_name  = "game-cluster-fargate"
  pod_execution_role_arn = aws_iam_role.eks_pod_execution_role.arn
  subnet_ids            = module.vpc.private_subnets

  selector {
    namespace = "default"
  }
  depends_on =  [module.eks]

}

data "aws_iam_openid_connect_provider" "eks_oidc" {
  url = module.eks.cluster_oidc_issuer_url
}
