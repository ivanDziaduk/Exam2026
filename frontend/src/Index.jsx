import Header from "./components/Header.jsx";
import { useState, useEffect } from 'react';
import './Slider.css';

import img1 from './assets/image1.jpg';
import img2 from './assets/image2.jpg';
import img3 from './assets/image3.jpg';
import img4 from './assets/image4.jpg';

export default function Index() {
const [currentSlide, setCurrentSlide] = useState(0);
const slides = [img1, img2, img3, img4];

useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
}, [slides.length]);

const goToSlide = (index) => {
    setCurrentSlide(index);
};

const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
};

const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
};

return (
    <>
        <Header />
        <div className="slider-container">
            <div className="slider-wrapper">
                <div 
                    className="slider-track" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((img, index) => (
                        <div key={index} className="slide">
                            <img src={img} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <button className="slider-btn prev" onClick={prevSlide}>
                &#10094;
            </button>
            <button className="slider-btn next" onClick={nextSlide}>
                &#10095;
            </button>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    </>
);
}