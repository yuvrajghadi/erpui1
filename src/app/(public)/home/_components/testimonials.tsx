'use client';
import React, { useRef, useEffect } from "react";
import { Rate, Avatar } from "antd";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ikta Sollork",
    role: "PARAL CEO",
    text: "Working with this process was effortless. The vision was understood perfectly, and the designs truly represent my brand.",
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Liloch",
    role: "AIO Founder",
    text: "Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Diane swag",
    role: "Swag Studio",
    text: "A game-changing experience! The design process was smooth, collaborative, and resulted in a brand presence we're proud of.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    name: "Will Smith",
    role: "Harper Education",
    text: "The designs exceeded our expectations! Every element felt purposeful, creating a seamless and visually stunning brand identity.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  {
    name: "Priya Patel",
    role: "Lead Designer",
    text: "The attention to detail and creativity was outstanding. Our brand has never looked better.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
  },
  {
    name: "Alex Kim",
    role: "Consultant",
    text: "Professional, timely, and highly creative. The process was smooth from start to finish.",
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    name: "Sara Lee",
    role: "Marketer",
    text: "The new website design boosted our engagement and conversions. Highly recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/51.jpg",
  },
  {
    name: "John Smith",
    role: "CEO",
    text: "Ut enim ad minim veniam, quis nostrud exercitation. The best design partner we've had.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    social: { type: "twitter", url: "https://twitter.com" },
  },
  {
    name: "Linda Anand",
    role: "Doctor",
    text: "Abore et dolore magna aliqua. The design was both beautiful and functional.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David Gueta",
    role: "Artist",
    text: "Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Loved the result!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export default function TestimonialsSection() {
  // Card height and gap
  const cardHeight = 220;
  const cardGap = 32;
  const containerHeight = 500; // Adjust as needed

  const scrollRef = useRef<HTMLDivElement | null>(null);;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const totalScroll =
      (testimonials.length - 1) * (cardHeight + cardGap); // minus 1 for sticky card
    let current = 0;

    const interval = setInterval(() => {
      current += cardHeight + cardGap;
      if (current > totalScroll) {
        current = 0; // Loop back to top
      }
      container.scrollTo({
        top: current,
        behavior: "smooth",
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonials-section py-5">
      <div className="container">
        <div className="row flex-lg-row flex-column align-items-start">
          {/* Left Summary */}
          <div className="col-lg-5 mb-5 mb-lg-0">
            <div className="summary-box">
              <span className="badge bg-dark px-3 py-2 mb-3" style={{ fontSize: 16, borderRadius: 16 }}>
                <span style={{ marginRight: 8, fontSize: 14 }}>◎</span> Happy Clients
              </span>
              <h1 className="fw-bold mb-2" style={{ fontSize: 48, color: "#fff" }}>
                Clients <span style={{ color: "#b0b8c6", fontWeight: 400 }}>Love me</span>
              </h1>
              <p className="text-secondary mb-4" style={{ fontSize: 18 }}>
                Trusted by 100+ happy clients, adding ₹250M+ in revenue.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center justify-content-lg-start">
                <div className="stat-card">
                  <div className="stat-value">100+</div>
                  <div className="stat-label">Happy clients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">₹250m</div>
                  <div className="stat-label">revenue added</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">4.8</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <motion.button
                  className="btn btn-dark px-4 py-2 fw-bold shadow-sm"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  See All Projects
                </motion.button>
                <motion.button
                  className="btn btn-light px-4 py-2 fw-bold shadow-sm"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Contact Now
                </motion.button>
              </div>
            </div>
          </div>
          {/* Right Sticky Stack Scroll - auto-scrolls, all breakpoints */}
          <div className="col-lg-7">
            <div
              ref={scrollRef}
              className="sticky-stack-list"
              style={{
                position: "relative",
                height: containerHeight,
                overflowY: "auto",
                // paddingBlock: 25,
                scrollBehavior: "smooth",
              }}
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.name + idx}
                  initial={{ opacity: 0, y: 60, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    stiffness: 120,
                    delay: idx * 0.08,
                  }}
                  className="sticky-card"
                  style={{
                    position: idx === 0 ? "sticky" : "static",
                    // top: idx === 0 ? 0 : undefined,
                    zIndex: testimonials.length - idx,
                    marginBottom: cardGap,
                    minHeight: cardHeight,
                    background: "#18181b",
                    borderRadius: 24,
                    boxShadow: "0 2px 24px #00000033, 0 8px 32px #1677ff22",
                    padding: "32px 32px 28px 32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    maxWidth: 520,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div className="d-flex align-items-center mb-3" style={{ gap: 18 }}>
                    <Avatar src={t.avatar} size={64} style={{ border: "3px solid #fff" }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#fff", fontSize: 22 }}>{t.name}</h5>
                      <div style={{ color: "#b0b8c6", fontWeight: 500, fontSize: 17 }}>{t.role}</div>
                    </div>
                  </div>
                  <hr style={{ borderColor: "#232323", width: "100%", margin: "0 0 12px 0" }} />
                  <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
                    <span style={{ color: "#fff", fontWeight: 500, fontSize: 17 }}>{t.rating.toFixed(1)}</span>
                    <Rate disabled allowHalf defaultValue={t.rating} style={{ color: "#facc15", fontSize: 18 }} />
                  </div>
                  <p className="mb-0" style={{ color: "#b0b8c6", fontSize: 16, lineHeight: 1.6 }}>
                    {t.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .summary-box {
          background: transparent;
        }
        .stat-card {
          background: #18181b;
          border-radius: 18px;
          box-shadow: 0 2px 24px #00000033;
          padding: 24px 32px;
          min-width: 140px;
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
        }
        .stat-label {
          color: #b0b8c6;
          font-size: 1rem;
          margin-top: 6px;
        }
        @media (max-width: 991px) {
          .summary-box {
            margin-bottom: 32px;
          }
        }
        @media (max-width: 767px) {
          .sticky-card {
            padding: 18px 8px 18px 8px !important;
            max-width: 100% !important;
          }
          .stat-card {
            min-width: 90px;
            padding: 12px 4px;
          }
          .summary-box h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
