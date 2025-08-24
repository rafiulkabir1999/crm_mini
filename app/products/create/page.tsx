"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { productservice } from "@/lib/services/product-service";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Read user ID from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert("User not logged in");
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Convert FormData to plain object
    const productData: any = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),

      // 👇 handle relation correctly
      owners: [
        { userId }, // productservice will send this as nested create
      ],

      // Convert uploaded files into image objects
      images: (formData.getAll("images") as File[]).map((file) => ({
        url: URL.createObjectURL(file), // for now, fake URL (replace with actual upload URL later)
      })),
    };

    try {
      const newProduct = await productservice.createProduct(productData);
      console.log("✅ Created Product:", newProduct);
      form.reset();
    } catch (err) {
      console.error("❌ Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" placeholder="Product name" required />
        </div>

        <div>
          <Label>Description</Label>
          <Input name="description" placeholder="Description" />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            required
          />
        </div>

        <div>
          <Label>Images (PNG/JPG/JPEG)</Label>
          <Input
            name="images"
            type="file"
            accept="image/png, image/jpeg"
            multiple
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
