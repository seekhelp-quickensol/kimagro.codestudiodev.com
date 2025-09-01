import React, { useState } from "react";
import PhotoAlbum, { Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Play } from "lucide-react";
import { useMedia, useMediaByCategory } from "../hooks/useMedia";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

// Define interfaces for media and category data
interface MediaItem {
  id: string | number;
  type: "photos" | "videos" | "news";
  src: string;
  thumb?: string;
  width?: number;
  height?: number;
  title_english?: string;
  title_hindi?: string;
  description_english?: string;
  description_hindi?: string;
}

interface Category {
  id: string | number;
  type: string;
  title_english: string;
  title_hindi: string;
}

// Define types for the custom hooks
interface UseMediaResult {
  mediaData: {
    categories: Category[];
  };
  loading: boolean;
  error: string | null;
  refetch: (tab: string) => void;
}

interface UseMediaByCategoryResult {
  categoryMedia: MediaItem[];
  loading: boolean;
  fetchCategoryMedia: (categoryId: string | number) => Promise<void>;
}

// Define types for react-photo-album and yet-another-react-lightbox
interface PhotoAlbumPhoto {
  src: string;
  width: number;
  height: number;
}

export default function Media() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [index, setIndex] = useState<number>(-1);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const { t } = useTranslation();

  const currentLang = i18n.language;

  // Static tabs array - always show all tabs
  const tabs: string[] = ["All", "photos", "videos"];
  const hindiLabels: string[] = ["सभी", "तस्वीरें", "वीडियो"];

  const { mediaData, loading, error, refetch } = useMedia(
    activeTab
  ) as UseMediaResult;
  const {
    categoryMedia,
    loading: categoryLoading,
    fetchCategoryMedia,
  } = useMediaByCategory() as UseMediaByCategoryResult;

  // Filter categories based on current tab
  const filteredCategories: Category[] =
    activeTab === "All"
      ? mediaData.categories
      : mediaData.categories.filter((cat) => cat.type === activeTab);

  // Get media items for selected category
  const selectedCategoryMedia: MediaItem[] = selectedCategory
    ? categoryMedia
    : [];

  // Separate media types
  const imageMedia: PhotoAlbumPhoto[] = selectedCategoryMedia
    .filter((item) => item.type === "photos")
    .map((item) => ({
      src: `${import.meta.env.VITE_APP_BACKEND}uploads/images/${item.src}`,
      width: 300, // Provide default values to avoid type errors
      height: 300,
    }));

  const newsMedia: MediaItem[] = selectedCategoryMedia.filter(
    (item) => item.type === "news"
  );

  const videoMedia: MediaItem[] = selectedCategoryMedia.filter(
    (item) => item.type === "videos"
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setPlayingVideo(null);
    refetch(tab);
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    await fetchCategoryMedia(category.id);
    setPlayingVideo(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setPlayingVideo(null);
  };

  if (loading && !selectedCategory) {
    return (
      <div className="bg-white py-8 px-4 md:px-20">
        <div className="container mx-auto px-4 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading media...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-8 px-4 md:px-20">
        <div className="container mx-auto px-4 min-h-[600px] flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Error loading media: {error}</p>
            <button
              onClick={() => refetch(activeTab)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-4 md:px-20">
      <div className="container mx-auto px-4 md:min-h-[600px] lg:min-h-[600px]">
        {/* Tabs */}
        <div className="flex justify-center space-x-6 border-b border-gray-300 pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-1 text-sm md:text-base capitalize ${
                activeTab === tab
                  ? "font-semibold border-b-2 border-black"
                  : "text-gray-500"
              }`}>
              {currentLang === "hi" ? hindiLabels[index] : tab}
            </button>
          ))}
        </div>

        {/* Back Button */}
        {selectedCategory && (
          <div className="my-6">
            <button
              onClick={handleBackToCategories}

              className="flex items-center text-green hover:text-green-800 font-medium"
            >
               <span className="text-lg text-green me-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg></span>{" "} Back to Categories

            </button>
          </div>
        )}

        {/* Categories */}
        {!selectedCategory && (
          <div className="my-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="bg-[#CFF24D] text-black px-6 py-4 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all">
                {currentLang === "hi"
                  ? category.title_hindi
                  : category.title_english}
              </button>
            ))}

            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">

               {t("tabs.noData")}

              </div>
            )}
          </div>
        )}

        {/* Loading for category media */}
        {selectedCategory && categoryLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-600">  {t("tabs.loading")}</p>
          </div>
        )}

        {/* Media Grid */}
        {selectedCategory && !categoryLoading && (
          <div className="my-12 space-y-12">
            {/* Images with Lightbox */}
            {imageMedia.length > 0 && (
              <>
                <PhotoAlbum
                  layout="rows"
                  spacing={8} // optional: controls gap between images
                  targetRowHeight={180}
                  photos={imageMedia}
                  onClick={({ index }: { index: number }) => setIndex(index)}
                />

                <Lightbox
                  slides={imageMedia}
                  open={index >= 0}
                  index={index}
                  close={() => setIndex(-1)}
                  plugins={[Fullscreen, Zoom]}
                />
              </>
            )}

            {/* Videos with Card layout */}
            {videoMedia.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videoMedia.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl shadow-md overflow-hidden bg-gray-50">
                    <div className="relative w-full h-56 bg-black flex items-center justify-center">
                      {playingVideo === item.src ? (
                        <video
                          src={`${
                            import.meta.env.VITE_APP_BACKEND
                          }uploads/videos/${item.src}`}
                          className="w-full h-full object-contain"
                          controls
                          autoPlay
                          title="media-video"
                        />
                      ) : (
                        <>
                          {item.thumb && (
                            <img
                              src={`${
                                import.meta.env.VITE_APP_BACKEND
                              }uploads/images/${item.thumb}`}
                              alt="video-thumb"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            onClick={() => setPlayingVideo(item.src)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                            <Play size={48} />
                          </button>
                        </>
                      )}
                    </div>
                    {(item.description_english || item.description_hindi) && (
                      <div className="p-4">
                        <p className="text-sm font-medium">
                          {currentLang === "hi"
                            ? item.description_hindi || item.description_english
                            : item.description_english ||
                              item.description_hindi}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* News with Card layout */}
            {newsMedia.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {newsMedia.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl shadow-md overflow-hidden bg-gray-50">
                    {item.thumb && (
                      <div className="w-full h-56 bg-gray-200">
                        <img
                          src={`${
                            import.meta.env.VITE_APP_BACKEND
                          }uploads/images/${item.thumb}`}
                          alt="news-thumb"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {(item.title_english || item.title_hindi) && (
                        <h3 className="text-lg font-semibold mb-2">
                          {currentLang === "hi"
                            ? item.title_hindi || item.title_english
                            : item.title_english || item.title_hindi}
                        </h3>
                      )}
                      {(item.description_english || item.description_hindi) && (
                        <p
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html:
                              currentLang === "hi"
                                ? item.description_hindi ||
                                  item.description_english ||
                                  ""
                                : item.description_english ||
                                  item.description_hindi ||
                                  "",
                          }}
                        />
                      )}

                      {item.src && (
                        <a
                          href={item.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">
                          Read More
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No media found */}
            {selectedCategoryMedia.length === 0 && !categoryLoading && (
              <div className="text-center py-12 text-gray-500">
                No media found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
