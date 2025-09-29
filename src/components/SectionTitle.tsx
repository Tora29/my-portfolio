interface SectionTitleProps {
  title: string
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="w-80 mx-auto mb-12">
      <h2 className="text-center text-[rgb(199,195,187)] text-4xl font-medium font-['Rubik'] leading-tight mb-3">
        {title}
      </h2>
      <div className="w-48 h-0 mx-auto border border-[rgb(199,195,187)]"></div>
    </div>
  )
}

export default SectionTitle
