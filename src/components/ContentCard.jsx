import React from 'react'

const ContentCard = ({ title, content, imageSrc }) => {
  return (
    <div className="w-full max-w-[1000px] h-[300px] bg-[rgb(108,95,62)] rounded-lg overflow-hidden flex">
      <div className="w-[250px] h-[300px] relative flex-shrink-0">
        <img
          src={imageSrc || 'https://placehold.co/250x300'}
          alt={title}
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      <div className="flex-1 p-8 relative">
        <h3 className="text-[rgb(199,195,187)] text-3xl font-normal font-['Rubik'] leading-tight mb-4">
          {title}
        </h3>
        <div className="text-[rgb(199,195,187)] text-lg font-light font-['Rubik'] leading-7">
          {content}
        </div>
      </div>
    </div>
  )
}

export default ContentCard
