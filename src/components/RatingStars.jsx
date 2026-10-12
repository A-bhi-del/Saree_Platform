import React from "react";

/**
 * RatingStars component - Display or input star ratings
 * @param {number} rating - Current rating value (0-5)
 * @param {number} maxRating - Maximum rating (default: 5)
 * @param {boolean} interactive - Whether stars are clickable
 * @param {Function} onChange - Callback when rating changes
 * @param {string} size - Size variant: "sm", "md", "lg"
 * @param {boolean} showValue - Whether to show numeric value
 */
const RatingStars = ({
  rating = 0,
  maxRating = 5,
  interactive = false,
  onChange,
  size = "md",
  showValue = false,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartial = starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`
                ${sizeClasses[size]} 
                ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
                ${!interactive && "pointer-events-none"}
                focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded
              `}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              {isFilled ? (
                <span className="text-yellow-400">★</span>
              ) : isPartial ? (
                <span className="relative inline-block">
                  <span className="text-gray-300">★</span>
                  <span
                    className="absolute left-0 top-0 overflow-hidden text-yellow-400"
                    style={{ width: `${(displayRating % 1) * 100}%` }}
                  >
                    ★
                  </span>
                </span>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
