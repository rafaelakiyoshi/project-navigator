import { useState } from "react";
import fetcher from "../libs/fetcher";
import useSWR from "swr";
import { Layout, Tree } from "antd";
import CodeRender from "../components/CodeRender.js";
import "./sider.less";

const { DirectoryTree } = Tree;
const { Content, Sider } = Layout;

const updateTreeData = (list, key, children) => {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
};

export default function Project({initialData}) {
  const { data } = useSWR(URL, fetcher, { initialData });
  const [codePath, updateCodePath] = useState("");
  const [treeData, setTreeData] = useState(data);

  const onLoadData = async (node) => {
    const { key, children, url } = node;
    console.log("onLoadData -> key", node);
    return new Promise(async (resolve) => {
      if (children) {
        resolve();
        return;
      }

      const myChildren = await fetcher(url);
      myChildren.map((file, index) => {
        if (file.type !== "dir") {
          file.isLeaf = true;
        } else {
          file.isLeaf = false;
        }
        file.title = file.name;
        file.key = `${key}-${index}`;
      });
      setTreeData((origin) => updateTreeData(origin, key, myChildren));
      resolve();
      resolve();
    });
  };

  const onSelect = (keys, event) => {
    if (event.node.isLeaf) {
      updateCodePath(event.node.url);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: "#0e0e0e" }}>
        <div className="logo" />
        <DirectoryTree
          loadData={onLoadData}
          treeData={treeData}
          onSelect={onSelect}
        />
        <style jsx>{`
          .ant-tree-treenode .ant-tree-treenode-selected {
            background-color: red !important;
          }
        `}</style>
      </Sider>
      <Layout className="site-layout">
        <Content
          style={{
            margin: "0",
            maxHeight: "100vh",
            backgroundColor: "#2d2d2d",
          }}
        >
          <CodeRender url={codePath} />
        </Content>
      </Layout>
    </Layout>
  );
}

export async function getServerSideProps({query}) {
  const { profile, project } = query;
  const data = await fetcher(`https://api.github.com/repos/${profile}/${project}/contents`
  );

  function compare(a, b) {
    if (a.type === "dir") return 1;
    if (b.type !== "dir") return -1;
  
    return 0;
  }
  
  data.sort(compare);

  data.map((file, index) => {
    if (file.type !== "dir") {
      file.isLeaf = true;
    } else {
      file.isLeaf = false;
    }
    file.title = file.name;
    file.key = index;
  });

  return { props: { initialData: data.reverse() } };
}
