import React from 'react';
import { Award, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function FeedbackBadge({ data }) {
  if (!data) return null;

  const { percentile, message, badge, totalCommunityReviews } = data;

  const getBadgeStyle = () => {
    switch (badge) {
      case 'excellent':
        return {
          bg: 'bg-neo-yellow',
          icon: <Award className="text-black" size={24} />,
        };
      case 'great':
        return {
          bg: 'bg-neo-blue',
          icon: <Sparkles className="text-black" size={24} />,
        };
      case 'good':
        return {
          bg: 'bg-neo-green',
          icon: <TrendingUp className="text-black" size={24} />,
        };
      default:
        return {
          bg: 'bg-neo-orange',
          icon: <AlertCircle className="text-black" size={24} />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className={`p-4 rounded-2xl border-[3px] border-black ${style.bg} mb-4 text-left shadow-brutal`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white border-2 border-black shadow-brutal-sm">{style.icon}</div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Topluluk Kıyaslaması
            </span>
            {percentile !== undefined && (
              <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-black text-white border border-black shadow-brutal-sm">
                Top %{100 - percentile}
              </span>
            )}
          </div>

          <p className="text-sm font-extrabold text-black leading-snug">{message}</p>

          {false && (
            <p className="text-[11px] font-bold text-slate-800 mt-2">
              📊 {totalCommunityReviews.toLocaleString()} kullanıcı yorumu verisiyle hesaplandı
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
