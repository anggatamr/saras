package handlers

import (
	"fmt"
	"math"
	"net/http"

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
	c.JSON(200, gin.H{
		"recommendation": "Multiple Linear Regression",
		"reason":         "Berdasarkan tujuan analisis memprediksi dan tipe data variabel independen numerik kontinu.",
	})
}

// RegressionRequest represents the input data for regression
type RegressionRequest struct {
	YColumn  string               `json:"y_column"`
	XColumns []string             `json:"x_columns"`
	Data     []map[string]float64 `json:"data"`
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
		yData[i] = row[req.YColumn]
		ySum += yData[i]
	}
	yMean := ySum / float64(n)
	yVec := mat.NewVecDense(n, yData)

	// ── Construct X design matrix (with intercept column) ───────
	xData := make([]float64, n*(k+1))
	for i := 0; i < n; i++ {
		xData[i*(k+1)] = 1.0 // Intercept
		for j, colName := range req.XColumns {
			xData[i*(k+1)+j+1] = req.Data[i][colName]
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

func (h *SIGMAHandler) RunTTest(c *gin.Context) {
	c.JSON(200, gin.H{"message": "RunTTest placeholder"})
}

func (h *SIGMAHandler) GenerateNarrative(c *gin.Context) {
	var input struct {
		RSquared    float64          `json:"r_squared"`
		AdjRSquared float64          `json:"adj_r_squared"`
		FStatistic  float64          `json:"f_statistic"`
		Fpvalue     float64          `json:"f_pvalue"`
		Variables   []VariableResult `json:"variables"`
	}

	if err := c.BindJSON(&input); err != nil {
		h.logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	prompt := fmt.Sprintf(`Tulis sebuah analisis deskriptif statistik akademis dan interpretasi hasil regresi linear berganda untuk dimasukkan langsung ke BAB IV Pembahasan Skripsi/Tesis mahasiswa Indonesia.

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

	output, err := h.geminiClient.GenerateStructuredNarrative(c.Request.Context(), prompt)
	if err != nil {
		h.logger.Error("Failed to generate structured narrative", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate narrative"})
		return
	}

	c.JSON(http.StatusOK, output)
}

