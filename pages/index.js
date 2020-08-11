import { useState } from "react";
import { Input, Form, Spin, Button } from "antd";
import Router from "next/router";
import "./sider.less";

const Home = (props) => {
  const [loading, setLoading] = useState(false);

  const onFinish = ({ url }) => {
    setLoading(true);
    const [_, information] = url.split("github.com/");
    const [profile, project] = information.split("/");
    Router.push({
      pathname: "/project",
      query: { profile, project },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="parent blue">
      <div className="box coral">
        <h1 className="title">Project Visualization</h1>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="url"
            rules={[{ required: true, message: "Please input your github project url!" }]}
          >
            <Input
              placeholder="Past your github project url"
              style={{ width: 400 }}
            />
          </Form.Item>
          <br />
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              className="code-btn"
              htmlType="submit"
            >
              Check out the code
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Home;
