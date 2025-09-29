import { Card, Image, Heading, Text } from './shared'

interface ContentCardProps {
  title: string
  content: string
  imageSrc: string
  imagePosition?: string
}

const ContentCard = ({
  title,
  content,
  imageSrc,
  imagePosition,
}: ContentCardProps) => {
  return (
    <Card
      className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] h-auto lg:h-[300px] flex flex-col lg:flex-row"
      padding={false}
      rounded="lg"
      overflow="hidden"
    >
      <div className="w-full lg:w-[250px] h-[200px] lg:h-[300px] relative flex-shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          placeholder="https://placehold.co/250x300"
          className={`w-full h-full object-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg ${imagePosition || ''}`}
        />
      </div>
      <div className="flex-1 p-4 sm:p-6 md:p-8 relative">
        <Heading
          as="h3"
          size="large"
          className="mb-2 md:mb-4 text-xl sm:text-2xl md:text-3xl"
        >
          {title}
        </Heading>
        <Text
          size="lg"
          weight="light"
          className="leading-6 sm:leading-7 text-sm sm:text-base md:text-lg"
        >
          {content}
        </Text>
      </div>
    </Card>
  )
}

export default ContentCard
