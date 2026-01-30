const { execFile } = require("child_process");
const path = require("path");

/**
 * Hardcoded Python path to ensure the ML venv is used
 * IMPORTANT: adjust ONLY if your project path changes
 */
const PYTHON_PATH =
  "C:\\Users\\nihar\\OneDrive\\Desktop\\project\\ml_env\\Scripts\\python.exe";

module.exports = function callML(filePath) {
  return new Promise((resolve) => {
    const scriptPath = path.join(
      __dirname,
      "../../../ml/predict_sensitivity.py"
    );

    execFile(
      PYTHON_PATH,
      [scriptPath, filePath],
      { windowsHide: true },
      (err, stdout, stderr) => {
        if (err) {
          console.warn("⚠️ ML failed → defaulting to HIGH");
          if (stderr) {
            console.warn("ML stderr:", stderr.toString());
          }
          return resolve("HIGH");
        }

        const result = stdout.toString().trim();

        if (!result) {
          console.warn("⚠️ ML returned empty result → defaulting to HIGH");
          return resolve("HIGH");
        }

        resolve(result);
      }
    );
  });
};
