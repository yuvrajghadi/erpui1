import React, { useState, useEffect } from "react";
import { Button, Card, Typography } from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const plans = [
  {
    key: "free",
    name: "Free",
    monthly: { price: 0, oldPrice: null, period: "/month" },
    yearly: { price: 0, oldPrice: null, period: "/year" },
    button: "Get started for free",
    features: [
      "Up to 3 users",
      "Basic CRM & Sales Management",
      "Inventory Tracking",
    ],
    description: "Perfect for small teams exploring ERP automation.",
    color: "#22c55e",
    minHeight: 340,
    animate: true,
  },
  {
    key: "pro",
    name: "Pro",
    monthly: { price: 399, oldPrice: 799, period: "/month" },
    yearly: { price: 4788, oldPrice: 9588, period: "/year" },
    button: "Sign up now",
    features: [
      "Up to 50 users",
      "Advanced CRM & Sales Automation",
      "Purchase & Vendor Management",
      "Multi-warehouse Inventory",
      "GST & Tax Compliance",
    ],
    description: "Best for growing businesses needing advanced automation.",
    color: "#1677ff",
    highlight: true,
    minHeight: 420,
    badge: "POPULAR",
  },
  {
    key: "business",
    name: "Business",
    monthly: { price: 499, oldPrice: 1299, period: "/month" },
    yearly: { price: 5988, oldPrice: 15588, period: "/year" },
    button: "Sign up now",
    features: [
      "Unlimited users",
      "All Pro features",
      "Custom Module Development",
      "API & 3rd Party Integrations",
      "Role-based Access Control",
      "Dedicated Account Manager",
      "Data Migration Assistance",
      "24/7 Premium Support",
    ],
    description: "For large enterprises needing full customization & premium support.",
    color: "#ff9800",
    highlight: true,
    premium: true,
    minHeight: 520,
    badge: "PREMIUM",
  },
];

const INR = (amount: number): string =>
  amount === 0 ? "Free" : `₹${amount.toLocaleString("en-IN")}`;

const badgeVariants = {
  initial: { scale: 1, rotate: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
  animate: {
    scale: [1, 1.08, 1.12, 1.08, 1],
    rotate: [0, 4, -4, 0],
    boxShadow: [
      "0 0 0 0 #1677ff44",
      "0 0 12px 2px #1677ff88",
      "0 0 18px 4px #1677ff44",
      "0 0 12px 2px #1677ff88",
      "0 0 0 0 #1677ff44",
    ],
    transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
  },
  animatePremium: {
    scale: [1, 1.1, 1.14, 1.1, 1],
    rotate: [0, -4, 4, 0],
    boxShadow: [
      "0 0 0 0 #ff980044",
      "0 0 14px 4px #ff980088",
      "0 0 20px 6px #ff980044",
      "0 0 14px 4px #ff980088",
      "0 0 0 0 #ff980044",
    ],
    transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
  },
};

const freeCardVariants = {
  animate: {
    y: [0, -8, 0, 8, 0],
    rotate: [0, 2, 0, -2, 0],
    boxShadow: [
      "0 2px 18px 0 #22c55e33",
      "0 8px 32px 0 #22c55e44",
      "0 2px 18px 0 #22c55e33",
      "0 0px 12px 0 #22c55e22",
      "0 2px 18px 0 #22c55e33",
    ],
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
};

const badgeStyle = (color: string): React.CSSProperties => ({
  display: "inline-block",
  marginLeft: 10,
  padding: "2px 13px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  background:
    color === "#1677ff"
      ? "linear-gradient(90deg,#1677ff,#3b82f6 80%)"
      : "linear-gradient(90deg,#ff9800,#ffc107,#ff9800)",
  color: "#fff",
  letterSpacing: 1,
  verticalAlign: "middle",
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.12)",
  border: "2px solid #23272f",
  zIndex: 2,
  pointerEvents: "none" as const,
});

const animatedBorderVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // default safe value

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize(); // set initial value
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animated toggle
  const toggleWidth = 170;
  const toggleHeight = 46;

  return (
    <section
      id="pricing"
      style={{
        minHeight: "100vh",
        // background:
        //   "radial-gradient(circle at 50% 0%, #23272f 60%, #101014 100%)",
        padding: "48px 0 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background lights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          // background:
          //   "radial-gradient(circle at 20% 40%, #1677ff33 0%, transparent 60%)," +
          //   "radial-gradient(circle at 80% 20%, #ff980033 0%, transparent 70%)",
        }}
      />
      <style>{`
        // .pricing-scrollbar::-webkit-scrollbar { display: none; }
        // @media (max-width: 900px) {
        //   .pricing-cards-row {
        //     flex-direction: column !important;
        //     align-items: center !important;
        //     gap: 18px !important;
        //   }
        //   .pricing-card {
        //     min-width: 94vw;
        //     width: 98vw;
        //     max-width: 99vw;
        //   }
        // }
      `}</style>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 40,
              marginBottom: 4,
              letterSpacing: -1,
              textShadow: "0 2px 16px #1677ff22",
            }}
          >
            ERP SaaS Pricing
          </h2>
          <div
            style={{
              color: "#a3a3a3",
              fontSize: 18,
              fontWeight: 400,
              marginBottom: 32,
              textShadow: "0 2px 16px #10101499",
            }}
          >
            Flexible plans for every business size. <br />
            <span style={{ color: "#1677ff" }}>
              Upgrade anytime as your team grows.
            </span>
          </div>
          {/* Animated Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 18,
              zIndex: 10,
              position: "relative",
              height: toggleHeight,
            }}
          >
            <motion.div
              style={{
                width: toggleWidth,
                height: toggleHeight,
                background: "rgba(24, 119, 255, 0.07)",
                borderRadius: 24,
                position: "relative",
                boxShadow: "0 2px 16px 0 #1677ff22",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <motion.div
                layout
                initial={false}
                animate={{
                  x: isYearly ? toggleWidth / 2 : 0,
                  background: isYearly
                    ? "linear-gradient(90deg,#1677ff,#3b82f6 80%)"
                    : "linear-gradient(90deg,#16a34a,#22d3ee 80%)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  width: toggleWidth / 2 - 8,
                  height: toggleHeight - 8,
                  borderRadius: 20,
                  zIndex: 1,
                  boxShadow: "0 2px 16px #1677ff33",
                }}
              />
              <div
                style={{
                  width: "50%",
                  textAlign: "center",
                  zIndex: 2,
                  color: !isYearly ? "#fff" : "#a3a3a3",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  position: "relative",
                  userSelect: "none",
                  letterSpacing: 0.5,
                }}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </div>
              <div
                style={{
                  width: "50%",
                  textAlign: "center",
                  zIndex: 2,
                  color: isYearly ? "#fff" : "#a3a3a3",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  position: "relative",
                  userSelect: "none",
                  letterSpacing: 0.5,
                }}
                onClick={() => setIsYearly(true)}
              >
                Yearly
              </div>
            </motion.div>
            {isYearly && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{
                  color: "#16a34a",
                  fontWeight: 500,
                  fontSize: 13,
                  marginLeft: 14,
                  letterSpacing: 0.5,
                  textShadow: "0 2px 8px #16a34a33",
                }}
              >
                Save 50%
              </motion.span>
            )}
          </div>
        </div>
        {/* Cards */}
        <div
          className="pricing-scrollbar pricing-cards-row"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "nowrap",
            gap: 32,
            justifyContent: "center",
            alignItems: isMobile ? "stretch" : "flex-end",
            overflowX: isMobile ? "hidden" : "auto",
            overflowY: isMobile ? "auto" : "hidden",
            maxHeight: isMobile ? "80vh" : "none",
            paddingBottom: 20,
          }}
        >
          {plans.map((plan) => {
            const badge =
              plan.badge === "POPULAR" ? (
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  style={badgeStyle("#1677ff")}
                >
                  {plan.badge}
                </motion.span>
              ) : plan.badge === "PREMIUM" ? (
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate="animatePremium"
                  style={badgeStyle("#ff9800")}
                >
                  {plan.badge}
                </motion.span>
              ) : null;

            // Animated border for Pro and Business
            const borderGradient =
              plan.key === "pro"
                ? "linear-gradient(270deg,#1677ff,#3b82f6,#1677ff)"
                : plan.key === "business"
                ? "linear-gradient(270deg,#ff9800,#ffc107,#ff9800)"
                : undefined;

            const CardComponent =
              plan.key === "free"
                ? motion.div
                : motion.div;

            return (
              <CardComponent
                key={plan.key}
                variants={plan.key === "free" ? freeCardVariants : undefined}
                animate={plan.key === "free" ? "animate" : "animate"}
                className="pricing-card"
                style={{
                  minWidth: isMobile ? "92vw" : 320,
                  maxWidth: isMobile ? "94vw" : 370,
                  width: "100%",
                  background:
                    "linear-gradient(120deg,rgba(30,32,38,0.95) 70%,rgba(30,32,38,0.88) 100%)",
                  borderRadius: 22,
                  boxShadow:
                    plan.premium
                      ? "0 8px 40px 0 #ff980044, 0 2px 8px 0 #1677ff22"
                      : plan.highlight
                      ? "0 0 0 2.5px #1677ff, 0 8px 32px 0 #1677ff22"
                      : "0 2px 18px 0 #23272f44",
                  border: plan.premium
                    ? "2.5px solid #ff9800"
                    : plan.highlight
                    ? "2.5px solid #1677ff"
                    : "1.5px solid #23272f",
                  position: "relative",
                  overflow: "hidden",
                  padding: 0,
                  minHeight: plan.minHeight,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  margin: isMobile ? "0 auto" : 0,
                  backdropFilter: "blur(2.5px)",
                }}
              >
                {/* Animated border overlay for Pro and Business */}
                {(plan.key === "pro" || plan.key === "business") && (
                  <motion.div
                    variants={animatedBorderVariants}
                    animate="animate"
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      inset: 0,
                      borderRadius: 22,
                      zIndex: 2,
                      border: "2.5px solid transparent",
                      background: borderGradient,
                      backgroundSize: "200% 200%",
                      backgroundClip: "padding-box, border-box",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                      borderImage: "fill 1",
                      opacity: 0.85,
                    }}
                  />
                )}
                <div
                  style={{
                    padding: "36px 28px 28px 28px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    position: "relative",
                    zIndex: 3,
                  }}
                >
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        color: plan.highlight
                          ? "#1677ff"
                          : plan.premium
                          ? "#ff9800"
                          : "#fff",
                        fontSize: 22,
                        letterSpacing: -0.5,
                        display: "inline-block",
                      }}
                    >
                      {plan.name}
                    </span>
                    {plan.highlight && !plan.premium && (
                      <motion.span
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        style={badgeStyle("#1677ff")}
                      >
                        POPULAR
                      </motion.span>
                    )}
                    {plan.premium && (
                      <motion.span
                        variants={badgeVariants}
                        initial="initial"
                        animate="animatePremium"
                        style={badgeStyle("#ff9800")}
                      >
                        PREMIUM
                      </motion.span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: plan.highlight
                        ? "#1677ff"
                        : plan.premium
                        ? "#ff9800"
                        : "#fff",
                      margin: "8px 0 6px 0",
                    }}
                  >
                    {plan.monthly.price === 0 && plan.yearly.price === 0 ? (
                      <span style={{ color: "#1677ff" }}>Free</span>
                    ) : (
                      <>
                        {isYearly && plan.yearly.oldPrice && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#bbb",
                              fontWeight: 400,
                              fontSize: 18,
                              marginRight: 8,
                            }}
                          >
                            {INR(plan.yearly.oldPrice)}
                          </span>
                        )}
                        {!isYearly && plan.monthly.oldPrice && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#bbb",
                              fontWeight: 400,
                              fontSize: 18,
                              marginRight: 8,
                            }}
                          >
                            {INR(plan.monthly.oldPrice)}
                          </span>
                        )}
                        <span>
                          {INR(
                            isYearly ? plan.yearly.price : plan.monthly.price
                          )}
                        </span>
                        <span
                          style={{
                            color: "#a3a3a3",
                            fontWeight: 500,
                            fontSize: 15,
                            marginLeft: 4,
                          }}
                        >
                          {isYearly
                            ? plan.yearly.period
                            : plan.monthly.period}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      color: "#b0b8c6",
                      fontSize: 15,
                      marginBottom: 12,
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {plan.description}
                  </div>
                  <Button
                    type={plan.highlight || plan.premium ? "primary" : "default"}
                    size="large"
                    block
                    style={{
                      borderRadius: 7,
                      height: 44,
                      fontWeight: 700,
                      marginBottom: 18,
                      background:
                        plan.premium
                          ? "linear-gradient(90deg,#ff9800,#ffc107,#ff9800)"
                          : plan.highlight
                          ? "linear-gradient(90deg,#1677ff,#3b82f6 80%)"
                          : "rgba(255,255,255,0.08)",
                      color: plan.highlight || plan.premium ? "#23272f" : "#fff",
                      border:
                        plan.highlight || plan.premium
                          ? "none"
                          : "1.5px solid #23272f",
                      fontSize: 16,
                    }}
                  >
                    {plan.button}
                  </Button>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      width: "100%",
                    }}
                  >
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        style={{
                          color: "#fff",
                          fontSize: 15,
                          margin: "0 0 10px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          opacity: 0.92,
                          wordBreak: "keep-all",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span
                          style={{
                            color: plan.premium
                              ? "#ff9800"
                              : plan.highlight
                              ? "#1677ff"
                              : "#22c55e",
                            fontWeight: 700,
                            fontSize: 18,
                          }}
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardComponent>
            );
          })}
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#a3a3a3",
            fontSize: 15,
            marginTop: 24,
            marginBottom: 16,
            textShadow: "0 2px 8px #10101499",
          }}
        >
          Start your ERP journey risk free – No credit card needed
        </div>
      </div>
    </section>
  );
};
