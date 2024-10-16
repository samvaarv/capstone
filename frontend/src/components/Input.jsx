import { forwardRef } from "react";

const Input = forwardRef(({ label, type = "text", icon: Icon, options = [], ...props }, ref) => {
  return (
    <div className="relative mb-6">
      {label && <label className="block text-dark tracking-2 uppercase text-xs mb-2">{label}</label>}

      {/* Handling different input types */}
      {type === "textarea" ? (
        <textarea
          {...props}
          ref={ref}
          rows={6}
          className="w-full pl-3 pr-3 py-3 bg-white bg-opacity-50 border border-dark focus:border-primary text-dark placeholder-gray-500 transition duration-200"
        />
      ) : type === "select" ? (
        <select
          {...props}
          ref={ref}
          className="w-full pl-3 pr-3 py-2 bg-white bg-opacity-50 border border-dark focus:border-primary text-dark transition duration-200"
        >
          {/* Map through options for the select dropdown */}
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <div className="relative">
          <input
            {...props}
            ref={ref}
            type="file"
            accept="image/*"  // Only accept image file types
            className="w-full pl-3 pr-3 py-3 bg-white bg-opacity-50 border border-dark focus:border-primary text-dark placeholder-gray-500 transition duration-200 cursor-pointer"
          />
        </div>
      ) : type === "checkbox" || type === "radio" ? (
        <div className="flex items-center">
          <input
            {...props}
            ref={ref}
            type={type}
            className="form-checkbox h-4 w-4 text-primary transition duration-200"
          />
          {label && <span className="ml-2 text-dark">{label}</span>}
        </div>
      ) : (
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon className="w-5 h-5 text-dark" />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            type={type}
            className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-3 bg-white bg-opacity-50 border border-dark focus:border-primary text-sm text-dark placeholder-gray-500 h-12 transition duration-200`}
          />
        </div>
      )}
    </div>
  );
});

export default Input;
