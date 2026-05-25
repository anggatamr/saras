package handlers

import (
	"sync"
	"testing"
)

func TestAnalyzeColumn(t *testing.T) {
	// Mock records
	records := [][]string{
		{"10.0"}, {"10.0"}, {"10.0"}, {"10.0"}, {"10.0"},
		{"10.0"}, {"10.0"}, {"10.0"}, {"10.0"}, {"10.0"},
		{"null"}, // missing
		{"100.0"}, // outlier
	}

	var mu sync.Mutex
	var issues []string
	var wg sync.WaitGroup

	wg.Add(1)
	analyzeColumn(0, "TestCol", records, &mu, &issues, &wg)
	wg.Wait()

	if len(issues) < 2 {
		t.Fatalf("Expected at least 2 issues (missing + outlier), got %d: %v", len(issues), issues)
	}

	foundMissing := false
	foundOutlier := false
	for _, issue := range issues {
		if val := "Missing data detected in column 'TestCol'"; len(issue) >= len(val) && issue[:len(val)] == val {
			foundMissing = true
		}
		if val := "Z-score outliers detected in column 'TestCol'"; len(issue) >= len(val) && issue[:len(val)] == val {
			foundOutlier = true
		}
	}

	if !foundMissing {
		t.Error("Expected missing data issue to be flagged")
	}
	if !foundOutlier {
		t.Error("Expected Z-score outlier to be flagged")
	}
}

func TestAnalyzeBenford(t *testing.T) {
	// Anomalous dataset (all starting with 9)
	recordsAnomaly := [][]string{
		{"9.1"}, {"92.4"}, {"9.35"}, {"94.0"}, {"95.1"}, {"968.2"}, {"97.0"}, {"9.8"}, {"9.9"}, {"99.9"},
	}

	var mu sync.Mutex
	var issues []string
	var wg sync.WaitGroup

	wg.Add(1)
	analyzeBenford(recordsAnomaly, &mu, &issues, &wg)
	wg.Wait()

	foundBenford := false
	for _, issue := range issues {
		if val := "Benford's Law anomaly"; len(issue) >= len(val) && issue[:len(val)] == val {
			foundBenford = true
		}
	}

	if !foundBenford {
		t.Error("Expected Benford anomaly to be flagged for data fabricated with leading 9s")
	}
}
