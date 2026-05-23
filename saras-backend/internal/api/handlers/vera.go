package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/database"
	"go.uber.org/zap"
)

type VERAHandler struct {
	logger *zap.Logger
	db     database.Database
}

func NewVERAHandler(logger *zap.Logger, db database.Database) *VERAHandler {
	return &VERAHandler{
		logger: logger,
		db:     db,
	}
}

func (h *VERAHandler) CreateSurvey(c *gin.Context) {
	var input struct {
		Title  string   `json:"title" binding:"required"`
		Author string   `json:"author"`
		Uni    string   `json:"uni"`
		Target int      `json:"target" binding:"required"`
		Points int      `json:"points" binding:"required"`
		Tags   []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch user from context (populated by Auth middleware)
	email, _ := c.Get("email")
	emailStr, ok := email.(string)
	if !ok || emailStr == "" {
		emailStr = "guest@unimed.ac.id"
	}

	authorName := input.Author
	if authorName == "" {
		authorName = emailStr
	}

	newSurvey := database.Survey{
		Title:     input.Title,
		Author:    authorName,
		Uni:       input.Uni,
		Target:    input.Target,
		Current:   0,
		Points:    input.Points,
		Tags:      input.Tags,
		CreatedAt: time.Now(),
	}

	createdSurvey, err := h.db.CreateSurvey(c.Request.Context(), newSurvey)
	if err != nil {
		h.logger.Error("Failed to create survey in database", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create survey"})
		return
	}

	h.logger.Info("New survey created successfully", zap.Int("id", createdSurvey.ID), zap.String("title", createdSurvey.Title))
	c.JSON(http.StatusOK, createdSurvey)
}

func (h *VERAHandler) GetActiveSurveys(c *gin.Context) {
	surveys, err := h.db.GetActiveSurveys(c.Request.Context())
	if err != nil {
		h.logger.Error("Failed to fetch active surveys", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch surveys"})
		return
	}
	c.JSON(http.StatusOK, surveys)
}

func (h *VERAHandler) SubmitResponse(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid survey ID"})
		return
	}

	updatedSurvey, err := h.db.SubmitResponse(c.Request.Context(), id)
	if err != nil {
		h.logger.Error("Failed to submit response in database", zap.Int("id", id), zap.Error(err))
		c.JSON(http.StatusNotFound, gin.H{"error": "Survey not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Jawaban survei berhasil dikirim!", "survey": updatedSurvey})
}
