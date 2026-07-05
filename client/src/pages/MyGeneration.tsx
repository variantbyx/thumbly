import React, { useEffect, useState } from "react";
import SoftBackDrop from "../components/SoftBackdrop";
import type { IThumbnail } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { apiFetch } from "../config/api";

const MyGeneration = () => {
  const navigate = useNavigate();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };
  
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchThumbnails = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/user/thumbnails", { method: "GET" });
      if (data.thumbnails) {
        setThumbnails(data.thumbnails);
      }
    } catch (error) {
      console.error("Failed fetching user thumbnails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (image_url: string) => {
    if (!image_url) return;
    window.open(image_url, "_blank");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this thumbnail?")) return;
    try {
      setDeletingId(id);
      await apiFetch(`/thumbnail/${id}`, { method: "DELETE" });
      setThumbnails((prev) => prev.filter((thumb) => thumb._id !== id));
    } catch (error: any) {
      console.error("Failed to delete thumbnail:", error);
      alert(error.message || "Failed to delete thumbnail");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchThumbnails();
  }, []);

  return (
    <>
      <SoftBackDrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 text-text-primary">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">My Generations</h1>
            <p className="text-sm text-text-secondary mt-1">
              View and manage all your AI-generated thumbnails
            </p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 self-start transition-all"
          >
            <SparklesIcon size={14} />
            Generate New
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface/30 border border-slate-800 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && thumbnails.length === 0 && (
          <div className="text-center py-28 bg-surface/20 border border-dashed border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-text-primary">
              No thumbnails yet
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              Generate your first thumbnail with AI to see it here!
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-xs font-semibold"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* GRID */}
        {!loading && thumbnails.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {thumbnails.map((thumb: IThumbnail) => {
              const aspectClass =
                aspectRatioClassMap[thumb.aspect_ratio || "16:9"] || "aspect-video";
              const isDeleting = deletingId === thumb._id;

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="group relative cursor-pointer rounded-2xl bg-surface/30 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 shadow-xl overflow-hidden flex flex-col hover:-translate-y-0.5"
                >
                  {/* IMAGE */}
                  <div
                    className={`relative overflow-hidden ${aspectClass} bg-slate-950 flex items-center justify-center`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-xs text-text-secondary p-4 bg-slate-950">
                        {thumb.isGenerating ? (
                          <>
                            <Loader2Icon className="size-6 animate-spin text-primary mb-2" />
                            <span className="animate-pulse">Generating image...</span>
                          </>
                        ) : (
                          "No image generated"
                        )}
                      </div>
                    )}

                    {thumb.isGenerating && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-xs font-semibold text-white gap-2">
                        <Loader2Icon className="size-5 animate-spin text-primary" />
                        <span className="animate-pulse">Generating...</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-slate-900/30">
                    <h3 className="text-xs font-bold text-text-primary line-clamp-2 leading-relaxed text-left">
                      {thumb.title}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-text-secondary border border-slate-700">
                          {thumb.style}
                        </span>
                        {thumb.color_scheme && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-text-secondary border border-slate-700 capitalize">
                            {thumb.color_scheme}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-text-secondary border border-slate-700">
                          {thumb.aspect_ratio}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary/60 text-left">
                        {thumb.createdAt ? new Date(thumb.createdAt).toDateString() : ""}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons visible on hover */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <button
                      onClick={() => handleDelete(thumb._id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg bg-background/80 hover:bg-danger text-text-primary hover:text-white transition-all cursor-pointer backdrop-blur border border-slate-800"
                      title="Delete Thumbnail"
                    >
                      {isDeleting ? (
                        <Loader2Icon className="size-3.5 animate-spin" />
                      ) : (
                        <TrashIcon className="size-3.5" />
                      )}
                    </button>

                    {thumb.image_url && (
                      <>
                        <button
                          onClick={() => handleDownload(thumb.image_url!)}
                          className="p-1.5 rounded-lg bg-background/80 hover:bg-primary text-text-primary hover:text-white transition-all cursor-pointer backdrop-blur border border-slate-800"
                          title="Download Image"
                        >
                          <DownloadIcon className="size-3.5" />
                        </button>
                        <Link
                          target="_blank"
                          to={`/preview?thumbnail_url=${encodeURIComponent(thumb.image_url)}&title=${encodeURIComponent(thumb.title)}`}
                          className="p-1.5 rounded-lg bg-background/80 hover:bg-secondary text-text-primary hover:text-white transition-all cursor-pointer backdrop-blur border border-slate-800"
                          title="Preview on YouTube Layout"
                        >
                          <ArrowUpRightIcon className="size-3.5" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGeneration;
