
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createUser() {
  try {
    const userRef = db.collection('users').doc('XL5dYU5UASURb9BhCAnuFmztfSo1');
    await userRef.set({
      uid: 'XL5dYU5UASURb9BhCAnuFmztfSo1',
      email: 'riley.gaffney@wabanakisoftwaresolutions.com',
      name: 'Riley Gaffney',
      role: 'user',
      department: '',
      employeeId: ''
    });
    console.log('User profile created successfully.');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
}

createUser();
