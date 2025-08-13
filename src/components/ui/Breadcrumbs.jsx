const Breadcrumbs = ({ breadcrumbs }) => {
    return (
      <div className="flex items-center space-x-1 text-sm py-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <span
            key={index}
            className={`${
              index === breadcrumbs.length - 1
                ? "text-[#4416A8] font-medium" 
                : "text-gray-500 font-light"
            }`}
          >
            {breadcrumb.label}
            {index < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </div>
    );
  };
  
  export default Breadcrumbs;
  
  