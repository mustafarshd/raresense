import { ChevronDownIcon, Eye, EyeOff, InstagramIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful signup, redirect to generations page
      navigate('/generations');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = [
    { text: "How it works" },
    { text: "About" },
    { text: "FAQs" },
  ];

  const legalLinks = [
    { text: "Terms & Conditions" },
    { text: "Privacy Policy" },
    { text: "Cookies" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1 min-h-screen">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 md:px-8 py-8 md:py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-headings-desktop-h3 text-[#151515] mb-2 text-xl md:text-2xl">
                Create account
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Create an account and get started.
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2 md:py-3 rounded-lg border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#151515] focus:ring-1 focus:ring-[#151515]`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2 md:py-3 rounded-lg border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#151515] focus:ring-1 focus:ring-[#151515]`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 md:py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#151515] focus:ring-1 focus:ring-[#151515]`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-2 md:py-3 pr-12 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#151515] focus:ring-1 focus:ring-[#151515]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 md:py-3 pr-12 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#151515] focus:ring-1 focus:ring-[#151515]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 md:gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: "" }));
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      agreedToTerms 
                        ? 'bg-[#151515] border-[#151515]' 
                        : errors.terms
                        ? 'border-red-500'
                        : 'border-gray-300 hover:border-[#151515]'
                    }`}>
                      {agreedToTerms && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    I agree to the{" "}
                    <button type="button" className="text-[#151515] underline hover:no-underline">
                      Terms of Service
                    </button>
                    {" "}and{" "}
                    <button type="button" className="text-[#151515] underline hover:no-underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 bg-[#151515] hover:bg-[#2a2a2a] text-white rounded-lg font-medium text-base md:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-600 hover:text-[#151515] transition-colors"
                >
                  Already have an account?{" "}
                  <span className="text-[#151515] font-medium underline hover:no-underline">
                    Log in
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Jewelry showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Footer - Same as main page */}
      <footer className="flex flex-col w-full items-start pt-8 md:pt-16 pb-4 px-4 md:px-8 lg:px-20 bg-white border-t border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-8">
          <h2 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[32px] md:text-[50.3px] tracking-[-3.52px]">
            snapwear AI
          </h2>

          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {footerLinks.map((link, index) => (
              <Button key={index} variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg md:text-2xl tracking-[-1.20px] leading-[19.2px]">
                  {link.text}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex flex-col w-full lg:w-[350px] items-start gap-6 md:gap-8">
            <div className="flex items-start gap-4 md:gap-8">
              <Button variant="ghost" size="icon" className="p-0 h-auto">
                <InstagramIcon className="w-6 h-6 text-[#151515]" />
              </Button>
              <Button variant="ghost" size="icon" className="p-0 h-auto">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#151515] rounded-sm"></div>
                </div>
              </Button>
              <Button variant="ghost" size="icon" className="p-0 h-auto">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#151515] rounded-sm"></div>
                </div>
              </Button>
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              <p className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg leading-[27px]">
                Subscribe to our newsletter
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
                <Input
                  placeholder="Enter your email"
                  className="flex-1 w-full sm:w-auto px-4 py-2 rounded border border-solid border-[#151515] [font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-sm leading-[21px]"
                />
                <Button variant="ghost" size="icon" className="p-0 self-center sm:self-auto">
                  <ChevronDownIcon className="w-8 h-8 md:w-10 md:h-10 rotate-[-90deg]" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[1240px] h-[150px] md:h-[310px] [font-family:'DM_Sans',Helvetica] font-normal text-transparent text-[120px] md:text-[293.1px] tracking-[-14.65px] leading-[120px] md:leading-[293.1px] whitespace-nowrap overflow-hidden">
          <span className="font-medium text-[#151515] tracking-[-20px] md:tracking-[-42.95px]">
            innovati
          </span>
          <span className="[font-family:'Cormorant_Garamond',Helvetica] font-light italic text-[#151515] text-[150px] md:text-[370.9px] tracking-[-30px] md:tracking-[-68.79px] leading-[150px] md:leading-[370.9px]">
            ve
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-5 w-full border-t-2 border-[#151515] gap-4">
          <div className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-sm text-center leading-[21px]">
            © SnapwearAI 2025.
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            {legalLinks.map((link, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Separator orientation="vertical" className="h-4 md:h-5 hidden sm:block" />
                )}
                <Button variant="link" className="p-0 h-auto">
                  <span className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-xs md:text-sm leading-[19.9px]">
                    {link.text}
                  </span>
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};