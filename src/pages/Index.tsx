
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Layout, Lock, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/ui/mobile-nav";

const Index = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" }
  ];
  
  const callToAction = {
    primary: {
      href: "/register",
      label: "Get Started"
    },
    secondary: {
      href: "/login",
      label: "Log in"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#020240] text-white py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-white" />
            <span className="font-bold text-xl">CitizenVoice</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-white/80 transition">Home</Link>
            <Link to="#features" className="hover:text-white/80 transition">Features</Link>
            <Link to="#how-it-works" className="hover:text-white/80 transition">How It Works</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#020240]">
                  Log in
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Link to="/register">
                <Button className="bg-white text-[#020240] hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </div>
            
            {/* Mobile Navigation */}
            <MobileNav links={navLinks} callToAction={callToAction} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#020240] text-white py-16 md:py-32">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Bridging Citizens and Government
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg">
              A streamlined platform for citizens to voice concerns and leaders to respond effectively.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-[#020240] hover:bg-white/90 w-full sm:w-auto">
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Digital platform"
              className="rounded-lg shadow-xl max-w-full h-auto" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#020240] mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform connects citizens with local government to streamline the resolution process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <MessageSquare className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Submit Complaints</h3>
              <p className="text-gray-600">
                Easily submit and track complaints with supporting images and detailed descriptions.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <Layout className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Dashboard Analytics</h3>
              <p className="text-gray-600">
                Access comprehensive dashboards to view complaint status and resolution progress.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <Lock className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Secure Communications</h3>
              <p className="text-gray-600">
                Ensure privacy and security with end-to-end encrypted communications between citizens and leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#020240] mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our simple 3-step process makes it easy for citizens to report issues and leaders to respond.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Register & Submit</h3>
              <p className="text-gray-600">
                Create an account and submit your complaint with supporting details and images.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Review & Processing</h3>
              <p className="text-gray-600">
                Leaders receive and review your complaint, assigning priority and action steps.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">Resolution & Updates</h3>
              <p className="text-gray-600">
                Receive timely updates as your complaint is addressed and ultimately resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">10k+</p>
              <p className="text-lg text-gray-600">Issues Resolved</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">85%</p>
              <p className="text-lg text-gray-600">Resolution Rate</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">24h</p>
              <p className="text-lg text-gray-600">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#020240] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join our platform today and be part of the solution in your community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-[#020240] hover:bg-white/90 w-full sm:w-auto">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6" />
                <span className="font-bold text-xl">CitizenVoice</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting citizens with local government to create better communities through effective communication and problem solving.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="#features" className="text-gray-400 hover:text-white transition">Features</Link></li>
                <li><Link to="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition">Register</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2025 CitizenVoice. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Social Media Links */}
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
