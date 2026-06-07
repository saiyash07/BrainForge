const fs = require('fs');
const admin = require('firebase-admin');

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2];
  }
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function checkTimetables() {
  const snapshot = await db.collection('timetables').get();
  console.log(`Found ${snapshot.size} documents in timetables collection.`);
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', JSON.stringify(doc.data(), null, 2).slice(0, 300) + '...');
  });
}

checkTimetables();
