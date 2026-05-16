package firebase

import (
	"context"

	fb "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

// App wraps the Firebase App and Auth client
type App struct {
	FirebaseApp *fb.App
	AuthClient  *auth.Client
}

// InitApp initializes Firebase Admin SDK
func InitApp(projectID string) (*App, error) {
	ctx := context.Background()

	var fbApp *fb.App
	var err error

	if projectID != "" {
		conf := &fb.Config{ProjectID: projectID}
		fbApp, err = fb.NewApp(ctx, conf)
	} else {
		// Uses GOOGLE_APPLICATION_CREDENTIALS env var
		fbApp, err = fb.NewApp(ctx, nil, option.WithoutAuthentication())
	}
	if err != nil {
		return nil, err
	}

	// Auth client (may fail if no credentials, that's OK for dev)
	authClient, _ := fbApp.Auth(ctx)

	return &App{
		FirebaseApp: fbApp,
		AuthClient:  authClient,
	}, nil
}
