const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.listUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.');
      return res.status(403).send('Unauthorized');
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.email !== 'wssadmin@wabanakisoftwaresolutions.com') {
        return res.status(403).send('Permission denied: You must be an admin to list users.');
      }

      const userRecords = await admin.auth().listUsers();
      const users = userRecords.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
      return res.status(200).json({ users });

    } catch (error) {
      console.error('Error while verifying Firebase ID token or listing users:', error);
      if(error.code === 'auth/id-token-expired') {
          return res.status(401).send('Token expired');
      }
      return res.status(500).send('Internal Server Error');
    }
  });
});
