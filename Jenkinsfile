pipeline {
  
  agent { label 'work-agent' }

  environment {
    DOCKER_REGISTRY = 'katka07'
    DOCKER_CREDS = credentials('docker_hub_token')
    IMAGE_TAG = "${env.BUILD_NUMBER}"

    STORAGE_IMAGE = "${DOCKER_REGISTRY}/storage-service"
    COUNTER_IMAGE = "${DOCKER_REGISTRY}/counter-service"
    WEBSITE_IMAGE = "${DOCKER_REGISTRY}/website-service"
  }

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build & Test Services') {
      failFast true
      parallel {
        stage('Build Storage') {
          steps {
            dir('storage-service') {
              sh "docker build -t ${STORAGE_IMAGE}:${IMAGE_TAG} -f Dockerfile.storage ."
            }
          }
        }
        stage('Build Counter') {
          steps {
            dir('counter-service') {
              sh "docker build -t ${COUNTER_IMAGE}:${IMAGE_TAG} -f Dockerfile.counter ."
            }
          }
        }
        stage('Build Website') {
          steps {
            dir('website') {
              sh "docker build -t ${WEBSITE_IMAGE}:${IMAGE_TAG} -f Dockerfile.website ."
            }
          }
        }
      }
    }
    stage('Vulnerability Scan (Trivy)') {
      steps {
        script {
          echo "Scanning images for CRITICAL vulnerabilities..."
          sh "trivy image --severity CRITICAL --exit-code 0 ${STORAGE_IMAGE}:${IMAGE_TAG}"
          sh "trivy image --severity CRITICAL --exit-code 0 ${COUNTER_IMAGE}:${IMAGE_TAG}"
          sh "trivy image --severity CRITICAL --exit-code 0 ${WEBSITE_IMAGE}:${IMAGE_TAG}"
        }
      }
    }
    stage('Push to Registry') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker_hub_token',
          passwordVariable: 'DOCKER_PASS',
          usernameVariable: 'DOCKER_USER'
        )]) {
          sh """
          echo "$DOCKER_PASS" | docker login -u ${DOCKER_REGISTRY} --password-stdin
          docker push ${STORAGE_IMAGE}:${IMAGE_TAG}
          docker push ${COUNTER_IMAGE}:${IMAGE_TAG}
          docker push ${WEBSITE_IMAGE}:${IMAGE_TAG}               
          """
        }
      }
    }
    stage('Deploy To Staging') {
      steps {
        withCredentials([string(credentialsId: 'redis-password', variable: 'REDIS_PASS')]) {
          sh '''
            # 1. Storage Service .env
            cat <<EOF > $WORKSPACE/storage-service/.env
PORT=5000
REDIS_HOST=192.168.100.63
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASS}
COUNTER_KEY=website_visitor_count
EOF

            # 2. Counter Service .env
            cat <<EOF > $WORKSPACE/counter-service/.env
PORT=4000
STORAGE_SERVICE_URL=http://storage-container:5000
EOF

            # 3. Website .env
            cat <<EOF > $WORKSPACE/website/.env
PORT=3000
COUNTER_SERVICE_URL=http://counter-container:4000
EOF
            export IMAGE_TAG=${BUILD_NUMBER}
            docker compose up -d
          '''
        }
      }
    }
  }
  post {
    always {
      script {
        sh '''
          docker image prune -f
        '''
      }
    }
  }
}

  