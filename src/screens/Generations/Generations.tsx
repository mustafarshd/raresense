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
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
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
  const { user, profile, signOut } = useAuth();
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Date Created");
  const [focusedImageId, setFocusedImageId] = useState<number | null>(null);

  // Load user generations
  useEffect(() => {
    const loadGenerations = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await db.getUserGenerations(user.id);
        if (!error && data) {
          // Transform database data to match component expectations
          const transformedData = data.map((gen, index) => ({
            id: index + 1,
            image: gen.generated_images[0] || '',
            originalImage: gen.original_images[0] || '',
            jewelryType: gen.jewelry_type,
            gender: gen.gender,
            timestamp: new Date(gen.created_at).toLocaleString(),
            tags: [] // Could be extracted from settings if needed
          }));
          setGenerations(transformedData);
        }
      } catch (error) {
        console.error('Failed to load generations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenerations();
  }, [user]);

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
    signOut();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-20 lg:h-[106px]">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">JewelryAI</span>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              <Gem className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{profile?.tokens || 0} tokens</span>
              <span className="sm:hidden">{profile?.tokens || 0}</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {profile?.first_name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900 hidden sm:inline">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
              </span>
              <span className="text-sm font-medium text-gray-900 sm:hidden">
                {profile?.first_name || 'User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-1 sm:p-2"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Generations</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage your AI-generated jewelry designs</p>
        </div>

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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 sm:mt-20 lg:mt-24">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">JewelryAI</span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Create stunning jewelry designs with the power of artificial intelligence.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">Dashboard</a></li>
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">Generations</a></li>
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">API Docs</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Stay Updated</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Get the latest updates and features.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="flex-1 text-sm"
                />
                <Button size="sm" className="text-sm">Subscribe</Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 sm:my-10 lg:my-12" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500">
              © 2025 JewelryAI. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};