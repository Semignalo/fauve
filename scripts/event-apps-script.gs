/**
 * FAUVE event registration -> Google Sheet + payment proofs in Google Drive.
 *
 * Setup:
 * 1. Create a Google Sheet. Open Extensions > Apps Script and paste this whole file.
 * 2. Run any function once (e.g. doGet) and approve the Sheet + Drive permissions.
 * 3. Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone.
 * 4. Copy the Web app URL (ends with /exec) into NEXT_PUBLIC_EVENT_FORM_URL.
 * 5. After editing this script: Deploy > Manage deployments > Edit > New version.
 *
 * In the sheet, change the "Payment" column from "Awaiting check" to "Paid" after you verify the proof.
 */
var SHEET_NAME = 'Registrations';
var FOLDER_NAME = 'FAUVE Event Proofs';
var MAX_SEATS = 30; // total people
var FEE = 150000; // per person
var MAX_PAX_PER_REG = 10;
var HEADERS = ['Timestamp', 'Name', 'WhatsApp', 'Pax', 'Total (Rp)', 'Dietary restrictions', 'Proof', 'Payment'];
var PAX_COL = 4;

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (sh) return sh;
  // Use the first tab if it is still empty (a new Sheet starts with an empty 'Sheet1'),
  // so registrations show up where you are already looking.
  var first = ss.getSheets()[0];
  if (first.getLastRow() === 0) {
    sh = first;
    sh.setName(SHEET_NAME);
  } else {
    sh = ss.insertSheet(SHEET_NAME);
  }
  sh.appendRow(HEADERS);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  return sh;
}

// Total people registered so far.
function seats_(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  var vals = sh.getRange(2, PAX_COL, n, 1).getValues();
  var total = 0;
  for (var i = 0; i < vals.length; i++) total += Number(vals[i][0]) || 0;
  return total;
}

function folder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Seats taken, used by the page to show how many are left.
function doGet() {
  return json_({ count: seats_(getSheet_()), max: MAX_SEATS });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.company) return json_({ ok: true }); // honeypot, silently ignore bots
    var name = String(d.name || '').trim();
    var wa = String(d.whatsapp || '').trim();
    var pax = Math.floor(Number(d.pax));
    if (!name || !wa || !(pax >= 1 && pax <= MAX_PAX_PER_REG) || !d.proof || !d.proof.data) {
      return json_({ ok: false, error: 'missing' });
    }

    var sh = getSheet_();
    var taken = seats_(sh);
    if (taken + pax > MAX_SEATS) return json_({ ok: false, error: 'full', left: Math.max(0, MAX_SEATS - taken) });

    var proofLink;
    try {
      var mime = String(d.proof.type || 'image/jpeg');
      var ext = mime.indexOf('png') > -1 ? 'png' : 'jpg';
      var blob = Utilities.newBlob(Utilities.base64Decode(d.proof.data), mime, name + ' - ' + pax + 'pax.' + ext);
      proofLink = folder_().createFile(blob).getUrl();
    } catch (upErr) {
      proofLink = 'UPLOAD FAILED: ' + upErr; // row is still saved, ask the guest to send the receipt on WhatsApp
    }

    sh.appendRow([
      new Date(),
      name,
      "'" + wa, // keep as text so the leading 0 or + stays
      pax,
      pax * FEE,
      String(d.dietary || '').trim(),
      proofLink,
      'Awaiting check',
    ]);
    return json_({ ok: true, count: taken + pax, max: MAX_SEATS });
  } catch (err) {
    return json_({ ok: false, error: 'server', detail: String(err) });
  } finally {
    lock.releaseLock();
  }
}
