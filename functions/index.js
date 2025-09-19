const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.listUsers = functions.https.onCall(async (data, context) => {
  if (context.auth.token.email !== 'wssadmin@wabanakisoftwaresolutions.com') {
    throw new functions.https.HttpsError('permission-denied', 'You must be an admin to list users.');
  }

  try {
    const userRecords = await admin.auth().listUsers();
    const users = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
    return { users };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error listing users', error);
  }
});
