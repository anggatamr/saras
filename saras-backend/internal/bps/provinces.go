package bps

import (
	"strings"
)

// Map student text → official BPS province codes
// BPS domain codes for provinces usually start at 11 (Aceh) to 94 (Papua)
// 0000 is for National
var provinceAliases = map[string]string{
	"nasional":          "0000",
	"indonesia":         "0000",
	"aceh":              "1100",
	"sumut":             "1200",
	"sumatera utara":    "1200",
	"sumatra utara":     "1200",
	"sumbar":            "1300",
	"sumatera barat":    "1300",
	"riau":              "1400",
	"jambi":             "1500",
	"sumsel":            "1600",
	"sumatera selatan":  "1600",
	"bengkulu":          "1700",
	"lampung":           "1800",
	"babel":             "1900",
	"bangka belitung":   "1900",
	"kepri":             "2100",
	"kepulauan riau":    "2100",
	"jakarta":           "3100",
	"dki jakarta":       "3100",
	"jabar":             "3200",
	"jawa barat":        "3200",
	"jateng":            "3300",
	"jawa tengah":       "3300",
	"diy":               "3400",
	"yogyakarta":        "3400",
	"jatim":             "3500",
	"jawa timur":        "3500",
	"banten":            "3600",
	"bali":              "5100",
	"ntb":               "5200",
	"nusa tenggara barat": "5200",
	"ntt":               "5300",
	"nusa tenggara timur": "5300",
	"kalbar":            "6100",
	"kalimantan barat":  "6100",
	"kalteng":           "6200",
	"kalimantan tengah": "6200",
	"kalsel":            "6300",
	"kalimantan selatan": "6300",
	"kaltim":            "6400",
	"kalimantan timur":  "6400",
	"kaltara":           "6500",
	"kalimantan utara":  "6500",
	"sulut":             "7100",
	"sulawesi utara":    "7100",
	"sulteng":           "7200",
	"sulawesi tengah":   "7200",
	"sulsel":            "7300",
	"sulawesi selatan":  "7300",
	"sultra":            "7400",
	"sulawesi tenggara": "7400",
	"gorontalo":         "7500",
	"sulbar":            "7600",
	"sulawesi barat":    "7600",
	"maluku":            "8100",
	"malut":             "8200",
	"maluku utara":      "8200",
	"papua barat":       "9100",
	"papua":             "9400",
}

// ResolveProvinceCode attempts to find the official BPS province domain code
// based on user input using fuzzy matching (alias lookup).
func ResolveProvinceCode(input string) string {
	input = strings.ToLower(strings.TrimSpace(input))
	input = strings.ReplaceAll(input, "prov.", "")
	input = strings.ReplaceAll(input, "provinsi", "")
	input = strings.TrimSpace(input)
	
	if code, exists := provinceAliases[input]; exists {
		return code
	}
	// Fallback to National if unknown
	return "0000"
}
