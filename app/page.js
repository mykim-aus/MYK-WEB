import Image from "next/image";
import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold mb-6">Welcome to My Portfolio</h1>
      </div>
    </Layout>
  );
}
