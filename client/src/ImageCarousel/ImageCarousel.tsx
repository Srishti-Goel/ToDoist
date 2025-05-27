import { useState } from 'react';
import './../css/ImageCarousel.css';

interface ImageCarouselProps {
  hobby: string;
  startIndex?: number;
  onClose?: () => void; // Add optional onClose prop
}

function ImageCarousel({ hobby, startIndex = 0, onClose }: ImageCarouselProps) {
  const [index, setIndex] = useState(startIndex);

  // TODO: Add an API call here to fetch the images based on the hobbies
  void(hobby); // This is just to avoid unused variable warning, remove when API call is added
  const images = [
    `https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=300`,
    `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=300`,
    `https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=300`,
    `https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300`,
  ];

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  }

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide full-width-carousel"
      data-ride="carousel"
    >
        <button
          className="carousel-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
      <ol className="carousel-indicators">
        {images.map((_, i) => (
          <li
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => handleSelect(i)}
            style={{ cursor: "pointer" }}
          ></li>
        ))}
      </ol>
      <div className="carousel-inner">
        {images.map((img, i) => (
          <div key={i} className={`carousel-item${i === index ? " active" : ""}`}>
            <img className="d-block w-100 carousel-img" src={img} alt={`Slide ${i + 1}`} />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        onClick={() => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        onClick={() => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default ImageCarousel;