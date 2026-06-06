import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const data = await req.json();

    // Verify Secret Token
    if (data.secret_token !== "super-secret-brainforge-key-123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!data.date || !data.schedule) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Convert date string to a safe ID (e.g., "25/05/26 (Monday)" -> "25-05-2026")
    let idDate = data.date.split(" ")[0].replace(/\//g, "-");

    const timetableDoc = {
      dateString: data.date,
      schedule: data.schedule,
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore under 'timetables' collection
    await setDoc(doc(db, "timetables", idDate), timetableDoc);

    return NextResponse.json({ success: true, message: "Timetable synced successfully!" });
  } catch (error) {
    console.error("Error syncing timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
