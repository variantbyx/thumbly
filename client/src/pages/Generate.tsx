import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets";
import SoftBackDrop from "../components/SoftBackDrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { apiFetch } from "../config/api";
import { AlertCircleIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react";

const Generate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setThumbnail(null);
    try {
      const data = await apiFetch("/thumbnail/generate", {
        method: "POST",
        bodyData: {
          title,
          prompt: additionalDetails,
          style,
          aspect_ratio: aspectRatio,
          color_scheme: colorSchemeId,
          text_overlay: false,
        },
      });
      if (data.thumbnail) {
        setThumbnail(data.thumbnail);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate thumbnail with AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    if (id) {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await apiFetch(`/user/thumbnail/${id}`, { method: "GET" });
        if (data.thumbnail) {
          const thumb = data.thumbnail;
          setThumbnail(thumb);
          setAdditionalDetails(thumb.user_prompt || "");
          setTitle(thumb.title);
          if (thumb.color_scheme) setColorSchemeId(thumb.color_scheme);
          if (thumb.aspect_ratio) setAspectRatio(thumb.aspect_ratio as AspectRatio);
          if (thumb.style) setStyle(thumb.style as ThumbnailStyle);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Failed to retrieve this thumbnail.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchThumbnail();
    } else {
      // Clear form for new generation
      setTitle("");
      setAdditionalDetails("");
      setThumbnail(null);
      setLoading(false);
      setErrorMsg(null);
    }
  }, [id]);

  return (
    <>
      <SoftBackDrop />
      <div className="pt-24 min-h-screen bg-background text-text-primary">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          
          {id && (
            <button
              onClick={() => navigate("/my-generation")}
              className="flex items-center gap-2 mb-6 text-xs text-text-secondary hover:text-primary transition-colors font-medium bg-slate-800/40 border border-slate-800 px-3.5 py-1.5 rounded-full"
            >
              <ArrowLeftIcon size={14} />
              Back to Generations
            </button>
          )}

          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id ? "pointer-events-none opacity-80" : ""}`}>
              <div className="p-6 rounded-2xl bg-surface/40 border border-slate-800 backdrop-blur-md shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-1">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>
                
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs text-left">
                    <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                    <p className="font-medium">{errorMsg}</p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* TITLE INPUT */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Title or Topic
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        placeholder="e.g., 10 Tips for Better Sleep"
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-text-primary placeholder:text-text-secondary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                      <div className="flex justify-end">
                        <span className="text-[10px] text-text-secondary">
                          {title.length}/100
                        </span>
                      </div>
                    </div>

                    {/* AspectRatioSelector */}
                    <AspectRatioSelector
                      value={aspectRatio}
                      onChange={setAspectRatio}
                    />

                    {/* StyleSelector */}
                    <StyleSelector
                      value={style}
                      onChange={setStyle}
                      isOpen={styleDropdownOpen}
                      setIsOpen={setStyleDropdownOpen}
                    />

                    {/* ColorSchemeSelector */}
                    <ColorSchemeSelector
                      value={colorSchemeId}
                      onChange={setColorSchemeId}
                    />

                    {/* DETAILS */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Additional Prompts{" "}
                        <span className="text-text-secondary/60 text-[10px] lowercase italic">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        rows={3}
                        placeholder="Add any specific elements, mood, or style preferences..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-text-primary placeholder:text-text-secondary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !title.trim()}
                    className="w-full py-3.5 rounded-xl font-bold bg-primary hover:bg-primary/95 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  >
                    <SparklesIcon size={16} className={loading ? "animate-spin" : ""} />
                    {loading ? "Generating with Gemini..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div>
              <div className="p-6 rounded-2xl bg-surface/40 border border-slate-800 backdrop-blur-md shadow-xl">
                <h2 className="text-lg font-bold text-text-primary mb-4 text-left">
                  Preview
                </h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
