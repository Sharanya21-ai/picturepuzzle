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
                sh '''
                sudo cp target/*.war /var/lib/tomcat10/webapps/
                sudo systemctl restart tomcat10
                '''
            }
        }
    }

    post {

        success {
            emailext(
                subject: "SUCCESS: ${JOB_NAME} #${BUILD_NUMBER}",
                body: '''
Build Successful!

Tic Tac Toe deployed successfully.

Open:
http://localhost:8091/tic-tac-toe-1.0-SNAPSHOT/
''',
                to: 'sharanyajagannath214@gmail.com'
            )
        }

        failure {
            emailext(
                subject: "FAILED: ${JOB_NAME} #${BUILD_NUMBER}",
                body: 'Build Failed!',
                to: 'sharanyajagannath214@gmail.com'
            )
        }
    }
}
