package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/gemini"
	"go.uber.org/zap"
)

type SIGMAHandler struct {
	logger       *zap.Logger
	geminiClient *gemini.Client
}

func NewSIGMAHandler(logger *zap.Logger, gc *gemini.Client) *SIGMAHandler {
	return &SIGMAHandler{logger: logger, geminiClient: gc}
}

func (h *SIGMAHandler) RecommendTest(c *gin.Context) {
	c.JSON(200, gin.H{"message": "RecommendTest placeholder"})
}

func (h *SIGMAHandler) RunRegression(c *gin.Context) {
	c.JSON(200, gin.H{"message": "RunRegression placeholder"})
}

func (h *SIGMAHandler) RunTTest(c *gin.Context) {
	c.JSON(200, gin.H{"message": "RunTTest placeholder"})
}

func (h *SIGMAHandler) GenerateNarrative(c *gin.Context) {
	var input struct {
		RSquared    float64       `json:"r_squared"`
		FStatistic  float64       `json:"f_statistic"`
		Fpvalue     float64       `json:"f_pvalue"`
		Variables   []interface{} `json:"variables"`
	}

	if err := c.BindJSON(&input); err != nil {
		h.logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	prompt := fmt.Sprintf(`Hasil analisis regresi linear berganda:
- R-Squared: %.4f
- F-Statistic: %.4f (p-value: %.4f)
- Detail variabel independen (Koefisien, t-stat, p-value): %v
Tulis interpretasi statistik untuk BAB IV skripsi, pastikan tidak menyimpulkan pengaruh jika p-value > 0.05.`, input.RSquared, input.FStatistic, input.Fpvalue, input.Variables)

	narrative, err := h.geminiClient.GenerateNarrative(c.Request.Context(), prompt)
	if err != nil {
		h.logger.Error("Failed to generate narrative", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate narrative"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"narrative": narrative})
}
