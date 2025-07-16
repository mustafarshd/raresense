import { 
  ChevronDownIcon, 
  InstagramIcon, 
  UploadIcon, 
  Download, 
  RotateCcw, 
  Trash2,
  Gem,
  X,
  Eye,
  Images,
  LogOut
} from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export const PictureExpanded = (): JSX.Element => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateTokens } = useAuth();
  const [selectedJewelryType, setSelectedJewelryType] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [showTokensPopup, setShowTokensPopup] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<{ index: number; src: string } | null>(null);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [focusedImage, setFocusedImage] = useState<number | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Add keyboard event listener for ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalImage) {
        handleCloseModal();
      }
    };

    if (modalImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalImage]);

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

  const handleJewelryTypeChange = useCallback((value: string) => {
    setSelectedJewelryType(value);
  }, []);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;
    
    // Check if user has enough tokens
    const tokensRequired = 0; // Standard generation cost
    if (!profile || profile.tokens < tokensRequired) {
      alert('Insufficient tokens. Please purchase more tokens.');
      navigate('/pricing');
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    setSelectedImages(new Set());
    setFocusedImage(null);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          
          // Generate same number of images as uploaded
          const mockImages = [
            "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927261/pexels-photo-1927261.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927263/pexels-photo-1927263.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927264/pexels-photo-1927264.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927265/pexels-photo-1927265.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927266/pexels-photo-1927266.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927267/pexels-photo-1927267.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927268/pexels-photo-1927268.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927269/pexels-photo-1927269.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/1927270/pexels-photo-1927270.jpeg?auto=compress&cs=tinysrgb&w=400"
          ];
          // Generate exactly the same number of images as uploaded
          const imagesToGenerate = Array.from({ length: uploadedImages.length }, (_, i) => 
            mockImages[i % mockImages.length]
          );
          setGeneratedImages(imagesToGenerate);
          
          // Save generation to database and update tokens
          if (user) {
            saveGeneration(imagesToGenerate);
            updateTokens(profile!.tokens - tokensRequired);
          }
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  }, [uploadedImages.length, profile, user, navigate, updateTokens]);

  const saveGeneration = async (generatedImages: string[]) => {
    if (!user) return;
    
    try {
      await db.createGeneration({
        user_id: user.id,
        jewelry_type: selectedJewelryType,
        gender: selectedGender,
        original_images: uploadedImages,
        generated_images: generatedImages,
        settings: {
          jewelry_type: selectedJewelryType,
          gender: selectedGender,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to save generation:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isFormActive = selectedJewelryType !== "";

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleImageFocus = useCallback((index: number) => {
    setFocusedImage(index);
  }, []);

  // Handle clicking outside the generation area to clear focus
  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    // Only clear focus if clicking the background area, not on images or controls
    if (e.target === e.currentTarget) {
      setFocusedImage(null);
    }
  }, []);
  const handleSelectAll = useCallback(() => {
    if (selectedImages.size === generatedImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(generatedImages.map((_, index) => index)));
    }
  }, [selectedImages.size, generatedImages.length]);

  const handleDeleteSelected = useCallback(() => {
    setGeneratedImages(prev => prev.filter((_, index) => !selectedImages.has(index)));
    setSelectedImages(new Set());
  }, [selectedImages]);

  const handleRegenerateSelected = useCallback(() => {
    console.log("Regenerating selected images:", Array.from(selectedImages));
  }, [selectedImages]);

  const handleDownloadSelected = useCallback(() => {
    console.log("Downloading selected images:", Array.from(selectedImages));
  }, [selectedImages]);

  const handleImageDoubleClick = useCallback((index: number, src: string) => {
    setModalImage({ index, src });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalImage(null);
    setShowOriginal(false);
  }, []);

  const handleModalDownload = useCallback(() => {
    if (modalImage) {
      console.log("Downloading image:", modalImage.index);
    }
  }, [modalImage]);

  const handleModalRegenerate = useCallback(() => {
    if (modalImage) {
      console.log("Regenerating image:", modalImage.index);
      handleCloseModal();
    }
  }, [modalImage, handleCloseModal]);

  const handleModalDelete = useCallback(() => {
    if (modalImage) {
      setGeneratedImages(prev => prev.filter((_, index) => index !== modalImage.index));
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(modalImage.index);
        // Adjust indices for remaining images
        const adjustedSet = new Set<number>();
        newSet.forEach(idx => {
          if (idx > modalImage.index) {
            adjustedSet.add(idx - 1);
          } else {
            adjustedSet.add(idx);
          }
        });
        return adjustedSet;
      });
      handleCloseModal();
    }
  }, [modalImage, handleCloseModal]);

  // Get responsive grid configuration based on image count
  const getGridConfig = (imageCount: number) => {
    if (imageCount === 1) return { cols: 1, maxWidth: '400px' };
    if (imageCount === 2) return { cols: 2, maxWidth: '600px' };
    if (imageCount <= 3) return { cols: 3, maxWidth: '900px' };
    if (imageCount <= 4) return { cols: 2, maxWidth: '600px' };
    if (imageCount <= 6) return { cols: 3, maxWidth: '900px' };
    return { cols: 4, maxWidth: '1200px' };
  };

  // Fallback component for broken images
  const ImageFallback = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}>
      <X className="w-8 h-8 text-gray-400" />
    </div>
  );

  // Image component with fallback
  const SafeImage = ({ src, alt, className, ...props }: { src: string; alt: string; className?: string; [key: string]: any }) => {
    const [hasError, setHasError] = useState(false);
    
    if (hasError) {
      return <ImageFallback className={className} />;
    }
    
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        {...props}
      />
    );
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
    <div className="flex flex-col items-start relative bg-white">
      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-[90%] h-[90%] flex items-center justify-center group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <SafeImage
              src={showOriginal ? uploadedImages[modalImage.index % uploadedImages.length] : modalImage.src}
              alt={`Generated ${modalImage.index + 1}`}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Overlay Buttons - Only visible on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Top Left - Hold to View Original */}
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                className="absolute top-4 left-4 w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
              
              {/* Top Right - Action buttons (vertically stacked) */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                {/* Download */}
                <button
                  onClick={handleModalDownload}
                  className="w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
                
                {/* Regenerate */}
                <button
                  onClick={handleModalRegenerate}
                  className="w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700" />
                </button>
                
                {/* Delete */}
                <button
                  onClick={handleModalDelete}
                  className="w-10 h-10 bg-white bg-opacity-90 hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tokens Popup Overlay */}
      {showTokensPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowTokensPopup(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="font-headings-desktop-h3 text-[#151515] mb-2">
                Your Tokens
              </h3>
              <div className="text-4xl font-bold text-[#151515] mb-2">9,999</div>
              <p className="text-gray-600">tokens remaining</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Standard generation:</span>
                <span className="font-medium">10 tokens</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High quality generation:</span>
                <span className="font-medium">25 tokens</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Premium generation:</span>
                <span className="font-medium">50 tokens</span>
              </div>
            </div>
            
            <Button
              onClick={() => {
                setShowTokensPopup(false);
                navigate('/pricing');
              }}
              className="w-full bg-[#151515] hover:bg-[#2a2a2a] text-white py-3"
            >
              Get More Tokens
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative w-full h-[80px] md:h-[106px] bg-white shadow-[0px_4px_4px_#00000040] z-10">
        <div className="flex items-center justify-between h-full px-4 md:px-8 lg:px-12">
          <h1 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[32px] tracking-[-2.24px]">
            snapwear AI
          </h1>

          <div className="flex items-center gap-4 md:gap-8">
            <Button
              variant="default"
              onClick={() => setShowTokensPopup(true)}
              className="flex h-[40px] md:h-[45px] items-center gap-[10px] md:gap-[15px] p-2 md:p-3 bg-[#151515] rounded hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="relative w-[20px] h-[20px] md:w-[23px] md:h-[23px] flex items-center justify-center">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <span className="font-text-medium-20 text-white whitespace-nowrap text-sm md:text-base">
                {profile?.tokens || 0}
              </span>
            </Button>

            <div className="flex items-center gap-2 md:gap-4" data-user-dropdown>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg md:text-2xl tracking-[-1.20px] leading-[19.2px] hidden sm:block">
                    {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </span>
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-sm tracking-[-1.20px] leading-[19.2px] sm:hidden">
                    {profile?.first_name || 'User'}
                  </span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showUserDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleLogout}
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

      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-1/4 lg:min-w-[320px] lg:max-w-[400px] border-r border-gray-200 bg-white">
          <div className="flex h-full">
            {/* Tool selection sidebar */}
            <div className="flex flex-col w-[60px] items-center justify-start gap-4 py-6 bg-gray-50 border-r border-gray-200">
              <Button
                variant="default"
                className="flex w-10 h-10 items-center justify-center bg-[#151515] rounded-lg mt-2"
              >
                <Gem className="w-5 h-5 text-white" />
              </Button>
.ts
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/generations');
                }}
                className="flex w-10 h-10 items-center justify-center bg-white rounded-lg border-gray-300"
              >
                <Images className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Tool configuration panel */}
            <div className="flex-1 flex flex-col p-4">
              <div className="flex flex-col gap-5">
                <h2 className="font-headings-desktop-h3 text-[#151515]">
                  Jewelry Generator
                </h2>

                <Select
                  value={selectedJewelryType}
                  onValueChange={setSelectedJewelryType}>
                  <SelectTrigger className="w-full h-10 px-3 rounded-lg border border-[#151515]">
                    <SelectValue placeholder="Select jewelry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bracelet">Bracelet</SelectItem>
                    <SelectItem value="ring">Ring</SelectItem>
                    <SelectItem value="watch">Watch</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex flex-col gap-3">
                  <p className={`text-sm font-medium transition-colors duration-200 ${
                    isFormActive ? "text-[#151515]" : "text-gray-400"
                  }`}>
                    Upload jewelry images
                  </p>

                  <div className={`w-full rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                    isFormActive ? "border-[#151515] bg-gray-50" : "border-gray-300 bg-gray-100"
                  } h-[300px] overflow-hidden`}>
                    {uploadedImages.length > 0 ? (
                      <div className="w-full h-full p-4 overflow-y-auto" style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db #f3f4f6'
                      }}>
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedImages.map((image, index) => (
                            <div 
                              key={index} 
                              className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-200 group"
                            >
                              <SafeImage 
                                src={image} 
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-200 shadow-md z-10 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadIcon className={`w-8 h-8 mx-auto mb-2 ${isFormActive ? "text-gray-600" : "text-gray-400"}`} />
                        <p className={`text-xs ${isFormActive ? "text-gray-600" : "text-gray-400"}`}>
                          {isFormActive ? "Drop images here" : "Select jewelry type first"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    disabled={!isFormActive}
                    variant="outline"
                    className={`flex items-center justify-center gap-2 px-4 py-2 w-full rounded-lg border border-dashed transition-all duration-200 ${
                      isFormActive 
                        ? "bg-white border-[#151515] hover:bg-gray-50" 
                        : "bg-gray-100 border-gray-300 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isFormActive) {
                        // Add one new placeholder image each time
                        const placeholderImages = [
                          "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927261/pexels-photo-1927261.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927263/pexels-photo-1927263.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927264/pexels-photo-1927264.jpeg?auto=compress&cs=tinysrgb&w=200"
                        ];
                        const nextImage = placeholderImages[uploadedImages.length % placeholderImages.length];
                        setUploadedImages(prev => [...prev, nextImage]);
                      }
                    }}
                  >
                    <UploadIcon className={`w-4 h-4 ${isFormActive ? "text-black" : "text-gray-400"}`} />
                    <span className={`text-sm ${
                      isFormActive ? "text-black" : "text-gray-400"
                    }`}>
                      Browse files
                    </span>
                  </Button>
                </div>

                <div className="flex flex-col gap-3">                  
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                      onClick={() => isFormActive && setSelectedGender("male")}
                      disabled={!isFormActive}
                      className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 ${
                        selectedGender === "male" && isFormActive
                          ? "bg-[#161616] text-white" 
                          : isFormActive
                          ? "bg-white text-[#151515] hover:bg-gray-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => isFormActive && setSelectedGender("female")}
                      disabled={!isFormActive}
                      className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 border-l border-gray-300 ${
                        selectedGender === "female" && isFormActive
                          ? "bg-[#161616] text-white" 
                          : isFormActive
                          ? "bg-white text-[#151515] hover:bg-gray-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <Button
                  disabled={!isFormActive || uploadedImages.length === 0}
                  variant="default"
                  onClick={handleGenerate}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
                    isFormActive && uploadedImages.length > 0
                      ? "bg-[#151515] hover:bg-[#2a2a2a] text-white" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span className="font-medium">Generate</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-12 xl:p-16">
          {/* Mobile Sidebar - Only visible on mobile */}
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col gap-4">
                <h2 className="font-headings-desktop-h3 text-[#151515] text-xl">
                  Jewelry Generator
                </h2>

                <Select
                  value={selectedJewelryType}
                  onValueChange={setSelectedJewelryType}>
                  <SelectTrigger className="w-full h-10 px-3 rounded-lg border border-[#151515]">
                    <SelectValue placeholder="Select jewelry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bracelet">Bracelet</SelectItem>
                    <SelectItem value="ring">Ring</SelectItem>
                    <SelectItem value="watch">Watch</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex flex-col gap-3">
                  <p className={`text-sm font-medium transition-colors duration-200 ${
                    isFormActive ? "text-[#151515]" : "text-gray-400"
                  }`}>
                    Upload jewelry images
                  </p>

                  <div className={`w-full rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-200 ${
                    isFormActive ? "border-[#151515] bg-gray-50" : "border-gray-300 bg-gray-100"
                  } h-[200px] overflow-hidden`}>
                    {uploadedImages.length > 0 ? (
                      <div className="w-full h-full p-3 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-2">
                          {uploadedImages.map((image, index) => (
                            <div 
                              key={index} 
                              className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-200 group"
                            >
                              <SafeImage 
                                src={image} 
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-200 shadow-md z-10 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <UploadIcon className={`w-6 h-6 mx-auto mb-2 ${isFormActive ? "text-gray-600" : "text-gray-400"}`} />
                        <p className={`text-xs ${isFormActive ? "text-gray-600" : "text-gray-400"}`}>
                          {isFormActive ? "Drop images here" : "Select jewelry type first"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    disabled={!isFormActive}
                    variant="outline"
                    className={`flex items-center justify-center gap-2 px-4 py-2 w-full rounded-lg border border-dashed transition-all duration-200 ${
                      isFormActive 
                        ? "bg-white border-[#151515] hover:bg-gray-50" 
                        : "bg-gray-100 border-gray-300 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isFormActive) {
                        const placeholderImages = [
                          "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927261/pexels-photo-1927261.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927263/pexels-photo-1927263.jpeg?auto=compress&cs=tinysrgb&w=200",
                          "https://images.pexels.com/photos/1927264/pexels-photo-1927264.jpeg?auto=compress&cs=tinysrgb&w=200"
                        ];
                        const nextImage = placeholderImages[uploadedImages.length % placeholderImages.length];
                        setUploadedImages(prev => [...prev, nextImage]);
                      }
                    }}
                  >
                    <UploadIcon className={`w-4 h-4 ${isFormActive ? "text-black" : "text-gray-400"}`} />
                    <span className={`text-sm ${
                      isFormActive ? "text-black" : "text-gray-400"
                    }`}>
                      Browse files
                    </span>
                  </Button>
                </div>

                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => isFormActive && setSelectedGender("male")}
                    disabled={!isFormActive}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 ${
                      selectedGender === "male" && isFormActive
                        ? "bg-[#161616] text-white" 
                        : isFormActive
                        ? "bg-white text-[#151515] hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => isFormActive && setSelectedGender("female")}
                    disabled={!isFormActive}
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-all duration-200 border-l border-gray-300 ${
                      selectedGender === "female" && isFormActive
                        ? "bg-[#161616] text-white" 
                        : isFormActive
                        ? "bg-white text-[#151515] hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Female
                  </button>
                </div>

                <Button
                  disabled={!isFormActive || uploadedImages.length === 0}
                  variant="default"
                  onClick={handleGenerate}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
                    isFormActive && uploadedImages.length > 0
                      ? "bg-[#151515] hover:bg-[#2a2a2a] text-white" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span className="font-medium">Generate</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-50 rounded-xl overflow-hidden">
            {/* Fixed Toolbar */}
            {generatedImages.length > 0 && !isGenerating && (
              <div className="flex-shrink-0 flex justify-center p-4 md:p-6 lg:p-8 bg-gray-50 border-b border-gray-200">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-2 md:px-4 py-2 flex items-center gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleSelectAll}
                    className="text-xs md:text-sm font-medium text-[#161616] hover:bg-gray-100 px-2 md:px-3 py-1 rounded"
                  >
                    <span className="hidden sm:inline">
                      {selectedImages.size === generatedImages.length ? "Deselect All" : "Select All"}
                    </span>
                    <span className="sm:hidden">
                      {selectedImages.size === generatedImages.length ? "Deselect" : "Select"}
                    </span>
                  </Button>
                  
                  <div className="w-px h-3 md:h-4 bg-gray-300"></div>
                  
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownloadSelected}
                      disabled={selectedImages.size === 0}
                      className="w-7 h-7 md:w-8 md:h-8 text-[#161616] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRegenerateSelected}
                      disabled={selectedImages.size === 0}
                      className="w-7 h-7 md:w-8 md:h-8 text-[#161616] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeleteSelected}
                      disabled={selectedImages.size === 0}
                      className="w-7 h-7 md:w-8 md:h-8 text-[#161616] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 flex flex-col">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] max-h-[500px]">
                <div className="w-3/4 max-w-md">
                  <div className="mb-4 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Generating Images...</h3>
                    <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#151515] h-3 rounded-full transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div 
                className="bg-white border border-gray-200 rounded-lg shadow-sm mx-2 md:mx-4 mb-2 md:mb-4 overflow-hidden"
                style={{ 
                  minHeight: '500px', 
                  maxHeight: 'min(800px, 75vh)' 
                }}
                onClick={handleOutsideClick}
              >
                <div className="h-full overflow-y-auto py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
                  <div className="flex items-start justify-center min-h-full">
                    <div 
                      className="grid gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-center w-full"
                      style={{
                        gridTemplateColumns: window.innerWidth < 640 
                          ? 'repeat(2, 1fr)' 
                          : window.innerWidth < 1024 
                          ? 'repeat(3, 1fr)' 
                          : `repeat(${getGridConfig(generatedImages.length).cols}, 1fr)`,
                        maxWidth: window.innerWidth < 1024 ? '100%' : 
                          window.innerWidth < 1440 ? '1200px' : 
                          getGridConfig(generatedImages.length).maxWidth
                      }}
                    >
                      {generatedImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] rounded-lg shadow-sm max-w-[200px] md:max-w-[250px] lg:max-w-[300px] xl:max-w-none mx-auto"
                        >
                          <div 
                            className={`aspect-square rounded-lg overflow-hidden bg-white transition-all duration-200 cursor-pointer ${
                              focusedImage === index ? 'ring-2 ring-black' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageFocus(index);
                            }}
                            onClick={() => handleImageFocus(index)}
                            onDoubleClick={() => handleImageDoubleClick(index, image)}
                          >
                            <SafeImage
                              src={image}
                              alt={`Generated ${index + 1}`}
                              className="w-full h-full object-cover"
                              onDoubleClick={() => handleImageDoubleClick(index, image)}
                            />
                          </div>
                          
                          <div 
                            className={`absolute top-1 right-1 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                            selectedImages.has(index) 
                              ? 'bg-[#161616] border-[#161616]' 
                              : 'bg-white border-gray-300 hover:border-[#161616]'
                          }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageSelect(index);
                            }}
                          >
                            {selectedImages.has(index) && (
                              <svg className="w-3 h-3 md:w-4 md:h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                      </div>
                    </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px] max-h-[500px] md:max-h-[600px] lg:max-h-[700px] mx-2 md:mx-4 mb-2 md:mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center text-gray-500">
                  <Gem className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-6 text-gray-300" />
                  <p className="text-lg md:text-xl lg:text-2xl font-medium mb-3">No images generated yet</p>
                  <p className="text-sm md:text-base lg:text-lg px-4">Upload jewelry images and click Generate to start</p>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="w-full" />

      <footer className="flex flex-col w-full items-start pt-8 md:pt-16 pb-4 px-4 md:px-8 lg:px-20 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-8 max-w-7xl mx-auto">
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

        <div className="relative w-full max-w-7xl mx-auto h-[150px] md:h-[310px] [font-family:'DM_Sans',Helvetica] font-normal text-transparent text-[120px] md:text-[293.1px] tracking-[-14.65px] leading-[120px] md:leading-[293.1px] whitespace-nowrap overflow-hidden">
          <span className="font-medium text-[#151515] tracking-[-20px] md:tracking-[-42.95px]">
            innovati
          </span>
          <span className="[font-family:'Cormorant_Garamond',Helvetica] font-light italic text-[#151515] text-[150px] md:text-[370.9px] tracking-[-30px] md:tracking-[-68.79px] leading-[150px] md:leading-[370.9px]">
            ve
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-5 w-full max-w-7xl mx-auto border-t-2 border-[#151515] gap-4">
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