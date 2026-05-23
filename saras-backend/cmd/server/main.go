package main

import (
    "context"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/angga/saras-backend/internal/api"
    "go.uber.org/zap"
)

func main() {
    // ── Logger ─────────────────────────────────────────
    logger, _ := zap.NewProduction()
    defer logger.Sync()

    // ── Router ─────────────────────────────────────────
    router := api.NewRouter(logger)

    // ── Server ─────────────────────────────────────────
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    srv := &http.Server{
        Addr:         ":" + port,
        Handler:      router,
        ReadTimeout:  30 * time.Second,
        WriteTimeout: 60 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    // ── Graceful Shutdown ──────────────────────────────
    go func() {
        logger.Info("SARAS API started", zap.String("port", port))
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal("server failed", zap.Error(err))
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    logger.Info("shutting down gracefully...")
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    srv.Shutdown(ctx)
}
