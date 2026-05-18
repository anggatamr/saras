package openalex

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewClient() *Client {
	return &Client{
		BaseURL: "https://api.openalex.org/",
		HTTPClient: &http.Client{Timeout: 15 * time.Second},
	}
}

type Work struct {
	ID               string `json:"id"`
	Title            string `json:"title"`
	PublicationYear  int    `json:"publication_year"`
	CitedByCount     int    `json:"cited_by_count"`
	PrimaryLocation  struct {
		Source struct {
			DisplayName string `json:"display_name"`
		} `json:"source"`
	} `json:"primary_location"`
	Authorships []struct {
		Author struct {
			DisplayName string `json:"display_name"`
		} `json:"author"`
	} `json:"authorships"`
}

type SearchResponse struct {
	Meta struct {
		Count int `json:"count"`
	} `json:"meta"`
	Results []Work `json:"results"`
}

// SearchWorks queries OpenAlex for academic papers.
func (c *Client) SearchWorks(query string, limit int) ([]Work, error) {
	// Polite pool requires an email, but it's optional. 
	// We use the basic endpoint for the competition demo.
	endpoint := fmt.Sprintf("%sworks?search=%s&per-page=%d", c.BaseURL, url.QueryEscape(query), limit)
	
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}
	
	// OpenAlex polite pool
	req.Header.Set("User-Agent", "mailto:hello@saras.ac.id")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OpenAlex API returned status: %d", resp.StatusCode)
	}

	var result SearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.Results, nil
}
