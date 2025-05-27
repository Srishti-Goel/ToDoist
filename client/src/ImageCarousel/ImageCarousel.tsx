import { useState, useEffect } from 'react';
import axios from 'axios';
import './../css/ImageCarousel.css';
import UserNeeded from '../UserNeeded';
import { useUser } from '../UserContext';

interface ImageCarouselProps {
  hobby: string;
  startIndex?: number;
  onClose?: () => void;
}

const defaultImages = [
  `https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=300`,
  `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=300`,
  `https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=300`,
  `https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300`,
];

function ImageCarousel({ hobby, startIndex = 0, onClose }: ImageCarouselProps) {
  const [index, setIndex] = useState(startIndex);
  const [images, setImages] = useState<string[]>(defaultImages);
  const { user } = useUser(); // Assuming useUser is a custom hook to get user data
  if (!user) {
    console.error("User data is not available. Please ensure you are logged in.");
    return <UserNeeded />;
  }
  useEffect(() => {
    axios.get('http://localhost:3000/hobbies/inspiration-images', {
      params: { userEmail: user?.email, hobbyName: hobby },  })
      .then((response) => {
        const fetchedImages = response.data || [];
        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
        } else {
          setImages(defaultImages); // Fallback to default images if none are fetched
        }
        setIndex(startIndex); // Reset index to startIndex when images are fetched
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setImages(defaultImages); // Fallback to default images on error
      });
  }, [user]); // Re-fetch when hobby or user changes

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };
const addImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();

  if (!user) {
    console.error("User data is not available. Please ensure you are logged in.");
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/hobbies', {
      params: { userEmail: user.email }
    });

    const hobbies = response.data || [];
    const foundHobby = hobbies.find((h: any) => h.name === hobby);

    if (!foundHobby) {
      console.error("Hobby not found:", hobby);
      return;
    }

    const newImage = prompt("Enter the image URL:");
    if (newImage) {
      await axios.post('http://localhost:3000/hobbies/add-image', {
        userEmail: user.email,
        name: foundHobby.name,
        color: foundHobby.color,
        inspirationImages: foundHobby.inspirationImages,
        mainImage: foundHobby.mainImage,
        newImage: newImage,
      });

      setImages((prevImages) => [...prevImages, newImage]);
      setIndex(images.length); // Make sure images is up-to-date
    }
  } catch (error) {
    console.error("Error processing image addition:", error);
  }
};


  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide full-width-carousel"
      data-ride="carousel"
    >
        <button
          className="carousel-close-btn"
          onClick={addImage}
          aria-label="Add Image"
        >
          <span className="carousel-add-icon">+</span>
          <span className="carousel-add-text">Add Image</span>
        </button>
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