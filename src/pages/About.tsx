
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 md:py-16 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">About Wrenchmark</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Wrenchmark is a comprehensive motorcycle reference database designed for enthusiasts, riders, and mechanics. Our mission is to provide accurate, detailed information about motorcycles from various manufacturers around the world.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Purpose</h2>
            <p>
              Whether you're researching your next bike purchase, comparing specifications, or looking for maintenance information, Wrenchmark aims to be your go-to resource. We believe in empowering riders with knowledge to make informed decisions about their motorcycles.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comprehensive database of motorcycle specifications</li>
              <li>Detailed filtering to find the perfect bike</li>
              <li>Difficulty ratings to help new riders choose appropriate motorcycles</li>
              <li>Motorcycle categorization by type, style, and features</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Future Plans</h2>
            <p>
              Wrenchmark is continuously evolving. We plan to implement user accounts, which will allow you to save your favorite motorcycles, track maintenance records, and create custom comparisons. Stay tuned for these exciting features!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
