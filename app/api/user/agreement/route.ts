import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';
import getMongoClient from '@/lib/mongo';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userID = verifyToken(token);

    if (!userID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mongo = await getMongoClient();
    const users = mongo.db('arena').collection('users');
    const userObjectId = new ObjectId(userID);

    const result = await users.updateOne(
      { _id: userObjectId },
      {
        $set: {
          hasAgreedToTerms: true
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Agreement information updated successfully'
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
