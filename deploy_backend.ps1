$ErrorActionPreference = "Continue"
$PROJECT_ID = "saras-platform"
$REGION = "asia-southeast2"
$IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/saras/saras-api:v1.0.0"

Write-Host "Building and Pushing Docker Image using Google Cloud Build (No local Docker needed)..."
cd saras-backend
gcloud builds submit --tag $IMAGE .

Write-Host "Deploying to Cloud Run..."
$SA_EMAIL = "saras-api-sa@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud run deploy saras-api --image=$IMAGE --region=$REGION --service-account=$SA_EMAIL --allow-unauthenticated --min-instances=0 --memory=512Mi --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},GIN_MODE=release,GEMINI_API_KEY=AIzaSyAFb1ecPRhMWBHX851UIPV36yDp_O6S6IM,BPS_API_KEY=d2d8ee1c7697d2084e15dfb5e1580c58,SARAS_API_SECRET=saras-secret-handshake-token-9988,ALLOWED_EMAILS=anggatamara40@gmail.com"

Write-Host "Deployment Complete!"
