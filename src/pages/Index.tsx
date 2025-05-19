
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Layout, Lock, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/ui/mobile-nav";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  const navLinks = [
    { href: "/", label: t('navbar.home') },
    { href: "#features", label: t('navbar.features') },
    { href: "#how-it-works", label: t('navbar.howItWorks') }
  ];
  
  const callToAction = {
    primary: {
      href: "/register",
      label: t('navbar.getStarted')
    },
    secondary: {
      href: "/login",
      label: t('navbar.login')
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
            <Link to="/" className="hover:text-white/80 transition">{t('navbar.home')}</Link>
            <Link to="#features" className="hover:text-white/80 transition">{t('navbar.features')}</Link>
            <Link to="#how-it-works" className="hover:text-white/80 transition">{t('navbar.howItWorks')}</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden md:block">
              <Link to="/login">
                <Button variant="outline" className="border-white text-[#020240]">
                  {t('navbar.login')}
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Link to="/register">
                <Button className="bg-white text-[#020240] hover:bg-white/90">
                  {t('navbar.getStarted')}
                </Button>
              </Link>
            </div>
            
            <MobileNav links={navLinks} callToAction={callToAction} />
          </div>
        </div>
      </nav>

      <section className="bg-[#020240] text-white py-16 md:py-32">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-[#020240] hover:bg-white/90 w-full sm:w-auto">
                  {t('hero.signUp')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button size="lg" variant="outline" className="border-white text-[#020240] hover:bg-white/10 w-full sm:w-auto">
                  {t('hero.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/hero.png" 
              alt="Digital platform"
              className="rounded-lg shadow-xl max-w-full h-auto" 
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#020240] mb-4">{t('features.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <MessageSquare className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('features.feature1.title')}</h3>
              <p className="text-gray-600">
                {t('features.feature1.description')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <Layout className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('features.feature2.title')}</h3>
              <p className="text-gray-600">
                {t('features.feature2.description')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-[#020240]/10 p-3 rounded-full w-fit mb-6">
                <Lock className="h-6 w-6 text-[#020240]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('features.feature3.title')}</h3>
              <p className="text-gray-600">
                {t('features.feature3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#020240] mb-4">{t('howItWorks.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('howItWorks.step1.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.step1.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('howItWorks.step2.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.step2.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#020240] text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-[#020240]">{t('howItWorks.step3.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">10k+</p>
              <p className="text-lg text-gray-600">{t('stats.issuesResolved')}</p>
            </div>
            
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">85%</p>
              <p className="text-lg text-gray-600">{t('stats.resolutionRate')}</p>
            </div>
            
            <div className="text-center p-6">
              <p className="text-4xl md:text-5xl font-bold text-[#020240] mb-2">24h</p>
              <p className="text-lg text-gray-600">{t('stats.responseTime')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#020240] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-[#020240] hover:bg-white/90 w-full sm:w-auto">
                {t('cta.registerButton')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                {t('cta.loginButton')}
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
                {t('footer.description')}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks.title')}</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">{t('footer.quickLinks.home')}</Link></li>
                <li><Link to="#features" className="text-gray-400 hover:text-white transition">{t('footer.quickLinks.features')}</Link></li>
                <li><Link to="#how-it-works" className="text-gray-400 hover:text-white transition">{t('footer.quickLinks.howItWorks')}</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition">{t('footer.quickLinks.login')}</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition">{t('footer.quickLinks.register')}</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.legal.title')}</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.privacy')}</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.terms')}</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.cookies')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Social Media Links */}
              <a href="#" className="text-gray-400 hover:text-white transition">{t('footer.social.twitter')}</a>
              <a href="#" className="text-gray-400 hover:text-white transition">{t('footer.social.facebook')}</a>
              <a href="#" className="text-gray-400 hover:text-white transition">{t('footer.social.instagram')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
