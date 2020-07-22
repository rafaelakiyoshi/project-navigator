import { useState, useEffect } from "react";
import fetcher from "../libs/fetcher";
import useSWR from "swr";
// import SyntaxHighlighter from 'react-syntax-highlighter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Base64 } from 'js-base64';

const CodeRender = (props) => {
  const [code, updateCode] = useState("");
  const { data } = useSWR(props.url, fetcher, "");

  useEffect(() => {
    const code = data ? Base64.decode(data.content) : "";
    updateCode(code);
  }, [data]);

  if(code) {
    return (
      <SyntaxHighlighter language="jsx" style={tomorrow} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    );
  }
  return null;
};

export default CodeRender;
