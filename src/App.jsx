import React, { useState } from "react";

const biomarkersOrder = [
  "Testosterone (Free)",
  "Testosterone (Total)",
  "DHEA-S",
  "SHBG",
  "Cortisol (AM)",
  "Insulin (Fasting)",
  "HbA1c",
  "Vitamin D",
  "TSH"
];

const biomarkerInfo = {
  "Testosterone (Free)": { optimal: [0.0006, 0.0045], better: "lower" },
  "Testosterone (Total)": { optimal: [0.15, 0.5], better: "lower" },
  "DHEA-S": { optimal: [35, 250], better: "lower" },
  "SHBG": { optimal: [30, 100], better: "higher" },
  "Cortisol (AM)": { optimal: [6, 15], better: "lower" },
  "Insulin (Fasting)": { optimal: [2, 7], better: "lower" },
  "HbA1c": { optimal: [4.8, 5.4], better: "lower" },
  "Vitamin D": { optimal: [30, 80], better: "higher" },
  "TSH": { optimal: [1, 2.5], better: "lower" }
};

// CLASSIFICATION 
const classifyValue = (name, value) => {
  if (value === "" || value == null || isNaN(value))
    return { label: "", color: "black" };

  const [low, high] = biomarkerInfo[name].optimal;
  const range = high - low;

  const deficientCutoff = low - 0.25 * range;
  const elevatedCutoff = high + 0.25 * range;

  const betterHigher = biomarkerInfo[name].better === "higher";

  if (value >= low && value <= high)
    return { label: "Optimal", color: "green" };

  if ((value < deficientCutoff && betterHigher) || (value > elevatedCutoff && !betterHigher))
    return { label: "Deficient", color: "red" };

  if ((value > elevatedCutoff && betterHigher) || (value < deficientCutoff && !betterHigher))
    return { label: "Elevated", color: "red" };

  return { label: "Needs Support", color: "#f0ad00" };
};

// PROGRESS
const compareProgress = (name, base, retest) => {
  if (isNaN(base) || isNaN(retest))
    return { status: "?", color: "black" };

  const [low, high] = biomarkerInfo[name].optimal;
  const range = high - low;
  const delta = retest - base;
  const percentChange = Math.abs(delta) / range;

  // Small change
  if (percentChange < 0.1) return { status: "No Change", color: "gray" };

  const betterHigher = biomarkerInfo[name].better === "higher";

  if ((betterHigher && retest > base) || (!betterHigher && retest < base)) {
    return { status: percentChange > 0.25 ? "Improved (Significant)" : "Improved", color: "green" };
  }

  if ((betterHigher && retest < base) || (!betterHigher && retest > base)) {
    return { status: percentChange > 0.25 ? "Worsened (Significant)" : "Worsened", color: "red" };
  }

  return { status: "No Change", color: "gray" };
};

// INSIGHTS 
const generateInsights = (improved, worsened, optimalCount, total) => {
  const insightLines = [];

  // Progress
  if (improved === total) {
    insightLines.push(`Amazing job! All ${total} biomarkers improved since your last check. Your hard work is paying off!`);
  } else if (worsened === total) {
    insightLines.push(`It looks like all biomarkers shifted the wrong way this time. Don’t worry, progress can take time and small consistent steps will help!`);
  } else if (improved > worsened) {
    insightLines.push(`Nice progress! ${improved} biomarkers improved while ${worsened} had a setback. Keep building on these positive changes!`);
  } else if (worsened > improved) {
    insightLines.push(`A few biomarkers worsened (${worsened}) compared to ${improved} improvement(s). This shows progress in certain areas. However, focus on adjusting habits for the others and you can keep moving forward!`);
  } else {
    insightLines.push(`Mixed changes this time: ${improved} improved and ${worsened} worsened. It is a steady pace, keep going and focus on what you can improve next!`);
  }

  // Optimal achievements
  if (optimalCount === total) {
    insightLines.push(`Fantastic! All ${total} biomarkers are now in the optimal range. Keep up the great work maintaining this balance!`);
  } else if (optimalCount >= total / 2) {
    insightLines.push(`Good job! ${optimalCount} biomarkers are already in the optimal range. With a little more effort, you could get them all there!`);
  } else if (optimalCount > 0) {
    insightLines.push(`You have got ${optimalCount} biomarker(s) in the optimal range, which is a solid start! Focusing on the rest step by step will get you closer to your goals.`);
  } else {
    insightLines.push(`None of the biomarkers are in the optimal range yet, but don’t worry! Small improvements add up over time, and you are on the right track by monitoring progress.`);
  }

  return insightLines;
};

//APP 
export default function App() {
  const [baseline, setBaseline] = useState({});
  const [retest, setRetest] = useState({});
  const [results, setResults] = useState({});
  const [overallText, setOverallText] = useState("");
  const [insights, setInsights] = useState([]);

  const handleInputChange = (name, type, value) => {
    if (type === "baseline") setBaseline({ ...baseline, [name]: value });
    else setRetest({ ...retest, [name]: value });
  };

  const handleCalculate = () => {
    for (let name of biomarkersOrder) {
      if (!baseline[name] || !retest[name]) {
        alert("A baseline or retest value is missing.");
        return;
      }
    }

    let improved = 0, worsened = 0, optimalCount = 0;
    const newResults = {};

    biomarkersOrder.forEach(name => {
      const base = parseFloat(baseline[name]);
      const retestVal = parseFloat(retest[name]);

      const progress = compareProgress(name, base, retestVal);
      const classification = classifyValue(name, retestVal);

      if (progress.status.includes("Improved")) improved++;
      if (progress.status.includes("Worsened")) worsened++;
      if (classification.label === "Optimal") optimalCount++;

      newResults[name] = { ...progress, classification };
    });

    setResults(newResults);

    const score = Math.round(((improved - worsened + biomarkersOrder.length) / (2 * biomarkersOrder.length)) * 100);
    setOverallText(`Progress Score: ${score}%`);

    const insightLines = generateInsights(improved, worsened, optimalCount, biomarkersOrder.length);
    setInsights(insightLines);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Biomarker Progress Tracker</h1>
      <table border="1" style={{ borderCollapse: "collapse", width: 750 }}>
        <thead>
          <tr>
            <th>Biomarker</th>
            <th>Baseline</th>
            <th>Retest</th>
            <th>Classification</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {biomarkersOrder.map((name) => {
            const r = results[name] || {};
            // Define units for each biomarker
            const units = {
              "Testosterone (Free)": "ng/mL",
              "Testosterone (Total)": "ng/mL",
              "DHEA-S": "ug/dL",
              "SHBG": "nmol/L",
              "Cortisol (AM)": "ug/dL",
              "Insulin (Fasting)": "uIU/mL",
              "HbA1c": "%",
              "Vitamin D": "ng/mL",
              "TSH": "uIU/mL"
            };
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  <input
                    type="number"
                    value={baseline[name] || ""}
                    onChange={(e) =>
                      handleInputChange(name, "baseline", e.target.value)
                    }
                    style={{ width: 70 }}
                  />{" "}
                  <span>{units[name]}</span>
                </td>
                <td>
                  <input
                    type="number"
                    value={retest[name] || ""}
                    onChange={(e) =>
                      handleInputChange(name, "retest", e.target.value)
                    }
                    style={{ width: 70 }}
                  />{" "}
                  <span>{units[name]}</span>
                </td>
                <td style={{ color: r.classification?.color }}>
                  {r.classification?.label || ""}
                </td>
                <td style={{ color: r.color }}>{r.status || ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 15 }}>
        <button onClick={handleCalculate}>Calculate</button>
      </div>

      {overallText && (
        <div style={{ marginTop: 20 }}>
          <h2>{overallText}</h2>
          <ul>
            {insights.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
 