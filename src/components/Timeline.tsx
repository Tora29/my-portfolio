import { Calendar } from 'lucide-react'
import { Heading, Text } from './shared'
import { TimelineItem } from '../config/constants'

interface TimelineProps {
  items: TimelineItem[]
}

/**
 * タイムラインコンポーネント
 * 時系列のイベントやマイルストーンを縦型のタイムライン形式で表示する
 *
 * @param {TimelineProps} props - コンポーネントのプロパティ
 * @param {TimelineItem[]} props.items - 表示するタイムラインアイテムの配列
 * @returns {JSX.Element} タイムラインを含むReactコンポーネント
 */
const Timeline = ({ items }: TimelineProps) => {
  /**
   * タイムラインアイテムのタイプに応じた色を取得する
   *
   * @param {string} [type] - タイムラインアイテムのタイプ（education, work, project等）
   * @returns {string} Tailwind CSSの背景色クラス
   */
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'education':
        return 'bg-blue-500'
      case 'work':
        return 'bg-green-500'
      case 'project':
        return 'bg-purple-500'
      default:
        return 'bg-[rgb(108,95,62)]'
    }
  }

  return (
    <div className="relative">
      {/* タイムラインの縦線 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[rgb(108,95,62)] via-[rgb(108,95,62)]/50 to-transparent" />

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, index) => (
          <div key={index} className="relative pl-12 sm:pl-16">
            {/* タイムラインドット */}
            <div
              className={`absolute left-2 top-1 w-5 h-5 rounded-full ${getTypeColor(item.type)} ring-4 ring-[rgb(23,24,32)] shadow-lg`}
            />

            {/* コンテンツカード */}
            <div className="bg-gradient-to-br from-[rgb(23,24,32)] to-[rgb(18,19,27)] p-4 sm:p-6 rounded-lg border border-[rgb(108,95,62)]/20 hover:border-[rgb(108,95,62)]/40 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(108,95,62,0.2)]">
              {/* 日付 */}
              <div className="flex items-center gap-2 mb-2 text-[rgb(199,195,187)]">
                <Calendar className="w-4 h-4" />
                <Text size="sm" weight="light" className="text-sm">
                  {item.date}
                </Text>
              </div>

              {/* タイトル */}
              <Heading
                as="h3"
                size="large"
                className="mb-2 text-lg sm:text-xl text-white"
              >
                {item.title}
              </Heading>

              {/* 説明 */}
              <Text
                size="base"
                weight="light"
                className="text-[rgb(199,195,187)] leading-6 sm:leading-7 whitespace-pre-line"
              >
                {item.description}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
