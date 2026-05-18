package gemini

import (
	"regexp"
)

var (
	emailRegex = regexp.MustCompile(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`)
	phoneRegex = regexp.MustCompile(`(\+62|08)\d{8,12}`)
	nimRegex   = regexp.MustCompile(`\b\d{10,13}\b`) // Indonesian NIM format typically 10-13 digits
)

// ScrubPII removes personally identifiable information before sending data to external APIs
func ScrubPII(text string) string {
	text = emailRegex.ReplaceAllString(text, "[EMAIL_REDACTED]")
	text = phoneRegex.ReplaceAllString(text, "[PHONE_REDACTED]")
	text = nimRegex.ReplaceAllString(text, "[NIM_REDACTED]")
	return text
}
