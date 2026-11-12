"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const archiver = require("archiver");

async function packageTarget({ targetName, domain, zipFileName }) {
  console.log(`\n========================================`);
  console.log(`Building for ${targetName} (${domain}) -> ${zipFileName}`);
  console.log(`========================================`);

  const rootDir = path.resolve(__dirname, "../..");
  const frontendDir = path.join(rootDir, "kho-erp-frontend");
  const backendDir = path.join(rootDir, "kho-erp-backend");
  const zipOutputPath = path.join(rootDir, zipFileName);

  // 1. Build frontend with target VITE_API_URL
  console.log(`1. Building frontend for ${domain}...`);
  execSync("npm run build", {
    cwd: frontendDir,
    env: {
      ...process.env,
      VITE_API_URL: `https://${domain}/api`,
    },
    stdio: "inherit",
  });

  // 2. Copy dist to backend/build
  const buildDir = path.join(backendDir, "build");
  const distDir = path.join(frontendDir, "dist");
  fs.rmSync(buildDir, { recursive: true, force: true });
  fs.cpSync(distDir, buildDir, { recursive: true });
  console.log(`2. Copied dist to ${buildDir}`);

  // 3. Prepare target README-DEPLOYMENT.md
  let readme = fs.readFileSync(path.join(rootDir, "README-DEPLOYMENT.md"), "utf8");
  if (domain.includes("staging")) {
    readme = readme
      .replace(/https:\/\/will\.khosocial\.com/g, "https://staging.khosocial.com")
      .replace(/will\.khosocial\.com/g, "staging.khosocial.com")
      .replace(/will-khosocial-deployed\.zip/g, zipFileName);
  } else {
    readme = readme.replace(/will-khosocial-deployed\.zip/g, zipFileName);
  }

  // 4. Prepare target .env.example
  let envExample = fs.readFileSync(path.join(backendDir, ".env.example"), "utf8");
  if (domain.includes("staging")) {
    envExample = envExample
      .replace(/FRONTEND_URL=https:\/\/will\.khosocial\.com/g, "FRONTEND_URL=https://staging.khosocial.com")
      .replace(/BACKEND_URL=https:\/\/will\.khosocial\.com/g, "BACKEND_URL=https://staging.khosocial.com")
      .replace(/PASSWORD_RESET_URL=https:\/\/will\.khosocial\.com\/reset-password/g, "PASSWORD_RESET_URL=https://staging.khosocial.com/reset-password");
  }

  // 5. Create zip file
  console.log(`3. Creating archive ${zipOutputPath}...`);
  if (fs.existsSync(zipOutputPath)) {
    fs.unlinkSync(zipOutputPath);
  }

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipOutputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`Archive created: ${archive.pointer()} total bytes`);
      resolve();
    });
    archive.on("error", reject);
    archive.pipe(output);

    // Root files
    archive.append(readme, { name: "README-DEPLOYMENT.md" });
    archive.append(envExample, { name: ".env.example" });
    archive.file(path.join(rootDir, "database.sql"), { name: "database.sql" });
    archive.file(path.join(backendDir, ".sequelizerc"), { name: ".sequelizerc" });
    archive.file(path.join(backendDir, "index.js"), { name: "index.js" });
    archive.file(path.join(backendDir, "package.json"), { name: "package.json" });
    archive.file(path.join(backendDir, "package-lock.json"), { name: "package-lock.json" });
    archive.file(path.join(backendDir, "seed.js"), { name: "seed.js" });
    archive.file(path.join(backendDir, "server.js"), { name: "server.js" });

    // Directories
    archive.directory(path.join(backendDir, "config"), "config");
    archive.directory(path.join(backendDir, "migrations"), "migrations");
    archive.directory(path.join(backendDir, "scripts"), "scripts", (entry) => {
      if (entry.name === "package-deploy.js") return false;
      return entry;
    });
    archive.directory(path.join(backendDir, "src"), "src", (entry) => {
      if (entry.name === "logs" || entry.name.startsWith("logs/") || entry.name.includes("/logs/")) return false;
      return entry;
    });
    archive.directory(buildDir, "build");

    archive.finalize();
  });

  console.log(`✅ ${zipFileName} created successfully.`);
}

async function run() {
  const rootDir = path.resolve(__dirname, "../..");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  const datedFolder = path.join(rootDir, `deployment-packages-${dateStr}`);
  if (!fs.existsSync(datedFolder)) {
    fs.mkdirSync(datedFolder, { recursive: true });
  }

  // Target 1: Staging (staging.khosocial.com)
  await packageTarget({
    targetName: "Staging",
    domain: "staging.khosocial.com",
    zipFileName: "khosocial-staging-deploy.zip",
  });

  // Target 2: Live Production (will.khosocial.com)
  await packageTarget({
    targetName: "Live Production",
    domain: "will.khosocial.com",
    zipFileName: "khosocial-live-production.zip",
  });

  // Create legacy aliases and dated backups
  console.log("\nCreating convenient alias copies...");
  
  // Staging aliases
  fs.copyFileSync(
    path.join(rootDir, "khosocial-staging-deploy.zip"),
    path.join(rootDir, "staging-khosocial-deployed.zip")
  );
  fs.copyFileSync(
    path.join(rootDir, "khosocial-staging-deploy.zip"),
    path.join(datedFolder, `khosocial-staging-deploy-${dateStr}.zip`)
  );

  // Live Production aliases
  fs.copyFileSync(
    path.join(rootDir, "khosocial-live-production.zip"),
    path.join(rootDir, "will-khosocial-deployed.zip")
  );
  fs.copyFileSync(
    path.join(rootDir, "khosocial-live-production.zip"),
    path.join(datedFolder, `khosocial-live-production-deploy-${dateStr}.zip`)
  );

  console.log("✅ Copies created:");
  console.log(`   - staging-khosocial-deployed.zip`);
  console.log(`   - will-khosocial-deployed.zip`);
  console.log(`   - deployment-packages-${dateStr}/khosocial-staging-deploy-${dateStr}.zip`);
  console.log(`   - deployment-packages-${dateStr}/khosocial-live-production-deploy-${dateStr}.zip`);

  console.log("\n🎉 Both deliverables have been built and packaged successfully!");
}

run().catch((err) => {
  console.error("Packaging failed:", err);
  process.exit(1);
});
