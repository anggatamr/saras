package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func TestRunRegression_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Create logger
	logger, _ := zap.NewDevelopment()
	handler := NewSIGMAHandler(logger, nil)

	// Set up gin router
	r := gin.New()
	r.POST("/regression", handler.RunRegression)

	// Define a valid regression request
	reqPayload := RegressionRequest{
		YColumn:  "Y",
		XColumns: []string{"X1", "X2"},
		Data: []map[string]float64{
			{"Y": 5.5, "X1": 1.0, "X2": 2.0},
			{"Y": 9.0, "X1": 2.0, "X2": 4.0},
			{"Y": 11.5, "X1": 3.0, "X2": 5.0},
			{"Y": 11.0, "X1": 4.0, "X2": 4.0},
			{"Y": 13.5, "X1": 5.0, "X2": 5.0},
		},
	}

	body, err := json.Marshal(reqPayload)
	if err != nil {
		t.Fatalf("Failed to marshal request payload: %v", err)
	}

	req, _ := http.NewRequest(http.MethodPost, "/regression", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d. Body: %s", w.Code, w.Body.String())
	}

	// Parse response
	var response map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("Failed to unmarshal response payload: %v", err)
	}

	if _, ok := response["r_squared"]; !ok {
		t.Error("Expected r_squared in response")
	}

	if _, ok := response["adj_r_squared"]; !ok {
		t.Error("Expected adj_r_squared in response")
	}

	if _, ok := response["f_statistic"]; !ok {
		t.Error("Expected f_statistic in response")
	}

	variables, ok := response["variables"].([]interface{})
	if !ok {
		t.Fatal("Expected variables array in response")
	}

	// Expect 3 variables: intercept, X1, X2
	if len(variables) != 3 {
		t.Errorf("Expected 3 variables in result, got %d", len(variables))
	}
}

func TestRunRegression_InsufficientData(t *testing.T) {
	gin.SetMode(gin.TestMode)

	logger, _ := zap.NewDevelopment()
	handler := NewSIGMAHandler(logger, nil)

	r := gin.New()
	r.POST("/regression", handler.RunRegression)

	// Request with only 2 rows but 2 predictor variables (k=2, k+1=3 required rows minimum)
	reqPayload := RegressionRequest{
		YColumn:  "Y",
		XColumns: []string{"X1", "X2"},
		Data: []map[string]float64{
			{"Y": 5.5, "X1": 1.0, "X2": 2.0},
			{"Y": 9.0, "X1": 2.0, "X2": 4.0},
		},
	}

	body, err := json.Marshal(reqPayload)
	if err != nil {
		t.Fatalf("Failed to marshal request payload: %v", err)
	}

	req, _ := http.NewRequest(http.MethodPost, "/regression", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 for insufficient data, got %d", w.Code)
	}
}
