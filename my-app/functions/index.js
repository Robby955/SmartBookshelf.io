const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminClaim = functions.runWith({
  timeoutSeconds: 300,
  memory: "256MB",
}).https.onRequest(async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, {admin: true});
    return res.status(200).send(`Admin claim set for ${email}`);
  } catch (error) {
    console.error("Error setting admin claim:", error);
    return res.status(500).send("Error setting admin claim");
  }
});

exports.checkAdminStatus = functions.runWith({
  timeoutSeconds: 300,
  memory: "256MB",
}).https.onRequest(async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    const claims = user.customClaims;

    if (claims && claims.admin === true) {
      return res.status(200).send(`${email} is an admin`);
    } else {
      return res.status(200).send(`${email} is not an admin`);
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).send("Error checking admin status");
  }
});
