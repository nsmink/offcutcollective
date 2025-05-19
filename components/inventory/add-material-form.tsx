"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react"
import StorageLocationSelector from "./storage-location-selector"

export default function AddMaterialForm({ onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      label: "",
      width: "",
      length: "",
      thickness: "",
      storageLocationId: "",
      state: "good",
      inventorySince: new Date().toISOString().split("T")[0],
      openToCommunity: false,
      imageUrl: "",
    },
  })

  const [imagePreview, setImagePreview] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const watchStorageLocationId = watch("storageLocationId")

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      // In a real app, you would upload the file to a storage service
      // For now, we'll create a local preview and simulate an upload
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)

      // Simulate API call for image upload
      // In a real app, you would use FormData to upload the file
      setTimeout(() => {
        // Mock response with a URL
        const mockImageUrl = `/uploads/material-${Date.now()}.jpg`
        setValue("imageUrl", mockImageUrl)
        setIsUploading(false)
      }, 1000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError("Failed to upload image. Please try again.")
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setValue("imageUrl", "")
    setImagePreview("")
  }

  const onFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Add New Material</h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Material Label *</Label>
              <Input
                id="label"
                {...register("label", { required: "Label is required" })}
                placeholder="e.g., Oak Plywood, Walnut Offcut"
                className={errors.label ? "border-red-500" : ""}
              />
              {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="width">Width (mm)</Label>
                <Input id="width" type="number" {...register("width", { min: 0 })} placeholder="Width" />
              </div>
              <div>
                <Label htmlFor="length">Length (mm)</Label>
                <Input id="length" type="number" {...register("length", { min: 0 })} placeholder="Length" />
              </div>
              <div>
                <Label htmlFor="thickness">Thickness (mm)</Label>
                <Input id="thickness" type="number" {...register("thickness", { min: 0 })} placeholder="Thickness" />
              </div>
            </div>

            <div>
              <Label htmlFor="storageLocation">Storage Location</Label>
              <StorageLocationSelector
                value={watchStorageLocationId}
                onChange={(value) => setValue("storageLocationId", value)}
              />
            </div>

            <div>
              <Label htmlFor="state">Material State *</Label>
              <Select defaultValue="good" onValueChange={(value) => setValue("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inventorySince">In Inventory Since</Label>
              <Input id="inventorySince" type="date" {...register("inventorySince")} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Material Image</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Material preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="mb-3">
                      <UploadIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Click to upload an image of your material</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-[#185047] text-white px-4 py-2 rounded-md hover:bg-[#185047]/90 transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <span className="flex items-center">
                          <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                          Uploading...
                        </span>
                      ) : (
                        "Select Image"
                      )}
                    </label>
                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="openToCommunity"
                checked={watch("openToCommunity")}
                onCheckedChange={(checked) => setValue("openToCommunity", checked)}
              />
              <Label htmlFor="openToCommunity" className="cursor-pointer">
                Open to Community
              </Label>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              When enabled, other members of the Offcut Co. community can see and request this material.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading} className="bg-[#185047] hover:bg-[#185047]/90">
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </span>
            ) : (
              "Add Material"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
