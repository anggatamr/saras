package api

import (
    "github.com/gin-gonic/gin"
    "github.com/angga/saras-backend/internal/api/handlers"
    "github.com/angga/saras-backend/internal/api/middleware"
    "github.com/angga/saras-backend/internal/firebase"
    "go.uber.org/zap"
)

func NewRouter(fbApp *firebase.App, logger *zap.Logger) *gin.Engine {
    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(middleware.Logger(logger))
    r.Use(middleware.CORS())

    // ── Public ──────────────────────────────────────────
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok", "service": "saras-api"})
    })

    // ── Protected (Firebase Auth required) ─────────────
    api := r.Group("/api/v1")
    api.Use(middleware.FirebaseAuth(fbApp))
    api.Use(middleware.RateLimit(100)) // 100 req/hour per user

    // ARIA — Integrity Analysis
    ariaH := handlers.NewARIAHandler(fbApp, logger)
    api.POST("/aria/analyze",   ariaH.AnalyzeCSV)
    api.GET( "/aria/reports",   ariaH.GetUserReports)
    api.GET( "/aria/report/:id", ariaH.GetReport)

    // NEXUS — BPS Data
    nexusH := handlers.NewNEXUSHandler(logger)
    api.GET("/nexus/indicators",        nexusH.GetIndicators)
    api.GET("/nexus/province/:code",    nexusH.GetProvinceData)
    api.POST("/nexus/compare",          nexusH.CompareWithBPS)

    // VERA — Respondent
    veraH := handlers.NewVERAHandler(fbApp, logger)
    api.POST("/vera/surveys",           veraH.CreateSurvey)
    api.GET( "/vera/surveys/active",    veraH.GetActiveSurveys)
    api.POST("/vera/surveys/:id/submit", veraH.SubmitResponse)

    // SIGMA — Statistical Analysis
    sigmaH := handlers.NewSIGMAHandler(logger)
    api.POST("/sigma/recommend",        sigmaH.RecommendTest)
    api.POST("/sigma/regression",       sigmaH.RunRegression)
    api.POST("/sigma/ttest",            sigmaH.RunTTest)
    api.POST("/sigma/narrative",        sigmaH.GenerateNarrative)

    // ATLAS — Literature
    atlasH := handlers.NewATLASHandler(logger)
    api.GET( "/atlas/search",           atlasH.SearchLiterature)
    api.GET( "/atlas/gap-map",          atlasH.GetGapMap)
    api.POST("/atlas/cite",             atlasH.GenerateCitation)

    return r
}
