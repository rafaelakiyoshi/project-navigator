import { useState } from "react";
import { Input, Button } from "antd";
import Router from "next/router";
import "./sider.less";

const Home = (props) => {
  const [url, setUrl] = useState("");
  console.log("Home -> url", url);

  const fetchProjectAndPush = (url) => {
    const [_, information] = url.split("github.com/");
    const [profile, project] = information.split("/");
    Router.push({
      pathname: "/project",
      query: { profile, project },
    });
  };
  return (
    <div className="parent blue">
      <div className="box coral" contenteditable>
        <h1>Project Visualization</h1>
        <Input
          onPressEnter={() => fetchProjectAndPush(url)}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Past your github project url"
          style={{ width: 400 }}
        />
        <br />
        <Button onClick={() => fetchProjectAndPush(url)} type="primary">
          Primary Button
        </Button>
      </div>
    </div>
  );
};

export default Home;
