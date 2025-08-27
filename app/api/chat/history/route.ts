import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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
  model1Plan?: string;
  model2Plan?: string;
}

async function getThreadMessages(threadID: ObjectId) {
  const db = await getDb('arena');
  const threads = db.collection<ThreadDocument>('threads');
  const thread = await threads.findOne({ _id: threadID });

  return thread ?? null;
}

export async function POST(request: NextRequest) {
  logger.info('POST /api/chat/history - Request started');

  try {
    const { threadId } = await request.json();
    logger.debug('History request for threadId:', threadId);

    if (!threadId) {
      logger.warn('No threadId provided, returning empty messages');

      return NextResponse.json({ messagesLeft: [], messagesRight: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    let thread = null;

    try {
      thread = await getThreadMessages(new ObjectId(threadId));
      logger.debug('Thread loaded:', thread ? 'found' : 'not found');
    } catch (error) {
      logger.error('Error loading thread:', error);
      thread = null;
    }

    if (!thread) {
      logger.info('Thread not found, returning empty messages');

      return NextResponse.json({ messagesLeft: [], messagesRight: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const response: any = {
      messagesLeft: thread.model1Messages || [],
      messagesRight: thread.model2Messages || []
    };
    if (thread.model1Plan) response.planLeft = thread.model1Plan;
    if (thread.model2Plan) response.planRight = thread.model2Plan;

    logger.info('Returning history:', {
      leftCount: response.messagesLeft.length,
      rightCount: response.messagesRight.length
    });

    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    logger.error('Error in history endpoint:', error);

    return NextResponse.json({ messagesLeft: [], messagesRight: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
