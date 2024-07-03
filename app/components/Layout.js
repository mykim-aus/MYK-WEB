import Typing from "./Typing";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-center items-center p-6 bg-gray-900">
        <Typing />
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
