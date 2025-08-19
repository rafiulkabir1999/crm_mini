"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Created:", data);
    setLoading(false);
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
          <Textarea name="description" placeholder="Product description" />
        </div>

        <div>
          <Label>Price</Label>
          <Input name="price" type="number" step="0.01" placeholder="Price" required />
        </div>

        <div>
          <Label>Status</Label>
          <Input name="status" placeholder="active/inactive" defaultValue="active" />
        </div>

        <div>
          <Label>Images (PNG/JPG/JPEG)</Label>
          <Input name="images" type="file" accept="image/png, image/jpeg" multiple required />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
