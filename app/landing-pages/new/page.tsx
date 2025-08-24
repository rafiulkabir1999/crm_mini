"use client";
import { useState, useEffect } from "react";

type Product = { id: string; name: string };
type LandingPage = {
  id: string;
  name: string;
  url: string;
  description?: string;
  products: { productId: string }[];
};

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Load userId from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/landing-pages`)
      .then((res) => res.json())
      .then(setPages);

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, [userId]);

  const addPage = async () => {
    if (!userId) return alert("User not found");

    const res = await fetch("/api/landing-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, description, productIds: selectedProducts, userId }),
    });

    const page = await res.json();
    setPages((prev) => [...prev, page]);

    setName("");
    setUrl("");
    setDescription("");
    setSelectedProducts([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Landing Pages</h1>

      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          multiple
          className="border p-2 mr-2"
          value={selectedProducts}
          onChange={(e) =>
            setSelectedProducts(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addPage}>
          Add Page
        </button>
      </div>

      <div>
        {pages.map((p) => (
          <div key={p.id} className="border p-4 mb-2">
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.url}</p>
            <p>{p.description}</p>
            <p>Products: {p.products.map((pr) => pr.productId).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
