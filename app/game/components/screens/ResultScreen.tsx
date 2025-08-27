'use client';

import { useGame } from '../../context/GameContext';

export default function ResultScreen() {
  const { state, resetGame } = useGame();
  const { result } = state;

  if (!result) {
    return <div>載入中...</div>;
  }

  const handleDownload = () => {
    const content = `# ${result.title}

${result.content}

關鍵字：${result.keywords.join(', ')}

生成時間：${new Date(result.timestamp).toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: result.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${result.title}

${result.content}`);
      alert('內容已複製到剪貼板');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            穿越完成！
          </h1>
          <p className="text-lg text-gray-600">
            您的時光穿越體驗已生成
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {result.title}
          </h2>

          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">
              {result.content}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              穿越關鍵字
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            感謝您的時光穿越體驗，希望您喜歡這趟旅程！
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            再玩一次
          </button>

          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            下載結果
          </button>

          <button
            onClick={handleShare}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            分享結果
          </button>
        </div>
      </div>
    </div>
  );
}