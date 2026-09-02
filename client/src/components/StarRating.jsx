// client/src/components/StarRating.jsx
// Visual star rating component using lucide-react icons.
// Props: rating (number 1-5), onChange (optional for interactive mode), readOnly (bool, default true).

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onChange, readOnly = true }) {
  const [hover, setHover] = useState(0);
  const effectiveRating = hover || rating;

  const handleClick = (value) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-0.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={`cursor-${readOnly ? 'default' : 'pointer'} transition-colors
            ${star <= effectiveRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          `}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => handleClick(star)}
          aria-checked={star === rating}
          role={readOnly ? undefined : 'radio'}
        />
      ))}
    </div>
  );
}
