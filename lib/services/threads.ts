import 'server-only';
import { ObjectId, type UpdateFilter } from 'mongodb';
import { getDb } from '@/lib/mongo';
import type { ThreadDocument } from '@/types/chat';

export async function getThreadById(threadID: ObjectId): Promise<ThreadDocument | null> {
  const db = await getDb('arena');
  const threads = db.collection<ThreadDocument>('threads');
  const thread = await threads.findOne({ _id: threadID });

  return thread || null;
}

export async function saveThreadModels(
  threadID: ObjectId,
  modelIds: string[],
  userID: ObjectId,
  category: string = '一般對話',
  initialContext: { question: string; source: string; metadata?: Record<string, unknown> } = {
    question: '',
    source: 'unknown'
  }
) {
  const db = await getDb('arena');
  const threads = db.collection('threads');
  const now = new Date();

  await threads.updateOne(
    { _id: threadID },
    {
      $set: {
        selectedModels: modelIds,
        userID,
        createdAt: now,
        updatedAt: now,
        category,
        initialContext
      }
    },
    { upsert: true }
  );
}

export async function appendThreadMessage(
  threadID: ObjectId,
  modelId: string,
  message: { role: 'user' | 'assistant'; content: string },
) {
  const db = await getDb('arena');
  const threads = db.collection<ThreadDocument>('threads');
  const find = await threads.findOne({ _id: threadID });

  if (!find) {
    throw new Error('Thread not found');
  }

  const fieldName: 'model1Messages' | 'model2Messages' =
    modelId === find.selectedModels[0] ? 'model1Messages' : 'model2Messages';

  const update: UpdateFilter<ThreadDocument> = {
    $push: { [fieldName]: message } as unknown as Partial<Record<'model1Messages' | 'model2Messages', typeof message>>,
    $set: { updatedAt: new Date() }
  };

  await threads.updateOne({ _id: threadID }, update);
}

export async function saveThreadPlan(
  threadID: ObjectId,
  modelId: string,
  planText: string,
) {
  const db = await getDb('arena');
  const threads = db.collection<ThreadDocument>('threads');
  const find = await threads.findOne({ _id: threadID });

  if (!find) {
    throw new Error('Thread not found');
  }

  const fieldName: 'model1Plan' | 'model2Plan' =
    modelId === find.selectedModels[0] ? 'model1Plan' : 'model2Plan';

  await threads.updateOne(
    { _id: threadID },
    { $set: { [fieldName]: planText, updatedAt: new Date() } as any }
  );
}
