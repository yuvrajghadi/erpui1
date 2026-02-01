'use client';
import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { motion } from 'framer-motion';
import Image from 'next/image';

const { Title } = Typography;

// Example client data with local images
const clients = [
  { name: "Google", logo: "/assets/img/clients/google.png" },
  { name: "Microsoft", logo: "/assets/img/clients/microsoft.png" },
  { name: "Amazon", logo: "/assets/img/clients/amazon.png" },
  { name: "Apple", logo: "/assets/img/clients/amazon.png" },
  { name: "Netflix", logo: "/assets/img/clients/netflix.png" },
  { name: "Slack", logo: "/assets/img/clients/slack.png" },
  { name: "Airbnb", logo: "/assets/img/clients/airbnb.png" },
  { name: "Uber", logo: "/assets/img/clients/slack.png" },
  { name: "Spotify", logo: "/assets/img/clients/spotify.png" },
  { name: "Tesla", logo: "/assets/img/clients/airbnb.png" },
  { name: "Salesforce", logo: "/assets/img/clients/salesforce.png" },
  { name: "Shopify", logo: "/assets/img/clients/shopify.png" },
];

// Different color palettes for border animation
const borderColors = [
  ["#1677ff", "#22d3ee", "#a21caf", "#1677ff"],
  ["#ff9800", "#f43f5e", "#22d3ee", "#ff9800"],
  ["#22d3ee", "#a21caf", "#f59e42", "#22d3ee"],
  ["#a21caf", "#1677ff", "#22d3ee", "#a21caf"],
  ["#f43f5e", "#ff9800", "#22d3ee", "#f43f5e"],
  ["#f59e42", "#22d3ee", "#a21caf", "#f59e42"],
  ["#22d3ee", "#1677ff", "#f43f5e", "#22d3ee"],
  ["#a21caf", "#f59e42", "#1677ff", "#a21caf"],
  ["#1677ff", "#f43f5e", "#22d3ee", "#1677ff"],
  ["#ff9800", "#a21caf", "#22d3ee", "#ff9800"],
  ["#22d3ee", "#f59e42", "#a21caf", "#22d3ee"],
  ["#f43f5e", "#22d3ee", "#1677ff", "#f43f5e"],
];

// Duplicate for infinite effect
const marqueeClients = [...clients, ...clients];

export default function OurClientsSection() {
  return (
    <section
      className="py-5"
      style={{
        // background:
        //   "radial-gradient(circle at 50% 0%, #23272f 60%, #101014 100%)",
        minHeight: "480px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Optional: Animated orb for extra depth */}
      <motion.div
        className="position-absolute"
        style={{
          left: -120, top: -120, width: 320, height: 320,
          borderRadius: "50%",
          // background:
          //   "radial-gradient(circle at 20% 40%, #1677ff33 0%, transparent 60%)," +
          //   "radial-gradient(circle at 80% 20%, #ff980033 0%, transparent 70%)",
          filter: "blur(48px)", zIndex: 0
        }}
        animate={{ y: [0, 30, -20, 0], x: [0, 20, -10, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />
      <div className="container-xl position-relative" style={{ zIndex: 1 }}>
        <Row gutter={0} align="middle">
          {/* Left Side: Headline and CTA */}
          <Col xs={24} md={10} className="mb-4 mb-md-0">
            <div className="p-4 h-100 d-flex flex-column justify-content-center">
              <h2 className="display-5 fw-bold text-white mb-3">
                All Clients, One Platform
              </h2>
              <p className="lead text-secondary mb-4">
                Trusted by global leaders. Experience seamless integration and support for every business size.
              </p>
              <motion.a
                href="#"
                className="rounded-pill px-4 py-2 fw-semibold text-white d-inline-block mt-2"
                style={{
                  background: "linear-gradient(90deg, #22d3ee 0%, #1677ff 100%)",
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 16px #1677ff33",
                  border: "none",
                  width: 'fit-content'
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{
                  scale: 1.07,
                  background: "linear-gradient(90deg, #1677ff 0%, #22d3ee 100%)",
                  boxShadow: "0 8px 32px #22d3ee88, 0 2px 16px #1677ff33"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              >
                Become a client &rarr;
              </motion.a>
            </div>
          </Col>
          {/* Right Side: Animated, horizontally scrolling client pills */}
          <Col xs={24} md={14}>
            <div
              className="position-relative w-100"
              style={{
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {/* Infinite marquee animation */}
              <motion.div
                className="d-flex gap-3"
                style={{
                  width: "max-content",
                  willChange: "transform",
                }}
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  duration: 22,
                }}
              >
                {marqueeClients.map((client, idx) => {
                  // Pick a color palette for each client
                  const palette = borderColors[idx % borderColors.length];
                  return (
                    <motion.div
                      key={client.name + idx}
                      className="d-flex align-items-center px-4 py-2 rounded-pill shadow"
                      style={{
                        background: "rgba(30,34,54,0.92)",
                        boxShadow: "0 2px 16px rgba(36,180,255,0.08)",
                        minWidth: 170,
                        marginRight: 18,
                        border: "3px solid",
                        borderColor: palette[0],
                        cursor: "pointer",
                        gap: 12,
                        transition: "box-shadow 0.2s, background 0.2s"
                      }}
                      animate={{
                        borderColor: palette,
                      }}
                      transition={{
                        borderColor: {
                          duration: 8,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear",
                        },
                      }}
                      whileHover={{
                        scale: 1.11,
                        boxShadow: "0 8px 32px #22d3ee88, 0 2px 16px #1677ff33",
                        backgroundColor: "rgba(36,180,255,0.22)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={24}
                        height={24}
                        style={{
                          width: '24px',
                          height: '24px',
                          objectFit: 'contain',
                          filter: 'brightness(0) invert(1)',
                          opacity: 0.9
                        }}
                        loading="lazy"
                      />
                      <span className="fw-semibold text-white" style={{ fontSize: "1rem", letterSpacing: 0.2 }}>
                        {client.name}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
