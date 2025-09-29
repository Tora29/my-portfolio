import React from 'react'

const SectionCard = ({ title, onClick }) => {
  return (
    <div
      className="relative w-[380px] h-60 rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(12,13,21)] via-[rgb(23,24,32)] to-[rgb(108,95,62)]/30 rounded-lg"></div>
      <div className="absolute inset-0 bg-black/50 rounded-lg group-hover:bg-black/40 transition-colors"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-[rgb(199,195,187)] text-3xl font-semibold font-['Rubik'] leading-tight">
          {title}
        </h3>
      </div>
    </div>
  )
}

export default SectionCard
