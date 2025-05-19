"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditIcon, MoreVerticalIcon, TrashIcon, EyeIcon, RefreshCwIcon } from "lucide-react"
import EditMaterialForm from "./edit-material-form"

export default function InventoryList({ materials, isLoading, onDelete, onRefresh }) {
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [deletingMaterial, setDeletingMaterial] = useState(null)
  const [viewingMaterial, setViewingMaterial] = useState(null)

  const handleEdit = (material) => {
    setEditingMaterial(material)
  }

  const handleDelete = (material) => {
    setDeletingMaterial(material)
  }

  const confirmDelete = async () => {
    if (deletingMaterial) {
      await onDelete(deletingMaterial.id)
      setDeletingMaterial(null)
    }
  }

  const handleView = (material) => {
    setViewingMaterial(material)
  }

  const handleUpdateSuccess = () => {
    setEditingMaterial(null)
    onRefresh()
  }

  if (editingMaterial) {
    return (
      <EditMaterialForm
        material={editingMaterial}
        onSubmit={handleUpdateSuccess}
        onCancel={() => setEditingMaterial(null)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#185047] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (materials.length === 0) {
    return (
      <div className="p-8 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Your inventory is empty</h2>
        <p className="text-gray-600 mb-6">Start adding materials to keep track of your offcuts.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={onRefresh} className="flex items-center">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Dimensions (mm)</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>State</TableHead>
              <TableHead>In Inventory</TableHead>
              <TableHead>Community</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {material.imageUrl && (
                      <div className="w-10 h-10 mr-3 relative rounded overflow-hidden">
                        <Image
                          src={material.imageUrl || "/placeholder.svg"}
                          alt={material.label}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )}
                    {material.label}
                  </div>
                </TableCell>
                <TableCell>
                  {material.width && material.length ? (
                    <>
                      {material.width} × {material.length}
                      {material.thickness ? ` × ${material.thickness}` : ""}
                    </>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  {material.storageLocationName || <span className="text-gray-400">Not specified</span>}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      material.state === "new"
                        ? "bg-green-100 text-green-800"
                        : material.state === "good"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {material.state}
                  </span>
                </TableCell>
                <TableCell>
                  {material.inventorySince ? (
                    formatDistanceToNow(new Date(material.inventorySince), { addSuffix: true })
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  {material.openToCommunity ? (
                    <span className="text-green-600">Shared</span>
                  ) : (
                    <span className="text-gray-400">Private</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(material)}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(material)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(material)} className="text-red-600">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMaterial} onOpenChange={() => setDeletingMaterial(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the material "{deletingMaterial?.label}" from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Material Detail Dialog */}
      <AlertDialog open={!!viewingMaterial} onOpenChange={() => setViewingMaterial(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{viewingMaterial?.label}</AlertDialogTitle>
          </AlertDialogHeader>

          {viewingMaterial && (
            <div className="space-y-4">
              {viewingMaterial.imageUrl && (
                <div className="w-full h-48 relative rounded-md overflow-hidden">
                  <Image
                    src={viewingMaterial.imageUrl || "/placeholder.svg"}
                    alt={viewingMaterial.label}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dimensions</p>
                  <p>
                    {viewingMaterial.width && viewingMaterial.length ? (
                      <>
                        {viewingMaterial.width} × {viewingMaterial.length}
                        {viewingMaterial.thickness ? ` × ${viewingMaterial.thickness}` : ""} mm
                      </>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Storage Location</p>
                  <p>{viewingMaterial.storageLocationName || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="capitalize">{viewingMaterial.state}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">In Inventory</p>
                  <p>
                    {viewingMaterial.inventorySince
                      ? formatDistanceToNow(new Date(viewingMaterial.inventorySince), { addSuffix: true })
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Community Access</p>
                  <p>{viewingMaterial.openToCommunity ? "Shared" : "Private"}</p>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              onClick={() => {
                setViewingMaterial(null)
                handleEdit(viewingMaterial)
              }}
            >
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
