package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/firebase"
	"go.uber.org/zap"
)

type VERAHandler struct {
	fbApp  *firebase.App
	logger *zap.Logger
}

func NewVERAHandler(fbApp *firebase.App, logger *zap.Logger) *VERAHandler {
	return &VERAHandler{fbApp: fbApp, logger: logger}
}

func (h *VERAHandler) CreateSurvey(c *gin.Context) {
	c.JSON(200, gin.H{"message": "CreateSurvey placeholder"})
}

func (h *VERAHandler) GetActiveSurveys(c *gin.Context) {
	c.JSON(200, gin.H{"message": "GetActiveSurveys placeholder"})
}

func (h *VERAHandler) SubmitResponse(c *gin.Context) {
	c.JSON(200, gin.H{"message": "SubmitResponse placeholder"})
}
