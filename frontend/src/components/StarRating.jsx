import { useState } from 'react';
import './StarRating.css';

export default function StarRating({ onRate, currentRating = 0, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" role="group" aria-label={readonly ? `Įvertinimas: ${currentRating} iš 5` : 'Įvertinkite filmą'}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= (hover || currentRating) ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          role={readonly ? 'img' : 'button'}
          tabIndex={readonly ? undefined : 0}
          aria-label={`${star} žvaigždutė${star > 1 ? 's' : ''}`}
          onKeyDown={(e) => {
            if (!readonly && (e.key === 'Enter' || e.key === ' ') && onRate) {
              e.preventDefault();
              onRate(star);
            }
          }}
        >
          ★
        </span>
      ))}
      {currentRating > 0 && (
        <span className="rating-value" aria-hidden="true">{Number(currentRating).toFixed(1)}</span>
      )}
    </div>
  );
}
