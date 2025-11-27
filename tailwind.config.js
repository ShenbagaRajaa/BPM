module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundColor: ["responsive"],
      colors: {
        dgray: "#38404d",
        lgray: "#7e8790",
        lblue: "#f1f4f9",
        toolbarBg: "#fbfbfb",
        text: "#3a3a81",
        mBg: "#e0e0e0",
        mCard: "#c2c2de",
        textSky: "#38bdf8",
        mBgBlue: "#d9d9f5",
        toolbarEx: "#F5F5F5",
      },
      boxShadow: {
        "bottom-only": "2 0px 0px 0px rgba(0,0,0,0.1)",
      },
    },
    screens: {
      mobile: { max: "767px" },
      tablet: {
        raw: "(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)",
      },
      mobileLandscape: {
        raw:
          "(max-width: 1023px) and (orientation: landscape) and (max-height: 500px), " +
          "(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)",
      },
      md: "1024px",
      lg: "1280px",
      xl: "1536px",
      // xs: { max: "479px" },
      // sm: { max: "639px" },
    },
  },
  plugins: [],
};
