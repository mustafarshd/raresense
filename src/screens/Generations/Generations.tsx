import { 
  ChevronDownIcon, 
  InstagramIcon, 
  Download, 
  RotateCcw, 
  Trash2,
  Gem,
  Eye,
  Images,
  Search,
  LogOut
} from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";

// Mock data for previous generations
const mockGenerations = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Bracelet",
    gender: "male",
    timestamp: "2025-01-14 10:30 AM",
    tags: ["gold", "chain", "luxury"]
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927260/pexels-photo-1927260.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Ring",
    gender: "female",
    timestamp: "2025-01-14 09:15 AM", 
    tags: ["diamond", "engagement", "silver"]
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1927261/pexels-photo-1927261.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927261/pexels-photo-1927261.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Watch",
    gender: "male",
    timestamp: "2025-01-13 04:45 PM",
    tags: ["leather", "classic", "brown"]
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927262/pexels-photo-1927262.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Bracelet",
    gender: "female",
    timestamp: "2025-01-13 02:20 PM",
    tags: ["pearl", "elegant", "white"]
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/1927263/pexels-photo-1927263.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927263/pexels-photo-1927263.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Ring",
    gender: "male",
    timestamp: "2025-01-12 11:10 AM",
    tags: ["titanium", "modern", "black"]
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1927264/pexels-photo-1927264.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927264/pexels-photo-1927264.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Watch",
    gender: "female",
    timestamp: "2025-01-12 08:30 AM",
    tags: ["rose gold", "luxury", "swiss"]
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/1927265/pexels-photo-1927265.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927265/pexels-photo-1927265.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Bracelet",
    gender: "male",
    timestamp: "2025-01-11 03:15 PM",
    tags: ["steel", "sport", "durable"]
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/1927266/pexels-photo-1927266.jpeg?auto=compress&cs=tinysrgb&w=400",
    originalImage: "https://images.pexels.com/photos/1927266/pexels-photo-1927266.jpeg?auto=compress&cs=tinysrgb&w=200",
    jewelryType: "Ring",
    gender: "female",
    timestamp: "2025-01-11 01:00 PM",
    tags: ["emerald", "vintage", "gold"]
  }
];

export const Generations = (): JSX.Element => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date Created");
  const [focusedImageId, setFocusedImageId] = useState<number | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Load mock generations
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setGenerations(mockGenerations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter generations based on search term
  const filteredGenerations = generations.filter(generation =>
    generation.jewelryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    generation.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    generation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group generations by date
  const groupGenerationsByDate = (generations: typeof generations) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: typeof mockGenerations } = {};

    generations.forEach(generation => {
      const genDate = new Date(generation.timestamp);
      let dateKey: string;

      if (genDate.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (genDate.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = genDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(generation);
    });

    return groups;
  };

  // Sort generations based on selected criteria
  const sortedGenerations = React.useMemo(() => {
    let sorted = [...filteredGenerations];
    
    switch (sortBy) {
      case "Date Created":
        sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "Jewelry Type":
        sorted.sort((a, b) => a.jewelryType.localeCompare(b.jewelryType));
        break;
      case "Gender":
        sorted.sort((a, b) => a.gender.localeCompare(b.gender));
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredGenerations, sortBy]);

  const groupedGenerations = React.useMemo(() => {
    if (sortBy === "Date Created") {
      return groupGenerationsByDate(sortedGenerations);
    }
    return null;
  }, [sortedGenerations, sortBy]);

  const handleImageSelect = useCallback((id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedImages.length === filteredGenerations.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredGenerations.map(gen => gen.id));
    }
  }, [selectedImages.length, filteredGenerations]);

  const handleDownload = useCallback(() => {
    console.log("Downloading selected images:", selectedImages);
  }, [selectedImages]);

  const handleDelete = useCallback(() => {
    console.log("Deleting selected images:", selectedImages);
    // TODO: Implement actual deletion from database
    setSelectedImages([]);
  }, [selectedImages]);

  const handleImageDoubleClick = useCallback((generation: typeof generations[0]) => {
    navigate('/picture-expanded', { 
      state: { 
        image: generation.image,
        originalImage: generation.originalImage,
        jewelryType: generation.jewelryType,
        gender: generation.gender,
        timestamp: generation.timestamp,
        tags: generation.tags
      }
    });
  }, [navigate]);

  const handleImageFocus = useCallback((id: number) => {
    setFocusedImageId(id);
  }, []);

  const handleImageBlur = useCallback(() => {
    setFocusedImageId(null);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const renderGenerationCard = (generation: typeof generations[0], showFullTimestamp = false) => (
    <div
      key={generation.id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer relative group"
      onDoubleClick={() => handleImageDoubleClick(generation)}
      onFocus={() => handleImageFocus(generation.id)}
      onBlur={handleImageBlur}
      tabIndex={0}
    >
      {/* Selection Circle */}
      <div 
        className={`absolute top-6 right-6 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer z-10 transition-all duration-200 ${
          selectedImages.includes(generation.id)
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleImageSelect(generation.id);
        }}
      >
        {selectedImages.includes(generation.id) && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="bg-gray-50 rounded-md mb-3 overflow-hidden">
        <img
          src={generation.image}
          alt={`${generation.jewelryType} for ${generation.gender}`}
          className="w-full h-32 sm:h-40 md:h-48 object-cover"
        />
      </div>

      {/* Generation Info */}
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{generation.jewelryType}</h3>
        <p className="text-xs sm:text-sm text-gray-500 capitalize">{generation.gender}</p>
        <p className="text-xs text-gray-400">
          {showFullTimestamp ? generation.timestamp : new Date(generation.timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-start relative bg-white">
      {/* Header */}
      <header className="relative w-full h-[80px] md:h-[106px] bg-white shadow-[0px_4px_4px_#00000040] z-10">
        <div className="flex items-center justify-between h-full">
          <h1 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[32px] tracking-[-2.24px]">
            snapwear AI
          </h1>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="default"
              className="flex h-[40px] md:h-[45px] items-center gap-[10px] md:gap-[15px] p-2 md:p-3 bg-[#151515] rounded hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="relative w-[20px] h-[20px] md:w-[23px] md:h-[23px] flex items-center justify-center">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <span className="font-text-medium-20 text-white whitespace-nowrap text-sm md:text-base">
                9,999
              </span>
            </Button>

            <div className="flex items-center gap-2 md:gap-4" data-user-dropdown>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg md:text-2xl tracking-[-1.20px] leading-[19.2px] hidden sm:block">
                    John Doe
                  </span>
                  <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-sm tracking-[-1.20px] leading-[19.2px] sm:hidden">
                    John
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
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className="flex w-10 h-10 items-center justify-center bg-white rounded-lg border-gray-300"
              >
                <Gem className="w-5 h-5 text-gray-600" />
              </Button>

              <Button
                variant="default"
                className="flex w-10 h-10 items-center justify-center bg-[#151515] rounded-lg mt-2"
                onClick={() => navigate('/')}
              >
                <Gem className="w-5 h-5 text-white" />
              </Button>
            </div>

            {/* Tool configuration panel */}
            <div className="flex-1 flex flex-col p-4">
              <div className="flex flex-col gap-5">
                <h2 className="font-headings-desktop-h3 text-[#151515]">
                  Your Generations
                </h2>
                <p className="text-sm text-gray-600">View and manage your AI-generated jewelry designs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-12 xl:p-16">
          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search generations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Sort */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 sm:items-center">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Date Created">Date Created</SelectItem>
                    <SelectItem value="Jewelry Type">Jewelry Type</SelectItem>
                    <SelectItem value="Gender">Gender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs sm:text-sm"
                >
                  {selectedImages.length === filteredGenerations.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Download ({selectedImages.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Delete ({selectedImages.length})
                </Button>
              </div>
            )}
          </div>

          {/* Generations Grid */}
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#151515] mx-auto mb-4"></div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-500">Loading your generations...</p>
            </div>
          ) : filteredGenerations.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Images className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 mb-3">No generations found</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start creating some jewelry designs to see them here.'}
              </p>
            </div>
          ) : groupedGenerations ? (
            // Grouped by date view
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {Object.entries(groupedGenerations)
                .sort(([a], [b]) => {
                  // Sort date groups: Today, Yesterday, then chronologically
                  if (a === "Today") return -1;
                  if (b === "Today") return 1;
                  if (a === "Yesterday") return -1;
                  if (b === "Yesterday") return 1;
                  return new Date(b).getTime() - new Date(a).getTime();
                })
                .map(([dateLabel, generations]) => (
                  <div key={dateLabel}>
                    <div className="flex items-center mb-6 sm:mb-8 lg:mb-10">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{dateLabel}</h2>
                      <div className="flex-1 h-px bg-gray-200 ml-6"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                      {generations.map(generation => renderGenerationCard(generation, false))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            // Regular grid view
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {sortedGenerations.map(generation => renderGenerationCard(generation, true))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Separator className="w-full" />

      <footer className="flex flex-col w-full items-start pt-8 md:pt-16 pb-4 px-4 md:px-8 lg:px-20 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-8 max-w-7xl mx-auto">
          <h2 className="[font-family:'DM_Sans',Helvetica] font-bold text-[#151515] text-[32px] md:text-[50.3px] tracking-[-3.52px]">
            snapwear AI
          </h2>

          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {["About", "Contact", "Support"].map((link, index) => (
              <Button key={index} variant="link" className="p-0 h-auto">
                <span className="[font-family:'DM_Sans',Helvetica] font-medium text-[#151515] text-lg md:text-2xl tracking-[-1.20px] leading-[19.2px]">
                  {link}
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
            {["Terms & Conditions", "Privacy Policy", "Cookies"].map((link, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Separator orientation="vertical" className="h-4 md:h-5 hidden sm:block" />
                )}
                <Button variant="link" className="p-0 h-auto">
                  <span className="[font-family:'DM_Sans',Helvetica] font-normal text-[#151515] text-xs md:text-sm leading-[19.9px]">
                    {link}
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