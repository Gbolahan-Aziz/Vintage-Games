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

data "aws_eks_cluster" "game_cluster" {
  name = var.cluster_name
  depends_on =  [module.eks]
}

data "aws_eks_cluster_auth" "game_cluster" {
  name = var.cluster_name
  depends_on =  [module.eks]
}

data "tls_certificate" "eks_oidc_thumbprint" {
  url = data.aws_eks_cluster.game_cluster.identity[0].oidc[0].issuer
  depends_on =  [module.eks]
}

resource "aws_iam_openid_connect_provider" "oidc_provider" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks_oidc_thumbprint.certificates[0].sha1_fingerprint]
  url             = data.aws_eks_cluster.game_cluster.identity[0].oidc[0].issuer
  depends_on =  [module.eks]
}
