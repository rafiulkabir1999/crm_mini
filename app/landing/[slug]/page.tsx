"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, MapPin, Phone, Mail, CheckCircle } from "lucide-react"
import { useParams } from "next/navigation"

// Mock landing page data
const mockLandingPage = {
  name: "Premium Software Solution",
  coverPhoto: "/placeholder-cover.jpg",
  profilePhoto: "/placeholder-profile.jpg",
  caption: "Transform your business with our revolutionary software solution",
  brandInfo: "We are a leading technology company dedicated to innovation and customer satisfaction. Our team of experts has been developing cutting-edge solutions for over 10 years.",
  productName: "Enterprise Software Suite",
  productImage: "/placeholder-product.jpg",
  productDescription: "Our flagship software suite offers comprehensive tools for business management, including CRM, project management, analytics, and automation features. Designed for modern businesses looking to streamline their operations.",
  price: 299.99,
  showQuantity: true,
  showAddress: true,
  footerText: "© 2024 TechCorp. All rights reserved."
}

export default function LandingPageViewer() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { ...formData, quantity })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been submitted successfully. We'll contact you soon to confirm your details.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Photo Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{mockLandingPage.name}</h1>
            <p className="text-xl md:text-2xl opacity-90">{mockLandingPage.caption}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl font-semibold">
              {mockLandingPage.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{mockLandingPage.name}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{mockLandingPage.brandInfo}</p>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{mockLandingPage.productName}</h3>
            <p className="text-lg text-gray-600 mb-6">{mockLandingPage.productDescription}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-green-600">
                ${mockLandingPage.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">(4.9/5 - 127 reviews)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free lifetime updates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Place Your Order</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              {mockLandingPage.showAddress && (
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
              )}

              {mockLandingPage.showQuantity && (
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 text-center text-lg font-semibold"
                      min="1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price per item:</span>
                    <span>${mockLandingPage.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(mockLandingPage.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${(mockLandingPage.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Place Order - ${(mockLandingPage.price * quantity).toFixed(2)}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center">
          <p className="text-gray-600 mb-4">{mockLandingPage.footerText}</p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contact@techcorp.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>123 Tech Street, Silicon Valley, CA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
