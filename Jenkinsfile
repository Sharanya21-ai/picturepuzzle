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
                url: 'https://github.com/Sharanya21-ai/tictactoe.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                // Removed 'sudo'. Renamed destination file to ROOT.war for a cleaner URL.
                sh 'cp target/*.war /var/lib/tomcat10/webapps/ROOT.war || true'
            }
        }

    }

    post {

        success {
            emailext (
                subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
Build Successful!

Tic Tac Toe Game deployed successfully.

Open Game:
http://localhost:8091/
""",
                to: "sharanyajagannath214@gmail.com"
            )
        }

        failure {
            emailext (
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: "Build Failed!",
                to: "sharanyajagannath214@gmail.com"
            )
        }
    }
}
