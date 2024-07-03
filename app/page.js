import Layout from "./components/Layout";
import { SocialIcon } from "react-social-icons";
import Chatbox from "./components/Chatbox";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-200">MINYEONG KIM</p>
          <p className="text-lg font-medium text-gray-400">
            Senior Software Engineer
          </p>
          <p className="text-sm text-gray-500">Sydney, AUSTRALIA</p>
          <p className="text-sm text-gray-500">doingmyk@gmail.com</p>
        </div>
        <Chatbox />
        <div className="flex space-x-4">
          <SocialIcon
            url="https://github.com/mykim-aus"
            style={{ height: 40, width: 40 }}
          />
          <SocialIcon
            url="https://www.linkedin.com/in/mykinaus"
            style={{ height: 40, width: 40 }}
          />
          <SocialIcon
            url="https://medium.com/@doingmyk"
            style={{ height: 40, width: 40 }}
          />
        </div>
      </div>
    </Layout>
  );
}
