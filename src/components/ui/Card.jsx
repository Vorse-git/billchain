const Card = ({ title, description, link, image }) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-transform duration-400 ease-in-out hover:translate-x-2 flex items-center justify-between gap-4">
      {/* Text content */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <a
          className="inline-block mt-4 rounded-full border border-[#4416A8] bg-[#4416A8] p-3 text-white hover:bg-transparent hover:text-[#4416A8] focus:ring-3 focus:outline-hidden"
          href={link}
        >
          <span className="sr-only">{title}</span>
          <svg
            className="size-5 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>

      {/* Image on the right */}
      <img src={image} alt={title} className="w-16 h-16 md:w-20 md:h-20" />
    </div>
  );
};

export default Card;
