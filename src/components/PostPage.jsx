import { useState } from "react";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
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
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
      </form>

      {submitted && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-2">{content}</p>
          {image && (
            <img src={image} alt="Post preview" className="mt-4 rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
};

export default PostPage;
