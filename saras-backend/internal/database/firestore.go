package database

import (
	"context"
	"errors"
	"os"
	"strconv"
	"sync"
	"time"

	"cloud.google.com/go/firestore"
	"go.uber.org/zap"
	"google.golang.org/api/option"
)

type Survey struct {
	ID        int       `json:"id" firestore:"id"`
	Title     string    `json:"title" firestore:"title"`
	Author    string    `json:"author" firestore:"author"`
	Uni       string    `json:"uni" firestore:"uni"`
	Target    int       `json:"target" firestore:"target"`
	Current   int       `json:"current" firestore:"current"`
	Points    int       `json:"points" firestore:"points"`
	Tags      []string  `json:"tags" firestore:"tags"`
	CreatedAt time.Time `json:"created_at" firestore:"created_at"`
}

type Database interface {
	GetActiveSurveys(ctx context.Context) ([]Survey, error)
	CreateSurvey(ctx context.Context, survey Survey) (Survey, error)
	SubmitResponse(ctx context.Context, id int) (Survey, error)
}

type FirestoreDB struct {
	client *firestore.Client
	logger *zap.Logger
}

type MemoryDB struct {
	surveys []Survey
	nextID  int
	mu      sync.Mutex
}

func NewDatabase(logger *zap.Logger) Database {
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")
	}

	if projectID != "" {
		ctx := context.Background()
		var client *firestore.Client
		var err error
		
		credsPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
		if credsPath != "" {
			client, err = firestore.NewClient(ctx, projectID, option.WithCredentialsFile(credsPath))
		} else {
			client, err = firestore.NewClient(ctx, projectID)
		}

		if err == nil {
			logger.Info("Successfully initialized GCP Native Firestore Client", zap.String("project_id", projectID))
			return &FirestoreDB{client: client, logger: logger}
		}
		logger.Warn("Failed to initialize Firestore Client, falling back to MemoryDB", zap.Error(err))
	}

	logger.Info("Initializing local in-memory mock database (graceful fallback)")
	return NewMemoryDB()
}

// MemoryDB implementation
func NewMemoryDB() *MemoryDB {
	return &MemoryDB{
		surveys: []Survey{
			{ID: 1, Title: "Pengaruh Media Sosial terhadap Keputusan Pembelian Gen Z", Author: "Budi Santoso", Uni: "Universitas Negeri Medan", Target: 100, Current: 45, Points: 30, Tags: []string{"Manajemen", "Pemasaran"}, CreatedAt: time.Now()},
			{ID: 2, Title: "Tingkat Stres Mahasiswa Tingkat Akhir Selama Penyusunan Skripsi", Author: "Siti Aminah", Uni: "Universitas Indonesia", Target: 200, Current: 180, Points: 50, Tags: []string{"Psikologi", "Kesehatan"}, CreatedAt: time.Now()},
			{ID: 3, Title: "Adopsi AI dalam Proses Belajar Mahasiswa IT", Author: "Reza Fahlevi", Uni: "ITB", Target: 150, Current: 12, Points: 40, Tags: []string{"Informatika", "Pendidikan"}, CreatedAt: time.Now()},
		},
		nextID: 4,
	}
}

func (db *MemoryDB) GetActiveSurveys(ctx context.Context) ([]Survey, error) {
	db.mu.Lock()
	defer db.mu.Unlock()
	return db.surveys, nil
}

func (db *MemoryDB) CreateSurvey(ctx context.Context, survey Survey) (Survey, error) {
	db.mu.Lock()
	defer db.mu.Unlock()
	survey.ID = db.nextID
	db.nextID++
	db.surveys = append(db.surveys, survey)
	return survey, nil
}

func (db *MemoryDB) SubmitResponse(ctx context.Context, id int) (Survey, error) {
	db.mu.Lock()
	defer db.mu.Unlock()
	for i, s := range db.surveys {
		if s.ID == id {
			db.surveys[i].Current++
			return db.surveys[i], nil
		}
	}
	return Survey{}, errors.New("survey not found")
}

// FirestoreDB implementation
func (db *FirestoreDB) GetActiveSurveys(ctx context.Context) ([]Survey, error) {
	var surveys []Survey
	iter := db.client.Collection("surveys").OrderBy("created_at", firestore.Desc).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}
		var s Survey
		if err := doc.DataTo(&s); err == nil {
			surveys = append(surveys, s)
		}
	}
	// Fallback if empty database
	if len(surveys) == 0 {
		return []Survey{
			{ID: 1, Title: "Pengaruh Media Sosial terhadap Keputusan Pembelian Gen Z (Firestore)", Author: "Budi Santoso", Uni: "Universitas Negeri Medan", Target: 100, Current: 45, Points: 30, Tags: []string{"Manajemen", "Pemasaran"}, CreatedAt: time.Now()},
			{ID: 2, Title: "Tingkat Stres Mahasiswa Tingkat Akhir Selama Penyusunan Skripsi", Author: "Siti Aminah", Uni: "Universitas Indonesia", Target: 200, Current: 180, Points: 50, Tags: []string{"Psikologi", "Kesehatan"}, CreatedAt: time.Now()},
			{ID: 3, Title: "Adopsi AI dalam Proses Belajar Mahasiswa IT", Author: "Reza Fahlevi", Uni: "ITB", Target: 150, Current: 12, Points: 40, Tags: []string{"Informatika", "Pendidikan"}, CreatedAt: time.Now()},
		}, nil
	}
	return surveys, nil
}

func (db *FirestoreDB) CreateSurvey(ctx context.Context, survey Survey) (Survey, error) {
	survey.ID = int(time.Now().UnixMilli() % 100000000)
	_, err := db.client.Collection("surveys").Doc(strconv.Itoa(survey.ID)).Set(ctx, survey)
	if err != nil {
		return Survey{}, err
	}
	return survey, nil
}

func (db *FirestoreDB) SubmitResponse(ctx context.Context, id int) (Survey, error) {
	docRef := db.client.Collection("surveys").Doc(strconv.Itoa(id))
	var updatedSurvey Survey
	err := db.client.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		doc, err := tx.Get(docRef)
		if err != nil {
			return err
		}
		var s Survey
		if err := doc.DataTo(&s); err != nil {
			return err
		}
		s.Current++
		updatedSurvey = s
		return tx.Set(docRef, s)
	})
	if err != nil {
		return Survey{}, err
	}
	return updatedSurvey, nil
}
