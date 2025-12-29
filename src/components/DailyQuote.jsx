import { getTodaysQuote } from '../data/quotes';
import { Quote } from 'lucide-react';

export default function DailyQuote() {
  const quote = getTodaysQuote();

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div className="flex items-start gap-3">
        <Quote className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-gray-200 italic text-sm md:text-base leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}
