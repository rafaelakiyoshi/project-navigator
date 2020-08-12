import { useState } from "react";
import fetcher from "../libs/fetcher";
import useSWR from "swr";
import { Layout, Tree, Tabs } from "antd";
import CodeRender from "../components/CodeRender.js";
import IconMapping from "../helpers/IconMapping";
import "./sider.less";

const { DirectoryTree } = Tree;
const { Content, Sider } = Layout;
const { TabPane } = Tabs;
let newTabIndex = 0;

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
  const [_, updateCodePath] = useState("");
  const [treeData, setTreeData] = useState(data);
  const [panes, setPanes] = useState([]);
  const [activeKey, setActiveKey] = useState();

  const onChange = activeKey => {
    setActiveKey(activeKey);
  };

  const onEdit = (targetKey, action) => {
    remove(targetKey);
  };

  const add = node => {
    const activeKey = `newTab${node.name}`;
    const newPanes = panes;
    let open = false;
    panes.forEach(pane => {
      if (pane.title === node.name) open = true;
    });
    if (!open) {
      const title = (
        <span>
          <img src={IconMapping(node.name)} alt="js" style={{ width: 13, height: 13, margin: 5 }} />
          {node.name}
        </span>
      ); 
      newPanes.push({ title: title, content: node.url, key: activeKey });
      setPanes(newPanes);
      setActiveKey(activeKey);
    }
  };

  const remove = targetKey => {
    console.log(panes);
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    let newActiveKey;
    if (newPanes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
    console.log(newPanes, activeKey);
  };


  const onLoadData = async (node) => {
    const { key, children, url } = node;
    return new Promise(async (resolve) => {
      if (children) {
        resolve();
        return;
      }

      const myChildren = await fetcher(url);
      myChildren.map((file, index) => {
        if (file.type !== "dir") {
          file.isLeaf = true;
          file.icon = <img src={IconMapping(file.name)} alt="js" style={{ width: 13, height: 13 }} />;
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
      add(event.node);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: "#0e0e0e" }}>
        <div className="logo" />
        <DirectoryTree
          style={{ overflowY: "scroll", height: "100vh"}}
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
      <Layout className="site-layout" style={{ backgroundColor: "#2d2d2d" }}>
        <Content
          style={{
            margin: "0",
            maxHeight: "100vh",
            backgroundColor: "#2d2d2d",
          }}
        >
          <Tabs
          hideAdd
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit}
        >
          {panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              <CodeRender url={pane.content} />
            </TabPane>
          ))}
        </Tabs>
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
      file.icon = <img src={IconMapping(file.name)} alt="js" style={{ width: 13, height: 13 }} />;
    } else {
      file.isLeaf = false;
    }
    file.title = file.name;
    file.key = index;
  });

  return { props: { initialData: data.reverse() } };
}
