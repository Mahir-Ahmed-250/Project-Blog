import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {Navigation, Autoplay} from "swiper/modules";
import {FaArrowRight, FaArrowLeft} from "react-icons/fa";
import Title from "../../../../Components/Title/Title";
import HomeBlog from "../HomeBlog/HomeBlog";
import "./HomeBlogs.css";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import {db} from "../../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../../../Assets/Loading2.json";

const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const collections = [
          {name: "everydaylifestyle", type: "everyday-lifestyle"},
          {name: "healthandwellness", type: "health-and-wellness"},
          {
            name: "eventandsuccessfulpeople",
            type: "event-and-successful-people",
          },
        ];

        let allBlogs = [];

        for (const col of collections) {
          const q = query(collection(db, col.name), orderBy("serial", "asc"));
          const snapshot = await getDocs(q);
          const blogsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            type: col.type,
            ...doc.data(),
          }));
          allBlogs = [...allBlogs, ...blogsData];
        }

        allBlogs.sort((a, b) => a.serial - b.serial);
        setBlogs(allBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Title title="Recently On the" title2="Blog" />
        <Player
          autoplay
          loop
          src={animationData}
          style={{width: "100%", maxWidth: "400px", margin: "0 auto"}}
        />
      </div>
    );
  }

  if (!blogs.length) {
    return <p className="text-center mt-5">No blogs found.</p>;
  }

  return (
    <div className="homeBlogContainer">
      <Title title="Recently On the" title2="Blog" />

      <div className="blogCarouselWrapper container">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={50}
          slidesPerView={3}
          slidesPerGroup={1}
          autoplay
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
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <HomeBlog blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
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
