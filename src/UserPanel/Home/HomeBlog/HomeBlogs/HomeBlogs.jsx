import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Title from "../../../../Components/Title/Title";
import HomeBlog from "../HomeBlog/HomeBlog";
import "./HomeBlogs.css";
import {Navigation, Autoplay} from "swiper/modules";
import {FaArrowRight} from "react-icons/fa";
import {FaArrowLeft} from "react-icons/fa";

const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("homeBlog.JSON")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <div className="homeBlogContainer">
      <Title title="Recently On the" title2="Blog" />

      <div className="blogCarouselWrapper container">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={50}
          slidesPerView={3}
          slidesPerGroup={1}
          // autoplay={{
          //   delay: 2000, // 3 seconds
          //   disableOnInteraction: false, // keeps autoplay after user interaction
          // }}
          navigation={{
            nextEl: ".blog-next",
            prevEl: ".blog-prev",
          }}
          loop={true}
          breakpoints={{
            1024: {slidesPerView: 3},
            768: {slidesPerView: 2},
            0: {slidesPerView: 1},
          }}>
          {blogs
            .sort((a, b) => a.serial - b.serial)
            .map((blog) => (
              <SwiperSlide key={blog.id}>
                <HomeBlog blog={blog} />
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Arrows */}
        <button className="blog-prev blog-arrow">
          <FaArrowLeft />
        </button>
        <button className="blog-next blog-arrow">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default HomeBlogs;
