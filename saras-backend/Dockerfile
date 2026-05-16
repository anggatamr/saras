# ─── Stage 1: Builder ───────────────────────────────────────
FROM golang:1.22-alpine AS builder

# Install dependencies
RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /app

# Copy and download dependencies first (layer caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary (optimized, stripped)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.Version=$(git describe --tags --always)" \
    -o saras-api \
    ./cmd/server

# ─── Stage 2: Runner (minimal, ~8MB image) ─────────────────
FROM gcr.io/distroless/static-debian12

# Copy binary and certs
COPY --from=builder /app/saras-api /saras-api
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Non-root user (security)
USER nonroot:nonroot

# Cloud Run requires PORT env var
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/saras-api"]
