/**
 * Smoke test for M3 imaging strip / encrypt helpers (no DB required).
 * Run: npx tsx scripts/smoke-imaging.ts
 */
import assert from "assert";
import {
  decryptVaultBytes,
  encryptVaultBytes,
  stripImagingIdentifiers,
  detectImagingKind,
  isAllowedImagingUpload,
} from "../src/lib/imaging";

process.env.IMAGING_VAULT_KEY = "smoke-test-key";

const plain = Buffer.from("synthetic-dicom-bytes");
const enc = encryptVaultBytes(plain);
assert.notDeepEqual(enc, plain);
const dec = decryptVaultBytes(enc);
assert.deepEqual(dec, plain);

const working = stripImagingIdentifiers({
  studyId: "study1",
  projectId: "proj1",
  subjectKey: "SYN-001",
  modality: "CT",
  studyDate: new Date("2024-01-01"),
  accessionStub: "ACC-TEST",
  description: "demo",
  fileKind: "dicom",
});
assert.equal(working.pixelsIncluded, false);
assert.equal(working.identifiersRedacted, true);
assert.equal(working.subjectKey, "SYN-001");
assert.ok(!("patientName" in working));
assert.ok(!("mrn" in working));

assert.equal(detectImagingKind("scan.dcm", "application/dicom"), "dicom");
assert.equal(detectImagingKind("x.png", "image/png"), "png");
assert.ok(isAllowedImagingUpload("a.dcm"));
assert.ok(!isAllowedImagingUpload("evil.exe"));

console.log("smoke-imaging OK");
