import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { verifyToken } from "@/lib/jwt";
export const dynamic = 'force-dynamic';

interface RequestBody {
  threadID: string;
  userAnswer: string;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { threadID, userAnswer } = body;

  if (typeof threadID !== 'string' || typeof userAnswer !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // AuthZ first: ensure the request has a valid token
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token (throws if invalid)
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb('arena');
  const threads = db.collection('threads');

  if (!ObjectId.isValid(threadID)) {
    return NextResponse.json({ error: 'Invalid thread ID' }, { status: 400 });
  }

  const thread = await threads.findOne({ _id: new ObjectId(threadID) });

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  // AuthZ: ensure the thread belongs to the authenticated user
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = verifyToken(token);

    if (!thread.userID || !thread.userID.equals(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Update the thread with the user's answer
  await threads.updateOne(
    { _id: new ObjectId(threadID) },
    { $set: { userAnswer } }
  );

  return NextResponse.json({ message: 'User answer submitted' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
