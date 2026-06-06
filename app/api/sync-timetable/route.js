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

    if (!data.weeklySchedule || !Array.isArray(data.weeklySchedule)) {
      return NextResponse.json({ error: "Invalid payload format. Expected weeklySchedule array." }, { status: 400 });
    }

    // Loop through each day in the weekly schedule
    for (const dayData of data.weeklySchedule) {
      if (!dayData.date || !dayData.schedule) continue;

      // Convert "25/05/26 (Monday)" into "25-05-2026"
      const datePart = dayData.date.split(" ")[0]; // "25/05/26"
      const [day, month, shortYear] = datePart.split("/");
      
      // Handle cases where the year might already be 4 digits
      const year = shortYear.length === 2 ? `20${shortYear}` : shortYear;
      const idDate = `${day}-${month}-${year}`;

      const timetableDoc = {
        dateString: dayData.date,
        schedule: dayData.schedule,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore under 'timetables' collection
      await setDoc(doc(db, "timetables", idDate), timetableDoc);
    }

    return NextResponse.json({ success: true, message: "Weekly Timetable synced successfully!" });
  } catch (error) {
    console.error("Error syncing timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
