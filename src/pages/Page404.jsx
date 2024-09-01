const styles = {
  page404: {
    padding: "40px 0",
    background: "#fff",
    fontFamily: "'Arvo', serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  fourZeroFourBg: {
    backgroundImage:
      "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
    height: "400px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fourZeroFourBgH1: {
    fontSize: "80px",
    color: "#fff",
  },
  fourZeroFourBgH3: {
    fontSize: "80px",
    margin: "20px 0",
  },
  link404: {
    color: "#fff",
    padding: "10px 20px",
    background: "#39ac31",
    margin: "20px 0",
    display: "inline-block",
    textDecoration: "none",
  },
  contantBox404: {
    marginTop: "-50px",
  },
};

const Page404 = () => {
  return (
    <section style={styles.page404}>
      <div>
        <div style={styles.fourZeroFourBg}>
          {/* <h1 style={styles.fourZeroFourBgH1}>404</h1> */}
        </div>
        <div style={styles.contantBox404}>
          <h3 style={styles.fourZeroFourBgH3}>Look like you&apos;re lost</h3>
          <p>The page you are looking for is not available!</p>
          <a href="/" style={styles.link404}>
            Go to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default Page404;
