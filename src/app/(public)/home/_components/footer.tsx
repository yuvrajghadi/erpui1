'use client';
import { motion } from "framer-motion";
import { Button, Row, Col } from "antd";
import {
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

// Footer navigation data
const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "#demo" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "Status", href: "#status" },
    ],
  },
];

const socials = [
  { label: "Twitter", href: "https://twitter.com", icon: <TwitterOutlined /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinOutlined /> },
  { label: "GitHub", href: "https://github.com", icon: <GithubOutlined /> },
  { label: "Facebook", href: "https://facebook.com", icon: <FacebookOutlined /> },
  { label: "Instagram", href: "https://instagram.com", icon: <InstagramOutlined /> },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        // background: "linear-gradient(120deg, #101014 0%, #181c22 60%, #23243a 100%)",
        color: "#e0e7ef",
        overflow: "hidden",
        padding: "64px 0 24px 0",
      }}
    >
      {/* Animated background orbs */}
      <motion.div
        style={{
          position: "absolute",
          left: -80,
          top: -100,
          width: 220,
          height: 220,
          borderRadius: "50%",
          // background: "rgba(59,130,246,0.16)",
          filter: "blur(64px)",
          zIndex: 0,
        }}
        animate={{ y: [0, 30, -20, 0], x: [0, 20, -10, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          right: -80,
          bottom: -90,
          width: 260,
          height: 260,
          borderRadius: "50%",
          // background: "rgba(59,130,246,0.14)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
        animate={{ y: [0, -30, 20, 0], x: [0, -20, 10, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />

      {/* Call to Action */}
      {/* <motion.div
        className="container"
        style={{
          background: "linear-gradient(90deg, #23243a 0%, #181c22 100%)",
          borderRadius: 20,
          boxShadow: "0 4px 32px #1677ff22",
          padding: "32px 24px",
          marginBottom: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          Ready to streamline your business?
        </div>
        <motion.a
          href="#demo"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: 30,
            background: "linear-gradient(90deg,#1677ff,#3b82f6 80%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 16px #1677ff33",
            marginTop: 8,
            textDecoration: "none",
          }}
          whileHover={{ scale: 1.08, boxShadow: "0 8px 32px #3b82f6bb" }}
          whileTap={{ scale: 0.97 }}
        >
          Request a Demo
        </motion.a>
      </motion.div> */}

      {/* Main Footer Grid */}
      <div className="container">
        <Row gutter={[32, 32]} justify="center" align="top">
          {/* Brand & Social */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1677ff 0%,#3b82f6 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 26,
                  marginRight: 10,
                  boxShadow: "0 2px 12px #1677ff44",
                }}
              >
                E
              </span>
              <span style={{ fontWeight: 700, fontSize: 22 }}>ERP SaaS</span>
            </div>
            <p style={{ color: "#a3aed6", fontSize: 14, marginBottom: 18 }}>
              Powerful cloud ERP for modern businesses. Automate, analyze, and grow-all in one platform.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#23243a",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                  whileHover={{ scale: 1.13, backgroundColor: "#1677ff" }}
                  whileTap={{ scale: 0.93 }}
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </Col>
          {/* Footer Columns */}
          {footerLinks.map((section, idx) => (
            <Col xs={12} sm={12} md={8} lg={3} key={section.title}>
              <div style={{ fontWeight: 600, color: "#a3aed6", marginBottom: 10 }}>{section.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.links.map(link => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 6, color: "#1677ff" }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    style={{ marginBottom: 8, fontSize: 15 }}
                  >
                    <a
                      href={link.href}
                      style={{
                        color: "#e0e7ef",
                        textDecoration: "none",
                        transition: "color 0.16s",
                      }}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </Col>
          ))}
          {/* Newsletter */}
          <Col xs={12} sm={12} md={8} lg={6}>
            <div style={{ fontWeight: 600, color: "#a3aed6", marginBottom: 10 }}>Stay Updated</div>
            <form
              style={{ display: "flex", gap: 8, marginBottom: 8 }}
              onSubmit={e => {
                e.preventDefault();
                // handle subscribe
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 24,
                  border: "1px solid #23243a",
                  background: "#181c22",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  marginRight: 6,
                }}
              />
              <motion.button
                type="submit"
                style={{
                  padding: "10px 22px",
                  borderRadius: 24,
                  background: "linear-gradient(90deg,#1677ff,#3b82f6 80%)",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                Subscribe
              </motion.button>
            </form>
            <span style={{ color: "#a3aed6", fontSize: 12 }}>
              No spam. Unsubscribe any time.
            </span>
          </Col>
        </Row>
      </div>

      {/* Divider */}
      <motion.div
        style={{
          height: 1,
          background: "linear-gradient(90deg, #23243a 0%, #1677ff44 50%, #23243a 100%)",
          margin: "36px 0 18px 0",
          opacity: 0.7,
        }}
        initial={{ opacity: 0, scaleX: 0.7 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />

      {/* Bottom Bar */}
      <motion.div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          color: "#a3aed6",
          fontSize: 13,
          textAlign: "center",
        }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div>
          &copy; {new Date().getFullYear()} ERP SaaS. All rights reserved.
        </div>
        <div>
          Built with <span style={{ color: "#1677ff", fontWeight: 700 }}>❤️</span> for modern businesses.
        </div>
      </motion.div>
    </footer>
  );
}
