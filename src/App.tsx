import Banner from './components/Banner';
import Contact from './components/Contact';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import {tools} from './data/tools';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />
        <Banner />
        {/* <Guarantee /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* <Contact /> */}
      </div>
    </div>
  );
}

export default App;
