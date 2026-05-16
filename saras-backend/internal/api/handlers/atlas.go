package handlers

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type ATLASHandler struct {
	logger *zap.Logger
}

func NewATLASHandler(logger *zap.Logger) *ATLASHandler {
	return &ATLASHandler{logger: logger}
}

func (h *ATLASHandler) SearchLiterature(c *gin.Context) {
	c.JSON(200, gin.H{"message": "SearchLiterature placeholder"})
}

func (h *ATLASHandler) GetGapMap(c *gin.Context) {
	c.JSON(200, gin.H{"message": "GetGapMap placeholder"})
}

func (h *ATLASHandler) GenerateCitation(c *gin.Context) {
	c.JSON(200, gin.H{"message": "GenerateCitation placeholder"})
}
