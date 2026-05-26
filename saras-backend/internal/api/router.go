package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/api/handlers"
	"github.com/angga/saras-backend/internal/api/middleware"
	"github.com/angga/saras-backend/internal/database"
	"github.com/angga/saras-backend/internal/gemini"
	"go.uber.org/zap"
)

func NewRouter(logger *zap.Logger) *gin.Engine {
	r := gin.New()
	r.MaxMultipartMemory = 52 << 20 // 52 MB max multipart
	r.Use(gin.Recovery())
	r.Use(middleware.RequestID())
	r.Use(middleware.Logger(logger))
	r.Use(middleware.CORS())
	// Global middleware: cap JSON/form body reads at 52 MB to prevent abuse
	r.Use(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 52<<20)
		c.Next()
	})

    // Initialize Gemini Client
    gc, err := gemini.NewClient()
    if err != nil {
        logger.Error("Failed to initialize Gemini client", zap.Error(err))
    } else {
        logger.Info("Gemini client initialized successfully")
    }

    // ── Public ──────────────────────────────────────────
    r.GET("/health", handlers.HealthCheck)

    // ── Protected (Firebase Auth required) ─────────────
    api := r.Group("/api/v1")
    api.Use(middleware.Auth())
    api.Use(middleware.RateLimit(100)) // 100 req/hour per user

    // ARIA — Integrity Analysis
    ariaH := handlers.NewARIAHandler(logger, gc)
    api.POST("/aria/analyze",   ariaH.AnalyzeCSV)
    api.GET( "/aria/reports",   ariaH.GetUserReports)
    api.GET( "/aria/report/:id", ariaH.GetReport)
    api.POST("/aria/narrative", ariaH.GenerateNarrative)

    // NEXUS — BPS Data
    nexusH := handlers.NewNEXUSHandler(logger)
    api.GET("/nexus/indicators",        nexusH.GetIndicators)
    api.GET("/nexus/province/:code",    nexusH.GetProvinceData)
    api.POST("/nexus/compare",          nexusH.CompareWithBPS)

    // Initialize Database
    db := database.NewDatabase(logger)

    // VERA — Respondent
    veraH := handlers.NewVERAHandler(logger, db)
    api.POST("/vera/surveys",           veraH.CreateSurvey)
    api.GET( "/vera/surveys/active",    veraH.GetActiveSurveys)
    api.POST("/vera/surveys/:id/submit", veraH.SubmitResponse)

    // SIGMA — Statistical Analysis
    sigmaH := handlers.NewSIGMAHandler(logger, gc)
    api.POST("/sigma/recommend",        sigmaH.RecommendTest)
    api.POST("/sigma/regression",       sigmaH.RunRegression)
    api.POST("/sigma/ttest",            sigmaH.RunTTest)
    api.POST("/sigma/narrative",        sigmaH.GenerateNarrative)

    // ATLAS — Literature
    atlasH := handlers.NewATLASHandler(logger, gc)
    api.GET( "/atlas/search",           atlasH.SearchLiterature)
    api.GET( "/atlas/gap-map",          atlasH.GetGapMap)
    api.POST("/atlas/cite",             atlasH.GenerateCitation)

    return r
}
