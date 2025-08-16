"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Image, Upload, Eye, Save, Settings, ArrowLeft } from "lucide-react"
import { LandingPagePreview } from "@/components/landing-page/landing-page-preview"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"

interface LandingPageData {
  name: string
  coverPhoto: string
  profilePhoto: string
  caption: string
  brandInfo: string
  productName: string
  productImage: string
  productDescription: string
  price: number
  showQuantity: boolean
  showAddress: boolean
  footerText: string
}

export default function CreateLandingPage() {
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    name: "My Amazing Product",
    coverPhoto: "/placeholder-cover.jpg",
    profilePhoto: "/placeholder-profile.jpg",
    caption: "Transform your business with our revolutionary solution",
    brandInfo: "We are a leading company dedicated to innovation and customer satisfaction.",
    productName: "Premium Product",
    productImage: "/placeholder-product.jpg",
    productDescription: "Our flagship product offers cutting-edge features that will revolutionize your workflow.",
    price: 99.99,
    showQuantity: true,
    showAddress: true,
    footerText: "© 2024 My Company. All rights reserved."
  })

  const [activeTab, setActiveTab] = useState("content")

  const handleInputChange = (field: keyof LandingPageData, value: string | number | boolean) => {
    setLandingPageData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (field: 'coverPhoto' | 'profilePhoto' | 'productImage') => {
    // Mock image upload - in real app, this would handle file upload
    const mockImages = {
      coverPhoto: "/placeholder-cover.jpg",
      profilePhoto: "/placeholder-profile.jpg",
      productImage: "/placeholder-product.jpg"
    }
    handleInputChange(field, mockImages[field])
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/landing-pages">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pages
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create Landing Page</h1>
                <p className="text-muted-foreground">Build a stunning landing page to generate leads</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save & Publish
              </Button>
            </div>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Builder Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Page Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pageName">Page Name</Label>
                      <Input
                        id="pageName"
                        value={landingPageData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter page name"
                      />
                    </div>

                    <div>
                      <Label>Cover Photo</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageUpload('coverPhoto')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Profile Photo</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageUpload('profilePhoto')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        value={landingPageData.caption}
                        onChange={(e) => handleInputChange('caption', e.target.value)}
                        placeholder="Enter your main caption"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="brandInfo">Brand Information</Label>
                      <Textarea
                        id="brandInfo"
                        value={landingPageData.brandInfo}
                        onChange={(e) => handleInputChange('brandInfo', e.target.value)}
                        placeholder="Tell your story"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={landingPageData.productName}
                        onChange={(e) => handleInputChange('productName', e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <Label>Product Image</Label>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageUpload('productImage')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="productDescription">Product Description</Label>
                      <Textarea
                        id="productDescription"
                        value={landingPageData.productDescription}
                        onChange={(e) => handleInputChange('productDescription', e.target.value)}
                        placeholder="Describe your product"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={landingPageData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showQuantity">Show Quantity Selector</Label>
                      <Switch
                        id="showQuantity"
                        checked={landingPageData.showQuantity}
                        onCheckedChange={(checked) => handleInputChange('showQuantity', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showAddress">Show Address Field</Label>
                      <Switch
                        id="showAddress"
                        checked={landingPageData.showAddress}
                        onCheckedChange={(checked) => handleInputChange('showAddress', checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input
                        id="footerText"
                        value={landingPageData.footerText}
                        onChange={(e) => handleInputChange('footerText', e.target.value)}
                        placeholder="Enter footer text"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="slug">Page URL</Label>
                      <Input
                        id="slug"
                        placeholder="my-amazing-product"
                        className="font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Published</Label>
                      <Switch id="published" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Enable Analytics</Label>
                      <Switch id="analytics" defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <LandingPagePreview data={landingPageData} />
              </div>
            </CardContent>
          </Card>
                 </div>
       </div>
       </div>
     </DashboardLayout>
   </ProtectedRoute>
   )
 }
