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
  depends_on = [ module.eks ]
}



resource "helm_release" "aws-load-balancer-controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"

  set {
    name  = "clusterName"
    value = "game-cluster"
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "region"
    value = "us-east-1"
  }

  set {
    name  = "vpcId"
    value = module.vpc.vpc_id
  }

  set {
    name  = "image.repository"
    value = format("602401143452.dkr.ecr.%s.amazonaws.com/amazon/aws-load-balancer-controller", var.region)
  }

  set {
    name  = "image.tag"
    value = "v2.4.0"
  }

  set {
    name  = "serviceAccount.server.annotations.eks.amazonaws.com/role-arn"
    value = format("arn:aws:iam::%s:role/aws-load-balancer-controller", var.aws_account_id)
  }

  depends_on =  [module.eks]
}

