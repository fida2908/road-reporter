const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firebase Auth Cloud Function
exports.createUser = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
