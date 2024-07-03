// import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-6 bg-gray-900">
        <div className="text-xl font-bold">MINYEONG KIM</div>
        <div>
          <a className="mx-4 hover:text-gray-400">Chatbot</a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
