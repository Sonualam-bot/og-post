import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [ogImage, setOgImage] = useState("");
  const postRef = useRef(null);
  const [likes, setLikes] = useState(0);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleGenerateOgImage = async () => {
    if (postRef.current) {
      const originalStyles = {
        position: postRef.current.style.position,
        width: postRef.current.style.width,
        height: postRef.current.style.height,
        overflow: postRef.current.style.overflow,
        transform: postRef.current.style.transform,
        transformOrigin: postRef.current.style.transformOrigin,
      };

      postRef.current.style.position = "relative";
      postRef.current.style.width = "1200px";
      postRef.current.style.height = "630px";
      postRef.current.style.overflow = "hidden";
      postRef.current.style.transform = "scale(1)";
      postRef.current.style.transformOrigin = "top left";

      const dataUrl = await toPng(postRef.current);

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 1200;
        canvas.height = 630;
        ctx.drawImage(img, 0, 0, 1200, 630);
        const resizedDataUrl = canvas.toDataURL("image/png");
        setOgImage(resizedDataUrl);
      };

      // to restore original styles
      Object.assign(postRef.current.style, originalStyles);
    }
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  useEffect(() => {
    if (ogImage) {
      const meta = document.querySelector('meta[property="og:image"]');
      if (meta) {
        meta.setAttribute("content", ogImage);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("property", "og:image");
        newMeta.setAttribute("content", ogImage);
        document.head.appendChild(newMeta);
      }
    }
  }, [ogImage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        <form onSubmit={handleSubmit} className="flex flex-col mb-6">
          <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block font-semibold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-semibold mb-2">
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block font-semibold mb-2">
              Image (optional):
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 mb-4"
          >
            Post
          </button>
        </form>
      </div>

      {submitted && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg my-6 flex flex-col items-center w-full">
          <div
            ref={postRef}
            className="w-full aspect-[1200/630] max-w-[1200px] mx-auto p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="mb-4">{content}</p>
            {image && (
              <img
                src={image}
                alt="Post preview"
                className="w-full h-[70%] rounded-lg object-cover mb-4"
              />
            )}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 15l-7-7-7 7" />
                </svg>
                <span>Comment</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleGenerateOgImage}
            className="w-full max-w-[1200px] py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 mt-4"
          >
            Generate og:image
          </button>
        </div>
      )}

      {ogImage && (
        <div className="bg-gray-800 py-4 rounded-lg shadow-lg mt-6 flex flex-col items-center w-full">
          <h3 className="text-2xl font-bold mb-4 text-center text-white">
            Generated og:image
          </h3>
          <div className="w-full max-w-[1200px] aspect-[1200/630]">
            <img
              src={ogImage}
              alt="Open Graph Image"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>

          <a
            href={ogImage}
            download="og-image.png"
            className="w-full max-w-[1200px] block text-center py-2 mt-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
          >
            Download og:image
          </a>
        </div>
      )}
    </div>
  );
};

export default PostPage;
