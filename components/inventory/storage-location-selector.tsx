"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusIcon, Loader2Icon } from "lucide-react"

export default function StorageLocationSelector({ value, onChange }) {
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newLocationName, setNewLocationName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/inventory/storage-locations")

      if (!response.ok) {
        throw new Error("Failed to fetch storage locations")
      }

      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error("Error fetching storage locations:", error)
      setError("Failed to load storage locations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLocation = async () => {
    if (!newLocationName.trim()) {
      setCreateError("Location name is required")
      return
    }

    try {
      setIsCreating(true)
      setCreateError("")

      const response = await fetch("/api/inventory/storage-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newLocationName.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create storage location")
      }

      const newLocation = await response.json()

      // Update locations list
      setLocations([...locations, newLocation])

      // Select the new location
      onChange(newLocation.id)

      // Close dialog and reset form
      setIsDialogOpen(false)
      setNewLocationName("")
    } catch (error) {
      console.error("Error creating storage location:", error)
      setCreateError(error.message || "Failed to create storage location")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select storage location" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                Loading...
              </div>
            ) : error ? (
              <div className="text-red-500 p-2">{error}</div>
            ) : locations.length === 0 ? (
              <div className="text-gray-500 p-2">No storage locations found</div>
            ) : (
              locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Storage Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="locationName">Location Name</Label>
              <Input
                id="locationName"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="e.g., Sheet Rack, Cabinet A"
                className={createError ? "border-red-500" : ""}
              />
              {createError && <p className="text-red-500 text-sm mt-1">{createError}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateLocation}
              disabled={isCreating}
              className="bg-[#185047] hover:bg-[#185047]/90"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Creating...
                </span>
              ) : (
                "Add Location"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
