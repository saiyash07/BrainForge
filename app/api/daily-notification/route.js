import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function GET(request) {
  // Check authorization headers if needed for security (Vercel Cron automatically adds an auth header if configured)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Determine today's date formatted as "DD-MM-YYYY" (since we saved timetables like 25-05-2026)
    const today = new Date();
    // Vercel server might be UTC, adjust if needed, but assuming IST for simplicity 
    // We'll format to local or just use simple format
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    const idDate = `${day}-${month}-${year}`;

    // 2. Fetch today's timetable
    const timetableDoc = await adminDb.collection("timetables").doc(idDate).get();
    
    if (!timetableDoc.exists) {
      console.log("No automated timetable found for today:", idDate);
      return NextResponse.json({ message: "No schedule today." });
    }

    const data = timetableDoc.data();
    
    if (!data.schedule || data.schedule.length === 0) {
      return NextResponse.json({ message: "Empty schedule." });
    }

    // 3. Find the first lecture to build a summary
    const firstLecture = data.schedule.find(lec => !lec.subject.includes("LUNCH"));
    const numLectures = data.schedule.filter(lec => !lec.subject.includes("LUNCH")).length;

    let bodyMessage = `You have ${numLectures} lectures today!`;
    if (firstLecture) {
      bodyMessage = `First lecture: ${firstLecture.subject} at ${firstLecture.timing} in ${firstLecture.classroom}.`;
    }

    // 4. Fetch all users who have an FCM token saved
    const usersSnapshot = await adminDb.collection("users").get();
    const tokens = [];

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.fcmToken) {
        tokens.push(userData.fcmToken);
      }
    });

    if (tokens.length === 0) {
      console.log("No users with FCM tokens found.");
      return NextResponse.json({ message: "No subscribers." });
    }

    // 5. Send multicast push notification
    const message = {
      notification: {
        title: `Good Morning! 🎓`,
        body: bodyMessage,
      },
      tokens: tokens,
    };

    const response = await adminMessaging.sendMulticast(message);
    console.log(response.successCount + " messages were sent successfully");

    return NextResponse.json({ 
      success: true, 
      sent: response.successCount, 
      failed: response.failureCount 
    });

  } catch (error) {
    console.error("Error sending daily notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
