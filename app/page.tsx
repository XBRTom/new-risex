import Login from "@/components/homepage/login";
import Sections from "@/components/homepage/sections";

const HomePage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-2.5rem)] flex flex-col lg:flex-row no-scrollbar">
      <div 
        className="flex flex-col items-center justify-center py-12 w-full lg:w-2/5 h-[calc(100vh-2.5rem)] overflow-y-auto no-scrollbar bg-astronaut bg-cover bg-center"
      >
        <span className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8">
          LIQUID
        </span>
        <Login />
      </div>

      <div className="bg-slate-900 text-white w-full lg:w-3/5 h-[calc(100vh-2.5rem)] overflow-y-auto no-scrollbar scroll-snap-mandatory scroll-snap-y">
        <div className="space-y-16 p-8">
          <Sections />
        </div>
      </div>
    </div>
  );
}

export default HomePage;