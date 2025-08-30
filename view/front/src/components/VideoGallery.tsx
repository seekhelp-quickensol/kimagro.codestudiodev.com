import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Play } from "lucide-react"; // Assuming you're using Lucide icons


export interface VideoGalleryProps {
        id: number;
        type: "video" | "image"; // Extendable if needed
        src: string;
        thumb: string | null;
        width: number;
        height: number;
        description_english: string;
        description_hindi: string;
        category_name_english: string;
        category_name_hindi: string;
}
      

export default function VideoGallery({ newsMedia }: { newsMedia: VideoGalleryProps[] }) {
    console.log("VideoGallery newsMedia:", newsMedia);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");

  const handleOpenVideo = (src:string) => {
    setSelectedVideoSrc(`${import.meta.env.VITE_APP_BACKEND}uploads/videos/${src}`);
    setOpenLightbox(true);
  };

  return (
    <>
      {newsMedia.map((item) => (
        <div
          key={item.id}
          className="rounded-xl shadow-md overflow-hidden bg-gray-50"
        >
          <div className="relative w-full h-56 bg-black flex items-center justify-center">
            {item.thumb && (
              <img
                src={item.thumb}
                alt="video-thumb"
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => handleOpenVideo(item.src)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
            >
              <Play size={48} />
            </button>
          </div>
        </div>
      ))}

      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        plugins={[Fullscreen, Zoom]}
        slides={[
          {
            type: "image",
            src: selectedVideoSrc,
            width: 1280,
            height: 720,
          
          },
        ]}
      />
    </>
  );
};