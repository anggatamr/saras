package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// Auth verifies the user identity using a custom header from NextAuth.
// In production (GIN_MODE=release), requests without a valid academic
// email header are rejected outright — no dev fallback is allowed.
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.GetHeader("X-User-Email")
		secret := c.GetHeader("X-Saras-Secret")
		isRelease := os.Getenv("GIN_MODE") == "release"

		// Gateway-level Shared Secret Validation in production
		if isRelease {
			expectedSecret := os.Getenv("SARAS_API_SECRET")
			if expectedSecret != "" && secret != expectedSecret {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "Unauthorized: Invalid gateway signature. Direct API access is restricted.",
				})
				c.Abort()
				return
			}
		}

		if email == "" {
			if isRelease {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "Unauthorized: Missing identity header. Please authenticate via the SARAS frontend.",
				})
				c.Abort()
				return
			}
			// Development-only fallback
			c.Set("uid", "dev-user")
			c.Set("email", "dev@unimed.ac.id")
			c.Next()
			return
		}

		// Validate academic email domain (.ac.id or .edu)
		emailLower := strings.ToLower(strings.TrimSpace(email))
		if isRelease && !strings.HasSuffix(emailLower, ".ac.id") && !strings.HasSuffix(emailLower, ".edu") {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Forbidden: Only verified academic emails (.ac.id / .edu) are permitted.",
			})
			c.Abort()
			return
		}

		c.Set("uid", emailLower)
		c.Set("email", emailLower)
		c.Next()
	}
}

