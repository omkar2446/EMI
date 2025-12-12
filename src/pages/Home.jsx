import React, { useEffect, useState } from "react";

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#f7f9fc",
    padding: "40px 16px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "28px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#222",
  },
  card: {
    padding: "22px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#444",
    fontWeight: 600,
  },
  inputField: {
    padding: "10px 12px",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #e6e6e6",
    borderRadius: "8px",
    fontSize: "15px",
  },
  rangeInput: {
    width: "100%",
    marginTop: "12px",
    appearance: "none",
    height: "6px",
    borderRadius: "3px",
    background: "#e6e6e6",
  },
  resultsContainer: {
    marginTop: "20px",
    paddingTop: "14px",
    borderTop: "1px solid #f0f0f0",
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "15px",
    color: "#333",
  },
  emiResult: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#007bff",
  },
  donutLegend: {
    display: "flex",
    gap: "14px",
    marginTop: "18px",
    alignItems: "center",
  },
};

export default function Home() {
  // state for inputs (allow empty string while typing)
  const [loan, setLoan] = useState(350000);
  const [rate, setRate] = useState(15);
  const [years, setYears] = useState(13);

  // responsive state
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // safe numeric values
  const safeLoan = loan === "" ? 0 : Number(loan);
  const safeRate = rate === "" ? 0 : Number(rate);
  const safeYears = years === "" ? 0 : Number(years);

  const months = Math.max(1, safeYears) * 12; // avoid zero in denominator
  const monthlyRate = safeRate / 12 / 100;

  // EMI calculation with guards
  let emi = 0;
  let totalAmount = 0;
  let totalInterest = 0;

  if (safeLoan > 0 && months > 0) {
    if (monthlyRate > 0) {
      const power = Math.pow(1 + monthlyRate, months);
      emi = (safeLoan * monthlyRate * power) / (power - 1);
      totalAmount = emi * months;
      totalInterest = totalAmount - safeLoan;
    } else {
      // 0% interest simple division
      emi = safeLoan / months;
      totalAmount = safeLoan;
      totalInterest = 0;
    }
  }

  // percent breakdown (for legend and donut)
  const principalPercent = totalAmount > 0 ? (safeLoan / totalAmount) * 100 : 0;
  const interestPercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

  // donut style computed here (so it can use runtime values)
  const donutSize = isMobile ? 180 : 240;
  const donutStyle = {
    width: donutSize + "px",
    height: donutSize + "px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // color: principal blue, interest green
    background: `conic-gradient(
      #007bff 0% ${principalPercent}%,
      #28a745 ${principalPercent}% 100%
    )`,
  };
  const donutCenterStyle = {
    width: Math.round(donutSize * 0.52) + "px",
    height: Math.round(donutSize * 0.52) + "px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boxShadow: "inset 0 0 12px rgba(0,0,0,0.03)",
  };

  // number formatting for India (lakhs/crores)
  const fmt = (n) => {
    try {
      return new Intl.NumberFormat("en-IN").format(Math.round(n));
    } catch {
      return String(n);
    }
  };

  // helper that ensures inputs accept empty string while typing
  const handleNumberInput = (setter) => (e) => {
    const v = e.target.value;
    // allow empty string so user can delete
    if (v === "") {
      setter("");
      return;
    }
    // prevent negative values: you can adjust if negatives allowed
    const num = Number(v);
    if (Number.isNaN(num)) return;
    setter(num);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 EMI Calculator</h1>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 20 : 40,
          maxWidth: 1100,
          margin: "0 auto",
          alignItems: "flex-start",
        }}
      >
        {/* left: inputs */}
        <div style={{ ...styles.card, width: isMobile ? "100%" : "56%" }}>
          {/* Loan amount */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Loan amount (₹)</label>
            <input
              type="number"
              inputMode="numeric"
              value={loan}
              onChange={handleNumberInput(setLoan)}
              placeholder="Enter loan amount"
              style={styles.inputField}
            />
            <input
              style={styles.rangeInput}
              type="range"
              min={50000}
              max={10000000}
              step={50000}
              value={safeLoan}
              onChange={(e) => setLoan(Number(e.target.value))}
            />
          </div>

          {/* Rate */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Rate of interest (p.a, %)</label>
            <input
              type="number"
              inputMode="decimal"
              value={rate}
              onChange={handleNumberInput(setRate)}
              placeholder="Annual interest rate"
              style={styles.inputField}
            />
            <input
              style={styles.rangeInput}
              type="range"
              min={0}
              max={30}
              step={0.1}
              value={safeRate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

          {/* Years */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Loan tenure (Years)</label>
            <input
              type="number"
              inputMode="numeric"
              value={years}
              onChange={handleNumberInput(setYears)}
              placeholder="Years"
              style={styles.inputField}
            />
            <input
              style={styles.rangeInput}
              type="range"
              min={1}
              max={40}
              step={1}
              value={safeYears || 1}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>

          {/* Results */}
          <div style={styles.resultsContainer}>
            <div style={{ ...styles.resultItem, ...styles.emiResult }}>
              <span>Monthly EMI</span>
              <span>₹{fmt(emi)}</span>
            </div>
            <div style={styles.resultItem}>
              <span>Principal amount</span>
              <span>₹{fmt(safeLoan)}</span>
            </div>
            <div style={styles.resultItem}>
              <span>Total interest</span>
              <span>₹{fmt(totalInterest)}</span>
            </div>
            <div style={styles.resultItem}>
              <span>Total amount payable</span>
              <span>₹{fmt(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* right: donut */}
        <div
          style={{
            width: isMobile ? "100%" : "44%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ ...styles.card, padding: 18, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", background: "#f7f9fc", boxShadow: "none" }}>
            <div style={donutStyle}>
              <div style={donutCenterStyle}>
                <div style={{ fontSize: 13, color: "#666" }}>Interest</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#333" }}>
                  {totalAmount > 0 ? interestPercent.toFixed(1) : "0.0"}%
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{fmt(totalInterest)}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#007bff", marginRight: 6 }} />
              <div style={{ fontSize: 13, color: "#444" }}>Principal {principalPercent.toFixed(1)}%</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28a745", marginRight: 6 }} />
              <div style={{ fontSize: 13, color: "#444" }}>Interest {interestPercent.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
