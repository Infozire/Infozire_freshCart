import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./carousel.css";

export default function HeroCarousel() {
  return (
    <div className="carousel-container">
 <Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 3000, disableOnInteraction: false }}
  pagination={{ clickable: true }}
  loop={true}
  spaceBetween={10}
>

        {/* SLIDE 1 */}
        <SwiperSlide>
          <div className="slide slide1">
            <div className="slide-content">
              {/* <h2>Bulk Vegetables for Events</h2>
              <p>Fresh farm products at wholesale price</p> */}
              <button>Shop Now</button>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 2 */}
        <SwiperSlide>
          <div className="slide slide2">
            <div className="slide-content">
              {/* <h2>Wedding & Catering Supplies</h2>
              <p>Everything you need in one place</p> */}
              <button>Explore</button>
            </div>
          </div>
        </SwiperSlide>

        {/* SLIDE 3 */}
        <SwiperSlide>
          <div className="slide slide3">
            <div className="slide-content">
              {/* <h2>Bulk Groceries Deals</h2>
              <p>Save more when you buy more</p> */}
              <button>Browse</button>
            </div>
          </div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
}
