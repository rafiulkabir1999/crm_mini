"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  images: ProductImage[];
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id} className="border shadow-sm">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
                No Image
              </div>
            )}
            <p className="text-sm text-gray-700">{product.description}</p>
            <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{product.status}</p>
            <Button className="mt-2 w-full">View</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
