// IRT (Item Response Theory) Scoring Engine
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
// Implements 3-Parameter Logistic (3PL) model

export interface IRTQuestion {
  difficultyWeight: number;  // b-parameter (difficulty)
  discriminationA:  number;  // a-parameter (discrimination)
  guessingC:        number;  // c-parameter (pseudo-guessing)
  isCorrect:        boolean;
}

/**
 * 3PL IRT Probability: P(θ) = c + (1-c) / (1 + e^(-1.7a(θ-b)))
 */
export function irtProbability(
  theta: number,
  a: number,
  b: number,
  c: number
): number {
  return c + (1 - c) / (1 + Math.exp(-1.7 * a * (theta - b)));
}

/**
 * Estimate user ability (θ) using Newton-Raphson MLE
 * Returns theta in range [-3, 3]
 */
export function estimateTheta(
  responses: IRTQuestion[],
  initialTheta = 0,
  maxIterations = 50,
  tolerance = 0.001
): number {
  let theta = initialTheta;

  for (let iter = 0; iter < maxIterations; iter++) {
    let L1 = 0; // First derivative of log-likelihood
    let L2 = 0; // Second derivative of log-likelihood

    for (const r of responses) {
      const { discriminationA: a, difficultyWeight: b, guessingC: c, isCorrect } = r;
      const P = irtProbability(theta, a, b, c);
      const Q = 1 - P;
      const W = (P - c) / (1 - c);

      if (isCorrect) {
        L1 += 1.7 * a * W * (Q / P);
        L2 -= (1.7 * a) ** 2 * W * (Q / P) * (W + (Q * (1 - W)) / P);
      } else {
        L1 -= 1.7 * a * W * (P / Q);
        L2 -= (1.7 * a) ** 2 * W * (P / Q) * ((1 - W) + (P * W) / Q);
      }
    }

    if (Math.abs(L2) < 1e-10) break;

    const delta = -L1 / L2;
    theta += delta;
    theta = Math.max(-3, Math.min(3, theta)); // Clamp to [-3, 3]

    if (Math.abs(delta) < tolerance) break;
  }

  return theta;
}

/**
 * Convert IRT theta to a 0-100 score scale
 */
export function thetaToScore(theta: number): number {
  // Linear mapping: theta [-3, 3] → [0, 100]
  return Math.round(((theta + 3) / 6) * 100);
}

/**
 * Calculate IRT score for a completed session
 */
export function calculateIRTScore(responses: IRTQuestion[]): {
  theta:    number;
  score:    number;
  accuracy: number;
} {
  if (responses.length === 0) return { theta: 0, score: 0, accuracy: 0 };

  const theta    = estimateTheta(responses);
  const score    = thetaToScore(theta);
  const correct  = responses.filter(r => r.isCorrect).length;
  const accuracy = (correct / responses.length) * 100;

  return { theta, score, accuracy };
}

/**
 * IRT probability for display purposes
 */
export function getItemProbability(
  theta: number,
  question: Pick<IRTQuestion, 'discriminationA' | 'difficultyWeight' | 'guessingC'>
): number {
  return irtProbability(
    theta,
    question.discriminationA,
    question.difficultyWeight,
    question.guessingC
  );
}
