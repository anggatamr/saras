package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/firebase"
)

// FirebaseAuth verifies the Firebase token
func FirebaseAuth(fbApp *firebase.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Mock auth for development if no auth client
		if fbApp.AuthClient == nil {
			c.Set("uid", "dev-user")
			c.Set("email", "dev@unimed.ac.id")
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "Authorization header required"})
			return
		}

		parts := strings.Split(authHeader, "Bearer ")
		if len(parts) != 2 {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid Authorization header format"})
			return
		}

		tokenString := parts[1]
		token, err := fbApp.AuthClient.VerifyIDToken(c.Request.Context(), tokenString)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid or expired token"})
			return
		}

		c.Set("uid", token.UID)
		if email, ok := token.Claims["email"].(string); ok {
			c.Set("email", email)
		}

		c.Next()
	}
}
