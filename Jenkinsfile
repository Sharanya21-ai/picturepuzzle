pipeline {

    agent any

    tools {
        maven 'Maven'
        jdk 'JDK21'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'YOUR_GITHUB_URL'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

    }

    post {

        success {
            emailext (
                subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Tic Tac Toe Build Successful!",
                to: "yourmail@gmail.com"
            )
        }

        failure {
            emailext (
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Build Failed!",
                to: "yourmail@gmail.com"
            )
        }
    }
}
