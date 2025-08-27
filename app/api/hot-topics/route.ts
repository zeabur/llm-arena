import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 熱門問題的數據類型
export interface HotTopic {
  id: string;
  title: string;
  views: number;
  days: number;
  category?: string;
}

// TODO: 替換為真實 API 調用
// 這是占位符數據，之後會從後端 API 獲取真實的熱門問題數據
const mockHotTopics: HotTopic[] = [
  {
    id: '1',
    title: '台灣的夜市文化有什麼特色？',
    views: 1234,
    days: 2,
    category: '文化'
  },
  {
    id: '2',
    title: '如何看待台灣的民主發展歷程？',
    views: 987,
    days: 3,
    category: '政治'
  },
  {
    id: '3',
    title: '台灣科技產業的優勢在哪裡？',
    views: 856,
    days: 1,
    category: '科技'
  },
  {
    id: '4',
    title: '台灣教育制度需要哪些改革？',
    views: 743,
    days: 4,
    category: '教育'
  },
  {
    id: '5',
    title: '台灣的環保政策效果如何？',
    views: 692,
    days: 5,
    category: '環境'
  },
  {
    id: '6',
    title: '台灣原住民文化的保存現況？',
    views: 634,
    days: 3,
    category: '文化'
  },
  {
    id: '7',
    title: '台灣醫療體系的優缺點分析？',
    views: 578,
    days: 6,
    category: '醫療'
  },
  {
    id: '8',
    title: '台灣年輕人面臨的就業挑戰？',
    views: 521,
    days: 2,
    category: '社會'
  },
  {
    id: '9',
    title: '台灣的觀光產業發展策略',
    views: 467,
    days: 7,
    category: '觀光'
  },
  {
    id: '10',
    title: '台灣在國際上的角色定位？',
    views: 412,
    days: 4,
    category: '國際'
  }
];

export async function GET(request: NextRequest) {
  try {
    // 解析查詢參數
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    // TODO: 替換為真實 API 調用
    // 例如：const topics = await fetchHotTopicsFromDatabase({ limit, category });
    let topics = [...mockHotTopics];

    // 按分類篩選（占位符邏輯）
    if (category) {
      topics = topics.filter(topic => topic.category === category);
    }

    // 限制返回數量
    topics = topics.slice(0, limit);

    return NextResponse.json({ success: true, data: topics, total: topics.length }, { headers: { 'Cache-Control': 'no-store' } });

  } catch {
    // 以 API 回應為主，避免額外 console 噪音

    return NextResponse.json({ success: false, error: '獲取熱門問題失敗' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
