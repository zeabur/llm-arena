import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongo";
import logger from "@/lib/logger";

export const dynamic = 'force-dynamic';

interface ThreadDocument {
  _id: ObjectId;
  userID: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  initialContext: {
    question: string;
    source: string;
    metadata?: Record<string, unknown>;
  };
  selectedModels: string[];
  model1Messages: { role: 'user' | 'assistant'; content: string }[];
  model2Messages: { role: 'user' | 'assistant'; content: string }[];
}

async function getThreadInfo(threadID: ObjectId, userID: ObjectId) {
  const db = await getDb('arena');
  const threads = db.collection<ThreadDocument>('threads');
  const thread = await threads.findOne({ _id: threadID, userID });

  return thread ?? null;
}

export async function POST(request: NextRequest) {
  logger.info('POST /api/thread/info - Request started');

  try {
    const { threadId } = await request.json();
    logger.debug('Thread info request for threadId:', threadId);

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    // 驗證用戶身份
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;

    if (!token) {
      logger.warn('No token found');

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    let userID: ObjectId;

    try {
      userID = verifyToken(token);
      logger.info('User authenticated:', userID.toHexString());
    } catch (error) {
      logger.warn('Token verification failed:', error);

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    let thread = null;

    try {
      thread = await getThreadInfo(new ObjectId(threadId), userID);
      logger.debug('Thread loaded:', thread ? 'found' : 'not found');
    } catch (error) {
      logger.error('Error loading thread:', error);

      return NextResponse.json({ error: 'Invalid thread ID' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (!thread) {
      logger.info('Thread not found or access denied');

      return NextResponse.json({ error: 'Thread not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    const response = {
      threadId: thread._id.toString(),
      category: thread.category,
      initialContext: thread.initialContext,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      selectedModels: thread.selectedModels
    };

    logger.info('Returning thread info:', {
      threadId: response.threadId,
      question: response.initialContext?.question?.substring(0, 50) + '...'
    });

    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    logger.error('Error in thread info endpoint:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
