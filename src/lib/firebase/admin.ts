import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import { readFileSync } from "fs";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountPath = path.resolve(
    process.cwd(),
    "service-account-key.json",
  );
  const serviceAccount = JSON.parse(
    readFileSync(serviceAccountPath, "utf-8"),
  );

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const app = getFirebaseAdmin();
export const auth = getAuth(app);
