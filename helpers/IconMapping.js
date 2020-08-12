const icons = {
  js: "/js.svg",
  babel: "/babel.svg",
  babelrc: "/babel.svg",
  css: "/css.svg",
  gitignore: "/git.svg",
  dockerignore: "/docker.svg",
  "docker-compose": "/docker.svg",
  docker: "/docker.svg",
  Dockerfile: "/docker.svg",
  gulpfile: "/gulp.svg",
  json: "/json.svg",
  less: "/less.svg",
  md: "/markdown.svg",
  svg: "/svg.svg",
  html: "/html.svg",
  ts: "/typescript.svg",
  tsx: "/typescript.svg",
  yarn: "/yarn.svg"
};
const IconMapping = name => {
  const fragments = name.split(".");
  const icon = icons[fragments[fragments.length - 1]] || icons[fragments[fragments.length - 2]];
  return icon;
};

export default IconMapping;