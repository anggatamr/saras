package cache

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

type FirestoreCache struct {
	client  *firestore.Client
	enabled bool
}

type CacheEntry struct {
	Data      interface{} `firestore:"data"`
	CreatedAt time.Time   `firestore:"created_at"`
}

func NewFirestoreCache() *FirestoreCache {
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	if projectID == "" {
		return &FirestoreCache{enabled: false}
	}
	ctx := context.Background()
	var client *firestore.Client
	var err error
	credsPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	if credsPath != "" {
		client, err = firestore.NewClient(ctx, projectID, option.WithCredentialsFile(credsPath))
	} else {
		client, err = firestore.NewClient(ctx, projectID)
	}
	if err != nil {
		return &FirestoreCache{enabled: false}
	}
	return &FirestoreCache{client: client, enabled: true}
}

// HashKey creates a SHA256 hash of the query parameters for use as cache key
func HashKey(params string) string {
	h := sha256.Sum256([]byte(params))
	return fmt.Sprintf("%x", h)
}

// Get retrieves a cached value if it exists and is < 24 hours old
func (fc *FirestoreCache) Get(ctx context.Context, collection, key string) ([]byte, bool) {
	if !fc.enabled || fc.client == nil {
		return nil, false
	}
	doc, err := fc.client.Collection(collection).Doc(key).Get(ctx)
	if err != nil {
		return nil, false
	}
	var entry CacheEntry
	if err := doc.DataTo(&entry); err != nil {
		return nil, false
	}
	if time.Since(entry.CreatedAt) > 24*time.Hour {
		// Expired
		fc.client.Collection(collection).Doc(key).Delete(ctx)
		return nil, false
	}
	raw, _ := json.Marshal(entry.Data)
	return raw, true
}

// Set stores a value in the cache
func (fc *FirestoreCache) Set(ctx context.Context, collection, key string, data interface{}) error {
	if !fc.enabled || fc.client == nil {
		return nil
	}
	_, err := fc.client.Collection(collection).Doc(key).Set(ctx, CacheEntry{
		Data:      data,
		CreatedAt: time.Now(),
	})
	return err
}
