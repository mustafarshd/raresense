import { ChevronDownIcon, Check, Star } from "lucide-react";
import { LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export const Pricing = (): JSX.Element => {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as Element;
        if (!target.closest('[data-user-dropdown]')) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out snapwear AI",
      tokens: "100 tokens/month",
      features: [
        "Basic jewelry generation",
        "Standard quality images",
        "3 generations per day",
        "Community support",
        "Basic templates"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professionals and growing businesses",
      tokens: "2,500 tokens/month",
      features: [
        "High-quality generation",
        "Premium image resolution",
        "Unlimited generations",
        "Priority support",
        "Advanced templates",
        "Batch processing",
        "Commercial license",
        "API access"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large teams and organizations",
      tokens: "Unlimited tokens",
      features: [
        "Everything in Pro",
        "Custom model training",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
        "Team management",
        "Advanced analytics",
        "White-label options"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="flex flex-col items-start relative bg-white min-h-screen">
      {/* Header */}
      <header className="relative w-full h-[80px] md:h-[106px] bg-white shadow-[0px_4px_4px_#00000040] z-10">
        <div className="flex items-center justify-between h-full px-4 md:px-8 lg:px-12">
          <button
            onClick={() => navigate('/')}
            className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[24px] md:text-[32px] tracking-[-2.24px] hover:opacity-80 transition-opacity"
          >
            snapwear AI
          </button>

          <div className="flex items-center gap-4 md:gap-8">
            <Button
              variant="default"
              className="flex h-[40px] md:h-[45px] items-center gap-[10px] md:gap-[15px] p-2 md:p-3 bg-[#151515] rounded"
            >
              <div className="relative w-[20px] h-[20px] md:w-[23px] md:h-[23px] bg-[url(/group.png)] bg-[100%_100%]">
                <img
                  className="absolute w-[7px] h-[7px] top-2 left-2"
                  alt="Icon"
                  src="/icon.svg"
                />
              </div>
              <span className="font-text-medium-20 text-white whitespace-nowrap text-sm md:text-base">
                9999
              </span>
            </Button>

            <div className="flex items-center gap-2 md:gap-4" data-user-dropdown>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg md:text-2xl tracking-[-1.20px] leading-[19.2px] hidden sm:block">
                    Username ABCD
                  </span>
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-sm tracking-[-1.20px] leading-[19.2px] sm:hidden">
                    User
                  </span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showUserDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/signup');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16 max-w-4xl mx-auto">
          <h1 className="font-headings-desktop-h2 text-[#151515] mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Select the perfect plan for your jewelry generation needs. 
            Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto mb-12 md:mb-20">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative p-6 md:p-8 lg:p-10 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              plan.popular 
                ? 'border-[#151515] shadow-lg lg:scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#151515] text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6 md:mb-8">
                <h3 className="font-headings-desktop-h3 text-[#151515] mb-2 text-xl md:text-2xl">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-2xl md:text-4xl font-bold text-[#151515]">{plan.price}</span>
                  <span className="text-gray-600 ml-2 text-sm md:text-base">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base">{plan.description}</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-[#151515] text-sm md:text-base">{plan.tokens}</span>
                </div>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.buttonVariant}
                className={`w-full py-2 md:py-3 text-sm md:text-base ${
                  plan.buttonVariant === 'default' 
                    ? 'bg-[#151515] hover:bg-[#2a2a2a] text-white' 
                    : 'border-[#151515] text-[#151515] hover:bg-[#151515] hover:text-white'
                }`}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headings-desktop-h3 text-[#151515] text-center mb-8 md:mb-12 text-xl md:text-2xl">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            <div>
              <h4 className="font-semibold text-[#151515] mb-2 text-sm md:text-base">What are tokens?</h4>
              <p className="text-gray-600 text-sm md:text-base">Tokens are credits used to generate images. Each generation consumes a certain number of tokens based on quality and complexity.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#151515] mb-2 text-sm md:text-base">Can I change plans anytime?</h4>
              <p className="text-gray-600 text-sm md:text-base">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#151515] mb-2 text-sm md:text-base">Do unused tokens roll over?</h4>
              <p className="text-gray-600 text-sm md:text-base">Pro plan tokens roll over for up to 3 months. Free plan tokens reset monthly.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#151515] mb-2 text-sm md:text-base">Is there a free trial?</h4>
              <p className="text-gray-600 text-sm md:text-base">Yes! Pro plan comes with a 14-day free trial. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-50 py-8 md:py-12 lg:py-16 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
            <h2 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[24px] md:text-[32px] tracking-[-2.24px]">
              snapwear AI
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-base md:text-lg">
                  How it works
                </span>
              </Button>
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-base md:text-lg">
                  About
                </span>
              </Button>
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-base md:text-lg">
                  FAQs
                </span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 md:py-5 border-t-2 border-[#151515] gap-4">
            <div className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-sm">
              © SnapwearAI 2025.
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-xs md:text-sm">
                  Terms & Conditions
                </span>
              </Button>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-xs md:text-sm">
                  Privacy Policy
                </span>
              </Button>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Button variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-xs md:text-sm">
                  Cookies
                </span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};