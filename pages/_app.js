import { useState, useEffect  } from "react";
import Head from "next/head";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  dark: `/dark-theme.module.css`,
  light: `/light-theme.module.css`,
};

const MyApp = props => {
  const [rendered, updateRendered] = useState(false);
  const [theme, updateTheme] = useState("dark");

  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    updateTheme(theme);
    updateRendered(true);
  },[]);

    const { Component, pageProps } = props;
    return (
      <>
        <Head>
          <title>Project Visualization</title>
        </Head>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={theme}>
          {rendered && <Component {...pageProps} />}
        </ThemeSwitcherProvider>
      </>
    );
}

export default MyApp;
