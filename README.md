# BreakoutLabs Progress Tracking Prototype

## Overview
- This prototype helps users see how their biomarkers changed between baseline and retest.
- It highlights improvements, worsening, or no change in simple, friendly language.
- Users can understand progress without needing medical jargon.

## Built With
- React
- JavaScript
- HTML

## Getting Started
1. Clone the repo
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the app
4. Open your browser at http://localhost:5173

## Approach
- The app compares baseline and retest biomarker results to show which markers improved, worsened, or stayed the same.
- It calculates an overall progress score to summarize progress.
- Each biomarker is classified as optimal, needs support, deficient, or elevated.
- The app tracks progress toward optimal ranges while considering the magnitude of change.
- Small changes are not always meaningful, while large changes are highlighted as significant.
- Directionality is respected because some biomarkers are better when higher and others when lower.

## Trade-offs
- The app treats all biomarkers equally even though some may affect users more than others.
- Insights are kept simple and encouraging instead of showing detailed medical analysis.
- Large changes are highlighted, but small changes may be ignored even if they are clinically relevant.

## Validation
- Sample data sets can be used to check that classifications and progress calculations match expectations.
- Manual verification ensures that insights remain clear and encouraging even if some biomarkers worsen.

## Next Steps
- Add visual charts to show trends over time and improve the design for better UI/UX.
- Store multiple test results for longitudinal tracking.
- Weight biomarkers based on their impact for personalized scoring.
- Customize insights for each user to make them more actionable.

## Assumptions
- All biomarkers are treated equally in the current version.
- Users benefit more from clear and friendly guidance than detailed medical explanations.
- Missing data prevents calculation to avoid misleading results.
- Baseline and retest values are assumed accurate.
