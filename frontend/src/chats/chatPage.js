import axios from "axios";
import { useEffect, useState } from "react";
import { PrettyChatWindow } from "react-chat-engine-pretty";
import {
  MultiChatWindow,
  MultiChatSocket,
  useMultiChatLogic,
} from "react-chat-engine-advanced";

const ChatsPage = (props) => {
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const chatProps = useMultiChatLogic(
    "e6a5d4c8-251a-45bd-82ad-75a6b8b5432c",
    token,
    token
  );
  useEffect(() => {
    axios
      .post("http://localhost:4000/login", { token, token })
      .then((r) => {
        setUser({ ...r.data, secret: token });
        console.log(r.data);
      }) // NOTE: over-ride secret
      .catch((e) => console.log(JSON.stringify(e.response.data)));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <PrettyChatWindow
        projectId={"e6a5d4c8-251a-45bd-82ad-75a6b8b5432c"}
        username={props.user?.username} // adam
        secret={props.user?.secret} // pass1234
        style={{ height: "100%" }}
      />
    </div>
  );
  // return (
  //   <div style={{ height: "100vh", width: "100vw" }}>
  //     <MultiChatSocket {...chatProps} />
  //     <MultiChatWindow {...chatProps} style={{ height: "100vh" }} />
  //   </div>
  // );
};

export default ChatsPage;
