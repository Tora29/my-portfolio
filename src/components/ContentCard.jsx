import React from 'react'
import { Card, Image, Heading, Text } from './shared'

const ContentCard = ({ title, content, imageSrc }) => {
  return (
    <Card
      className="w-full max-w-[1000px] h-[300px] flex"
      padding={false}
      rounded="lg"
      overflow="hidden"
    >
      <div className="w-[250px] h-[300px] relative flex-shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          placeholder="https://placehold.co/250x300"
          rounded="l-lg"
        />
      </div>
      <div className="flex-1 p-8 relative">
        <Heading as="h3" size="large" className="mb-4">
          {title}
        </Heading>
        <Text size="lg" weight="light" className="leading-7">
          {content}
        </Text>
      </div>
    </Card>
  )
}

export default ContentCard
