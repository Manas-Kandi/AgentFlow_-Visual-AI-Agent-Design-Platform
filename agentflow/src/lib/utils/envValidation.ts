/**
 * Environment variable validation utility
 * This helps debug authentication issues by checking required env vars
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: {
    supabaseUrl?: string;
    supabaseKey?: string;
    geminiKey?: string;
  };
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Check required Supabase variables
  if (!supabaseUrl) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is not set");
  } else if (!supabaseUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must start with https://");
  } else if (!supabaseUrl.includes(".supabase.co")) {
    warnings.push("NEXT_PUBLIC_SUPABASE_URL doesn't look like a Supabase URL");
  }

  if (!supabaseKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  } else if (supabaseKey.length < 100) {
    warnings.push("NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short");
  }

  // Check optional variables
  if (!geminiKey) {
    warnings.push(
      "NEXT_PUBLIC_GEMINI_API_KEY is not set (AI features will be disabled)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: {
      supabaseUrl: supabaseUrl
        ? `${supabaseUrl.substring(0, 20)}...`
        : undefined,
      supabaseKey: supabaseKey
        ? `${supabaseKey.substring(0, 20)}...`
        : undefined,
      geminiKey: geminiKey ? `${geminiKey.substring(0, 20)}...` : undefined,
    },
  };
}

/**
 * Log environment validation results to console
 */
export function logEnvironmentStatus(): void {
  const result = validateEnvironment();

  console.log("🔍 Environment Validation Results:");
  console.log("==================================");

  if (result.isValid) {
    console.log("✅ Environment is valid");
  } else {
    console.log("❌ Environment has errors");
  }

  if (result.errors.length > 0) {
    console.log("\n🚨 ERRORS:");
    result.errors.forEach((error) => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:");
    result.warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  console.log("\n📋 Configuration:");
  if (result.config.supabaseUrl) {
    console.log(`  Supabase URL: ${result.config.supabaseUrl}`);
  }
  if (result.config.supabaseKey) {
    console.log(`  Supabase Key: ${result.config.supabaseKey}`);
  }
  if (result.config.geminiKey) {
    console.log(`  Gemini Key: ${result.config.geminiKey}`);
  }

  console.log("==================================");
}
