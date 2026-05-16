package middleware

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"sync"
)

var (
	limiters = make(map[string]*rate.Limiter)
	mu       sync.Mutex
)

func getLimiter(ip string, requestsPerMin int) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := limiters[ip]
	if !exists {
		// Limit based on requests per second equivalent
		limiter = rate.NewLimiter(rate.Limit(requestsPerMin/60), requestsPerMin)
		limiters[ip] = limiter
	}

	return limiter
}

// RateLimit creates a rate limiter middleware
func RateLimit(requestsPerMin int) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getLimiter(ip, requestsPerMin)

		if !limiter.Allow() {
			c.AbortWithStatusJSON(429, gin.H{"error": "Too many requests"})
			return
		}

		c.Next()
	}
}
