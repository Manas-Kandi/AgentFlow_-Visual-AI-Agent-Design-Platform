#!/usr/bin/env node

/**
 * AgentFlow Authentication Fix Script
 * This script helps fix common authentication issues
 */

import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "src", "app");
const COMPONENTS_DIR = path.join(process.cwd(), "src", "components");
const CONTEXTS_DIR = path.join(process.cwd(), "src", "contexts");

console.log("🔧 AgentFlow Authentication Fix Script");
console.log("=====================================");

// Check if we're in the right directory
if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
  console.error(
    "❌ Error: This script must be run from the project root directory"
  );
  process.exit(1);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? "✅" : "❌"} ${description}: ${filePath}`);
  return exists;
}

function checkEnvironment() {
  console.log("\n📋 Checking Environment...");

  const envLocal = path.join(process.cwd(), ".env.local");
  const envExample = path.join(process.cwd(), ".env.example");

  const hasEnvLocal = checkFile(envLocal, ".env.local file");
  const hasEnvExample = checkFile(envExample, ".env.example file");

  if (!hasEnvLocal) {
    console.log("⚠️  Warning: .env.local file is missing");

    if (hasEnvExample) {
      console.log(
        "💡 Tip: Copy .env.example to .env.local and add your Supabase credentials"
      );
    } else {
      console.log("💡 Tip: Create .env.local with your Supabase credentials");
      console.log(
        "   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
      );
      console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here");
    }
  }

  // Check if environment variables would be available
  if (hasEnvLocal) {
    try {
      const envContent = fs.readFileSync(envLocal, "utf8");
      const hasSupabaseUrl = envContent.includes("NEXT_PUBLIC_SUPABASE_URL=");
      const hasSupabaseKey = envContent.includes(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY="
      );

      console.log(`${hasSupabaseUrl ? "✅" : "❌"} Supabase URL configured`);
      console.log(`${hasSupabaseKey ? "✅" : "❌"} Supabase key configured`);

      if (!hasSupabaseUrl || !hasSupabaseKey) {
        console.log(
          "⚠️  Warning: Missing Supabase configuration in .env.local"
        );
      }
    } catch (error) {
      console.log("❌ Error reading .env.local file");
    }
  }
}

function checkFiles() {
  console.log("\n📁 Checking Required Files...");

  const requiredFiles = [
    { path: path.join(APP_DIR, "page.tsx"), desc: "Root page" },
    { path: path.join(APP_DIR, "layout.tsx"), desc: "Root layout" },
    {
      path: path.join(APP_DIR, "auth", "login", "page.tsx"),
      desc: "Login page",
    },
    {
      path: path.join(APP_DIR, "dashboard", "page.tsx"),
      desc: "Dashboard page",
    },
    { path: path.join(CONTEXTS_DIR, "AuthContext.tsx"), desc: "Auth context" },
    {
      path: path.join(COMPONENTS_DIR, "AuthWrapper.tsx"),
      desc: "Auth wrapper",
    },
  ];

  const missingFiles = [];

  requiredFiles.forEach(({ path: filePath, desc }) => {
    const exists = checkFile(filePath, desc);
    if (!exists) {
      missingFiles.push({ path: filePath, desc });
    }
  });

  if (missingFiles.length > 0) {
    console.log("\n❌ Missing Files Detected:");
    missingFiles.forEach(({ path: filePath, desc }) => {
      console.log(`   - ${desc}: ${filePath}`);
    });
    console.log(
      "\n💡 These files are required for authentication to work properly."
    );
    console.log(
      "   Please ensure all files are created with the correct content."
    );
  } else {
    console.log("\n✅ All required files are present!");
  }

  return missingFiles.length === 0;
}

function checkDependencies() {
  console.log("\n📦 Checking Dependencies...");

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    );
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const requiredDeps = [
      "@supabase/supabase-js",
      "next",
      "react",
      "@types/react",
    ];

    requiredDeps.forEach((dep) => {
      const installed = deps[dep];
      console.log(
        `${installed ? "✅" : "❌"} ${dep}: ${installed || "Not installed"}`
      );
    });

    if (!deps["@supabase/supabase-js"]) {
      console.log("\n❌ Supabase client is not installed!");
      console.log("   Run: npm install @supabase/supabase-js");
      return false;
    }
  } catch (error) {
    console.log("❌ Error reading package.json");
    return false;
  }

  return true;
}

function provideFixes() {
  console.log("\n🔧 Common Fixes:");
  console.log("================");

  console.log("\n1. If app is stuck at loading screen:");
  console.log("   - Ensure .env.local has correct Supabase credentials");
  console.log("   - Restart the development server (npm run dev)");
  console.log("   - Clear browser cache or try incognito mode");

  console.log("\n2. If authentication is not working:");
  console.log("   - Check browser console for errors (F12 → Console)");
  console.log("   - Verify Supabase project settings (email auth enabled)");
  console.log("   - Make sure all required files are present");

  console.log("\n3. If redirects are not working:");
  console.log("   - Check that AuthWrapper is properly configured");
  console.log("   - Ensure root page.tsx exists and handles routing");
  console.log("   - Verify no conflicting auth logic in components");

  console.log("\n4. Emergency reset:");
  console.log("   - Delete .next folder: rm -rf .next");
  console.log("   - Restart dev server: npm run dev");
  console.log("   - Clear browser local storage");
}

// Run the checks
async function main() {
  console.log("Starting AgentFlow authentication diagnosis...\n");

  const envOk = checkEnvironment();
  const filesOk = checkFiles();
  const depsOk = checkDependencies();

  console.log("\n📊 Summary:");
  console.log("===========");
  console.log(`Environment: ${envOk ? "✅ OK" : "❌ Issues detected"}`);
  console.log(`Files: ${filesOk ? "✅ OK" : "❌ Missing files"}`);
  console.log(`Dependencies: ${depsOk ? "✅ OK" : "❌ Missing packages"}`);

  if (envOk && filesOk && depsOk) {
    console.log("\n🎉 Everything looks good! Your app should work properly.");
    console.log("   If you're still having issues:");
    console.log("   1. Restart the development server");
    console.log("   2. Clear your browser cache");
    console.log("   3. Check browser console for errors");
  } else {
    console.log("\n⚠️  Issues detected. Please fix the above problems.");
    provideFixes();
  }

  console.log("\n📖 For detailed troubleshooting, see TROUBLESHOOTING.md");
}

main().catch(console.error);
