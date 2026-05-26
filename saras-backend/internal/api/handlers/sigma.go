package handlers

import (
	"fmt"
	"math"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/angga/saras-backend/internal/gemini"
	"go.uber.org/zap"
	"gonum.org/v1/gonum/mat"
	"gonum.org/v1/gonum/stat/distuv"
)

type SIGMAHandler struct {
	logger       *zap.Logger
	geminiClient *gemini.Client
}

func NewSIGMAHandler(logger *zap.Logger, gc *gemini.Client) *SIGMAHandler {
	return &SIGMAHandler{logger: logger, geminiClient: gc}
}

func (h *SIGMAHandler) RecommendTest(c *gin.Context) {
	var req struct {
		Headers        []string `json:"headers" binding:"required"`
		NumericHeaders []string `json:"numeric_headers" binding:"required"`
		RowCount       int      `json:"row_count"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload. 'headers' and 'numeric_headers' are required."})
		return
	}

	if h.geminiClient == nil {
		// Fallback local logic if Gemini is not configured
		h.logger.Warn("Gemini client is nil, using local rule-based heuristic fallback")
		rec := "regression"
		lbl := "Regresi Linear Berganda"
		reason := "Direkomendasikan menggunakan Regresi Linear Berganda karena dataset Anda memiliki beberapa variabel numerik kontinu yang memungkinkan dilakukannya analisis pengaruh secara simultan dan parsial sesuai rujukan Ghozali (2021)."
		yCol := ""
		xCols := []string{}
		groupCol := ""

		if len(req.NumericHeaders) > 0 {
			yCol = req.NumericHeaders[0]
			if len(req.NumericHeaders) > 1 {
				xCols = req.NumericHeaders[1:]
			}
		}

		if len(req.NumericHeaders) == 1 {
			rec = "ttest"
			lbl = "Welch's Independent Samples t-test"
			reason = "Direkomendasikan menggunakan Welch's t-test untuk membandingkan perbedaan rata-rata antara dua kelompok data independen karena dataset hanya mendeteksi satu kolom nilai numerik."
			yCol = req.NumericHeaders[0]
			for _, h := range req.Headers {
				isNumeric := false
				for _, nh := range req.NumericHeaders {
					if h == nh {
						isNumeric = true
						break
					}
				}
				if !isNumeric {
					groupCol = h
					break
				}
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"recommendation": rec,
			"label":          lbl,
			"reason":         reason,
			"y_column":       yCol,
			"x_columns":      xCols,
			"group_column":   groupCol,
		})
		return
	}

	h.logger.Info("Generating statistical test recommendation via Gemini", zap.Int("headers_count", len(req.Headers)), zap.Int("row_count", req.RowCount))
	result, err := h.geminiClient.RecommendStatisticalTest(c.Request.Context(), req.Headers, req.NumericHeaders, req.RowCount)
	if err != nil {
		h.logger.Error("Failed to generate test recommendation via Gemini", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal merumuskan rekomendasi uji statistik dari AI."})
		return
	}

	c.JSON(http.StatusOK, result)
}

// RegressionRequest represents the input data for regression
type RegressionRequest struct {
	YColumn  string                   `json:"y_column"`
	XColumns []string                 `json:"x_columns"`
	Data     []map[string]interface{} `json:"data"`
}

type VariableResult struct {
	Name        string  `json:"name"`
	Coefficient float64 `json:"coefficient"`
	StdError    float64 `json:"std_error"`
	TStatistic  float64 `json:"t_statistic"`
	PValue      float64 `json:"p_value"`
	Significant bool    `json:"significant"`
}

func (h *SIGMAHandler) RunRegression(c *gin.Context) {
	var req RegressionRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	n := len(req.Data)
	k := len(req.XColumns)

	if n <= k+1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Jumlah data terlalu sedikit untuk jumlah variabel yang dipilih"})
		return
	}

	// ── Extract Y vector ────────────────────────────────────────
	yData := make([]float64, n)
	ySum := 0.0
	for i, row := range req.Data {
		val, err := convertToFloat64(row[req.YColumn])
		if err != nil {
			h.logger.Warn(fmt.Sprintf("Skipping row %d in regression Y parsing", i), zap.Error(err))
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Kolom Y '%s' pada baris %d tidak valid secara numerik", req.YColumn, i+1)})
			return
		}
		yData[i] = val
		ySum += val
	}
	yMean := ySum / float64(n)
	yVec := mat.NewVecDense(n, yData)

	// ── Construct X design matrix (with intercept column) ───────
	xData := make([]float64, n*(k+1))
	for i := 0; i < n; i++ {
		xData[i*(k+1)] = 1.0 // Intercept
		for j, colName := range req.XColumns {
			val, err := convertToFloat64(req.Data[i][colName])
			if err != nil {
				h.logger.Warn(fmt.Sprintf("Skipping row %d in regression X parsing for column %s", i, colName), zap.Error(err))
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Kolom X '%s' pada baris %d tidak valid secara numerik", colName, i+1)})
				return
			}
			xData[i*(k+1)+j+1] = val
		}
	}
	xMat := mat.NewDense(n, k+1, xData)

	// ── Solve OLS: β = (XᵀX)⁻¹ Xᵀy  using QR decomposition ──
	var qr mat.QR
	qr.Factorize(xMat)

	betaVec := mat.NewVecDense(k+1, nil)
	if err := qr.SolveVecTo(betaVec, false, yVec); err != nil {
		h.logger.Error("Failed to solve OLS regression (likely multicollinearity)", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal menyelesaikan perhitungan regresi (kemungkinan multikolinearitas ekstrem)",
		})
		return
	}

	// ── Compute predicted values ŷ = Xβ  and residuals ─────────
	yHatVec := mat.NewVecDense(n, nil)
	yHatVec.MulVec(xMat, betaVec)

	sst := 0.0
	ssr := 0.0
	for i := 0; i < n; i++ {
		sst += math.Pow(yData[i]-yMean, 2)
		ssr += math.Pow(yData[i]-yHatVec.AtVec(i), 2)
	}

	rSquared := 1.0 - (ssr / sst)
	adjRSquared := 1.0 - ((ssr / float64(n-k-1)) / (sst / float64(n-1)))

	// ── F-Statistic with exact p-value (Fisher–Snedecor) ────────
	fStat := ((sst - ssr) / float64(k)) / (ssr / float64(n-k-1))
	fDist := distuv.F{D1: float64(k), D2: float64(n - k - 1)}
	fPValue := 1.0 - fDist.CDF(fStat)

	// ── Standard errors via (XᵀX)⁻¹ ────────────────────────────
	s2 := ssr / float64(n-k-1) // Residual variance

	var xtx mat.Dense
	xtx.Mul(xMat.T(), xMat)

	var xtxInv mat.Dense
	if err := xtxInv.Inverse(&xtx); err != nil {
		h.logger.Warn("Could not invert XᵀX for standard errors, using fallback", zap.Error(err))
	}

	stdErrors := make([]float64, k+1)
	for i := 0; i < k+1; i++ {
		stdErrors[i] = math.Sqrt(math.Max(0, s2*xtxInv.At(i, i)))
	}

	// ── t-distribution with exact p-values ──────────────────────
	df := float64(n - k - 1)
	tDist := distuv.StudentsT{Mu: 0, Sigma: 1, Nu: df}

	// ── Assemble results ────────────────────────────────────────
	var variables []VariableResult

	// Intercept
	tIntercept := 0.0
	if stdErrors[0] > 0 {
		tIntercept = betaVec.AtVec(0) / stdErrors[0]
	}
	pIntercept := 2.0 * (1.0 - tDist.CDF(math.Abs(tIntercept)))
	variables = append(variables, VariableResult{
		Name:        "Constant (Intercept)",
		Coefficient: betaVec.AtVec(0),
		StdError:    stdErrors[0],
		TStatistic:  tIntercept,
		PValue:      pIntercept,
		Significant: pIntercept < 0.05,
	})

	// Predictors
	for j, colName := range req.XColumns {
		bVal := betaVec.AtVec(j + 1)
		seVal := stdErrors[j+1]
		tVal := 0.0
		if seVal > 0 {
			tVal = bVal / seVal
		}
		pVal := 2.0 * (1.0 - tDist.CDF(math.Abs(tVal)))
		variables = append(variables, VariableResult{
			Name:        colName,
			Coefficient: bVal,
			StdError:    seVal,
			TStatistic:  tVal,
			PValue:      pVal,
			Significant: pVal < 0.05,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"r_squared":     rSquared,
		"adj_r_squared": adjRSquared,
		"f_statistic":   fStat,
		"f_pvalue":      fPValue,
		"variables":     variables,
	})
}

// TTestRequest represents the input data for Independent Samples t-test
type TTestRequest struct {
	GroupColumn string                   `json:"group_column"`
	ValueColumn string                   `json:"value_column"`
	Data        []map[string]interface{} `json:"data"`
}

type TTestResult struct {
	TestType    string  `json:"test_type"` // "Welch's Independent t-test"
	Group1Name  string  `json:"group1_name"`
	Group1N     int     `json:"group1_n"`
	Group1Mean  float64 `json:"group1_mean"`
	Group1SD    float64 `json:"group1_sd"`
	Group2Name  string  `json:"group2_name"`
	Group2N     int     `json:"group2_n"`
	Group2Mean  float64 `json:"group2_mean"`
	Group2SD    float64 `json:"group2_sd"`
	TStatistic  float64 `json:"t_statistic"`
	DF          float64 `json:"df"`
	PValue      float64 `json:"p_value"`
	Significant bool    `json:"significant"`
}

func convertToFloat64(val interface{}) (float64, error) {
	if val == nil {
		return 0, fmt.Errorf("value is nil")
	}
	switch v := val.(type) {
	case float64:
		return v, nil
	case float32:
		return float64(v), nil
	case int:
		return float64(v), nil
	case int64:
		return float64(v), nil
	case string:
		var f float64
		if _, err := fmt.Sscanf(v, "%f", &f); err == nil {
			return f, nil
		}
		return 0, fmt.Errorf("cannot parse string as float: %s", v)
	default:
		return 0, fmt.Errorf("unsupported type %T", val)
	}
}

func convertToString(val interface{}) string {
	if val == nil {
		return ""
	}
	if s, ok := val.(string); ok {
		return strings.TrimSpace(s)
	}
	return strings.TrimSpace(fmt.Sprintf("%v", val))
}

func (h *SIGMAHandler) RunTTest(c *gin.Context) {
	var req TTestRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if req.GroupColumn == "" || req.ValueColumn == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Variabel kelompok (group_column) dan numerik (value_column) harus diisi"})
		return
	}

	// ── Group data into two sets ────────────────────────────────
	groupMap := make(map[string][]float64)
	for i, row := range req.Data {
		groupVal, exists := row[req.GroupColumn]
		if !exists {
			continue
		}
		groupStr := convertToString(groupVal)
		if groupStr == "" {
			continue
		}

		numVal, exists := row[req.ValueColumn]
		if !exists {
			continue
		}
		fVal, err := convertToFloat64(numVal)
		if err != nil {
			h.logger.Warn(fmt.Sprintf("Skipping row %d due to numeric parsing error", i), zap.Error(err))
			continue
		}

		groupMap[groupStr] = append(groupMap[groupStr], fVal)
	}

	// ── Validate that we have exactly 2 groups ──────────────────
	if len(groupMap) != 2 {
		var groups []string
		for g := range groupMap {
			groups = append(groups, g)
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Uji t-test independen memerlukan tepat 2 kelompok data unik. Ditemukan %d kelompok: %v", len(groupMap), groups),
		})
		return
	}

	// Extract groups
	var groupNames []string
	for g := range groupMap {
		groupNames = append(groupNames, g)
	}

	g1Name := groupNames[0]
	g1Data := groupMap[g1Name]
	g2Name := groupNames[1]
	g2Data := groupMap[g2Name]

	n1 := len(g1Data)
	n2 := len(g2Data)

	if n1 < 2 || n2 < 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Masing-masing kelompok harus memiliki minimal 2 data untuk menghitung standar deviasi. (Kelompok '%s' memiliki %d data, '%s' memiliki %d data)", g1Name, n1, g2Name, n2),
		})
		return
	}

	// ── Group 1 stats ───────────────────────────────────────────
	sum1 := 0.0
	for _, v := range g1Data {
		sum1 += v
	}
	mean1 := sum1 / float64(n1)

	varDiff1 := 0.0
	for _, v := range g1Data {
		varDiff1 += math.Pow(v-mean1, 2)
	}
	variance1 := varDiff1 / float64(n1-1)
	sd1 := math.Sqrt(variance1)

	// ── Group 2 stats ───────────────────────────────────────────
	sum2 := 0.0
	for _, v := range g2Data {
		sum2 += v
	}
	mean2 := sum2 / float64(n2)

	varDiff2 := 0.0
	for _, v := range g2Data {
		varDiff2 += math.Pow(v-mean2, 2)
	}
	variance2 := varDiff2 / float64(n2-1)
	sd2 := math.Sqrt(variance2)

	// ── Welch's t-test calculation ──────────────────────────────
	seTerm1 := variance1 / float64(n1)
	seTerm2 := variance2 / float64(n2)
	seDiff := math.Sqrt(seTerm1 + seTerm2)

	if seDiff == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Kedua kelompok data memiliki varians nol (nilai konstan). Perhitungan t-test tidak dapat dilakukan.",
		})
		return
	}

	tVal := (mean1 - mean2) / seDiff

	// Welch–Satterthwaite degrees of freedom (df)
	dfNum := math.Pow(seTerm1+seTerm2, 2)
	dfDenom := (math.Pow(seTerm1, 2) / float64(n1-1)) + (math.Pow(seTerm2, 2) / float64(n2-1))
	df := dfNum / dfDenom

	// P-value computation via t-distribution
	tDist := distuv.StudentsT{Mu: 0, Sigma: 1, Nu: df}
	pVal := 2.0 * (1.0 - tDist.CDF(math.Abs(tVal)))

	res := TTestResult{
		TestType:    "Welch's Independent samples t-test",
		Group1Name:  g1Name,
		Group1N:     n1,
		Group1Mean:  mean1,
		Group1SD:    sd1,
		Group2Name:  g2Name,
		Group2N:     n2,
		Group2Mean:  mean2,
		Group2SD:    sd2,
		TStatistic:  tVal,
		DF:          df,
		PValue:      pVal,
		Significant: pVal < 0.05,
	}

	c.JSON(http.StatusOK, res)
}

func (h *SIGMAHandler) GenerateNarrative(c *gin.Context) {
	var input struct {
		TestType    string          `json:"test_type"` // "regression" or "t_test"
		// Regression fields
		RSquared    float64          `json:"r_squared"`
		AdjRSquared float64          `json:"adj_r_squared"`
		FStatistic  float64          `json:"f_statistic"`
		Fpvalue     float64          `json:"f_pvalue"`
		Variables   []VariableResult `json:"variables"`

		// t-Test fields
		TTestResult *TTestResult     `json:"t_test_result"`
	}

	if err := c.BindJSON(&input); err != nil {
		h.logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var prompt string
	if input.TestType == "t_test" && input.TTestResult != nil {
		r := input.TTestResult
		sigText := "tidak signifikan"
		if r.Significant {
			sigText = "signifikan secara statistik"
		}
		prompt = fmt.Sprintf(`Tulis sebuah analisis deskriptif statistik akademis dan interpretasi hasil uji beda dua rata-rata (Independent Samples t-test menggunakan Welch's t-test) untuk dimasukkan langsung ke BAB IV Pembahasan Skripsi/Tesis mahasiswa Indonesia.

Karakteristik data pengujian:
- Jenis Pengujian: Welch's Independent Samples t-test (tidak mengasumsikan homogenitas varians)
- Grup 1: %s (N = %d, Mean = %.4f, Standar Deviasi = %.4f)
- Grup 2: %s (N = %d, Mean = %.4f, Standar Deviasi = %.4f)
- Hasil Uji: t-Statistic = %.4f, Degrees of Freedom (df) = %.2f, p-value = %.4f (%s)
`, r.Group1Name, r.Group1N, r.Group1Mean, r.Group1SD, r.Group2Name, r.Group2N, r.Group2Mean, r.Group2SD, r.TStatistic, r.DF, r.PValue, sigText)

		prompt += `
Instruksi Penulisan:
1. Gunakan bahasa Indonesia formal akademis dan ilmiah yang sangat elegan dan meyakinkan (seperti gaya analisis statistik profesional/peneliti).
2. Rujuk nama buku metodologi terkenal di Indonesia (misalnya: Sugiyono, Ghozali, atau Santoso) secara alami.
3. Struktur tulisan harus berisi:
   - Analisis deskriptif perbandingan rata-rata (mean) kedua grup (grup mana yang memiliki rata-rata lebih tinggi dan seberapa besar perbedaannya).
   - Penjelasan mengapa Welch's t-test digunakan (untuk mengantisipasi ketidaksamaan varians antar kelompok secara lebih akurat dan robust).
   - Interpretasi hasil nilai t-statistic, derajat kebebasan (df), dan signifikansi p-value (apakah perbedaan rata-rata tersebut signifikan secara statistik atau hanya kebetulan).
   - Kesimpulan akademis yang tajam mengenai implikasi praktis atau teoretis dari hasil perbedaan tersebut.
4. Jangan gunakan bullet-point. Tulis dalam bentuk beberapa paragraf naratif akademis yang padat dan komprehensif.`
	} else {
		prompt = fmt.Sprintf(`Tulis sebuah analisis deskriptif statistik akademis dan interpretasi hasil regresi linear berganda untuk dimasukkan langsung ke BAB IV Pembahasan Skripsi/Tesis mahasiswa Indonesia.

Karakteristik data pengujian:
- R-Square: %.4f
- Adjusted R-Square: %.4f
- Uji Simultan (Uji F): F-Statistic = %.4f dengan p-value = %.4f
- Variabel pengujian (Koefisien, Uji t, p-value):
`, input.RSquared, input.AdjRSquared, input.FStatistic, input.Fpvalue)

		for _, v := range input.Variables {
			sigText := "tidak signifikan"
			if v.Significant {
				sigText = "signifikan secara statistik"
			}
			prompt += fmt.Sprintf("  * %s: Koefisien = %.4f, t-stat = %.4f, p-value = %.4f (%s)\n", v.Name, v.Coefficient, v.TStatistic, v.PValue, sigText)
		}

		prompt += `
Instruksi Penulisan:
1. Gunakan bahasa Indonesia formal akademis dan ilmiah yang sangat elegan dan meyakinkan (seperti gaya analisis statistik profesional/peneliti).
2. Rujuk nama buku metodologi terkenal di Indonesia (misalnya: Ghozali, Sugiyono, atau Hair et al.) secara alami.
3. Struktur tulisan harus berisi:
   - Interpretasi nilai koefisien determinasi R-Square (berapa persen variansi Y yang dapat dijelaskan oleh variabel X).
   - Interpretasi hasil Uji F secara simultan (apakah model regresi ini layak digunakan untuk memprediksi).
   - Interpretasi hasil Uji t secara parsial untuk masing-masing variabel independen X (bagaimana arah pengaruh positif/negatif, dan signifikansinya).
4. Jangan gunakan bullet-point. Tulis dalam bentuk beberapa paragraf naratif akademis yang padat dan komprehensif.`
	}

	if h.geminiClient == nil {
		h.logger.Error("Gemini client is uninitialized (missing GEMINI_API_KEY)")
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "Layanan AI Narasi Akademik (SIGMA) sedang tidak tersedia. Silakan periksa konfigurasi GEMINI_API_KEY pada backend.",
		})
		return
	}

	output, err := h.geminiClient.GenerateStructuredNarrative(c.Request.Context(), prompt)
	if err != nil {
		h.logger.Error("Failed to generate structured narrative", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate narrative"})
		return
	}

	c.JSON(http.StatusOK, output)
}

