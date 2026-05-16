package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/firebase"
	"go.uber.org/zap"
)

type ARIAHandler struct {
	fbApp  *firebase.App
	logger *zap.Logger
}

func NewARIAHandler(fbApp *firebase.App, logger *zap.Logger) *ARIAHandler {
	return &ARIAHandler{fbApp: fbApp, logger: logger}
}

func (h *ARIAHandler) AnalyzeCSV(c *gin.Context) {
	c.JSON(200, gin.H{"message": "AnalyzeCSV placeholder"})
}

func (h *ARIAHandler) GetUserReports(c *gin.Context) {
	c.JSON(200, gin.H{"message": "GetUserReports placeholder"})
}

func (h *ARIAHandler) GetReport(c *gin.Context) {
	c.JSON(200, gin.H{"message": "GetReport placeholder"})
}
