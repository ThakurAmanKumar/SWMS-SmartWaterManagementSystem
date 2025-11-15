"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Upload, Loader2, CheckCircle2, AlertCircle, Check, Trash2 } from "lucide-react"

interface ComplaintFormData {
  userId: string
  fullName: string
  address: string
  contactNo: string
  ward: string
  complaintType: string
  details: string
  image: File | null
}

interface StoredComplaint {
  id: string
  userId: string
  fullName: string
  address: string
  contactNo: string
  ward: string
  complaintType: string
  details: string
  imageUrl?: string
  submittedAt: string
  status: "pending" | "fixed"
}

export default function ComplaintForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [complaints, setComplaints] = useState<StoredComplaint[]>([])
  const [mounted, setMounted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ComplaintFormData>({
    userId: "AKT25V",
    fullName: "",
    address: "",
    contactNo: "",
    ward: "",
    complaintType: "",
    details: "",
    image: null,
  })

  const complaintTypes = [
    "Leakage",
    "No Supply",
    "Contamination",
    "Meter Fault",
    "Motor",
    "Tank",
    "Devices",
    "Other",
  ]

  // Load complaints from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("complaints")
    if (stored) {
      try {
        setComplaints(JSON.parse(stored))
      } catch (err) {
        console.error("Error loading complaints:", err)
      }
    }
  }, [])

  // Save complaints to localStorage
  const saveComplaints = (updated: StoredComplaint[]) => {
    setComplaints(updated)
    localStorage.setItem("complaints", JSON.stringify(updated))
  }

  const handleMarkAsFixed = (id: string) => {
    const updated = complaints.map(c =>
      c.id === id ? { ...c, status: "fixed" as const } : c
    )
    saveComplaints(updated)
    toast({
      title: "Marked as Fixed",
      description: "Complaint status updated.",
      className: "border-blue-500 bg-blue-50",
    })
  }

  const handleDeleteComplaint = (id: string) => {
    const updated = complaints.filter(c => c.id !== id)
    saveComplaints(updated)
    toast({
      title: "Deleted",
      description: "Complaint removed from history.",
      className: "border-red-500 bg-red-50",
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      complaintType: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required"
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = "Contact Number is required"
    } else if (!/^\d{10}$/.test(formData.contactNo.trim())) {
      errors.contactNo = "Please enter a valid 10-digit contact number"
    }

    if (!formData.ward.trim()) {
      errors.ward = "Ward No. is required"
    }

    if (!formData.complaintType) {
      errors.complaintType = "Please select a complaint type"
    }

    if (!formData.details.trim()) {
      errors.details = "Complaint Details are required"
    }

    if (!formData.image) {
      errors.image = "Please upload an image of the issue"
    }

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Please fill all required fields",
        description: "Check the highlighted fields below",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create FormData for multipart upload
      const submitData = new FormData()
      submitData.append("fullName", formData.fullName)
      submitData.append("address", formData.address)
      submitData.append("contactNo", formData.contactNo)
      submitData.append("userId", formData.userId)
      submitData.append("ward", formData.ward)
      submitData.append("complaintType", formData.complaintType)
      submitData.append("details", formData.details)
      if (formData.image) {
        submitData.append("image", formData.image)
      }

      const response = await fetch("/api/send-complaint", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send complaint")
      }

      // Save complaint to localStorage
      const newComplaint: StoredComplaint = {
        id: Date.now().toString(),
        userId: formData.userId,
        fullName: formData.fullName,
        address: formData.address,
        contactNo: formData.contactNo,
        ward: formData.ward,
        complaintType: formData.complaintType,
        details: formData.details,
        imageUrl: imagePreview || undefined,
        submittedAt: new Date().toLocaleString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "pending",
      }
      saveComplaints([...complaints, newComplaint])

      // Show success toast (explicitly mention recipient email)
      toast({
        title: "Success!",
        description: "Complaint submitted successfully and sent to swms.helpdesk@gmail.com. Our team will review it shortly.",
        className: "border-green-500 bg-green-50",
      })

      // Show success popup for 5 seconds
      setShowSuccessPopup(true)
      setTimeout(() => {
        setShowSuccessPopup(false)
      }, 5000)

      // Reset form
      setFormData({
        userId: "AKT25V",
        fullName: "",
        address: "",
        contactNo: "",
        ward: "",
        complaintType: "",
        details: "",
        image: null,
      })
      setImagePreview(null)

      // Reset file input
      const fileInput = document.getElementById("image-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send complaint. Please try again."
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Submit Complaint Form - Full Width Larger Card */}
        <div>
          {/* Main Card */}
          <Card className="border-0 shadow-2xl bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-6 border-b-2 border-blue-200 dark:border-blue-700 bg-linear-to-r from-blue-500/5 to-cyan-500/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Submit a Complaint</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    📋 Report water-related issues directly to SWMS Helpdesk
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    👤 Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`h-11 bg-white dark:bg-gray-800 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                      fieldErrors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-sm text-red-500">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-base font-semibold">
                    🆔 User ID
                  </Label>
                  <Input
                    id="userId"
                    name="userId"
                    type="text"
                    value={formData.userId}
                    disabled
                    className="h-11 bg-gray-50 dark:bg-gray-800 cursor-not-allowed border-2 border-gray-300 dark:border-gray-600 text-sm rounded-lg"
                  />
                </div>

                {/* Ward No. */}
                <div className="space-y-2">
                  <Label htmlFor="ward" className="text-base font-semibold">
                    🏘️ Ward No. <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ward"
                    name="ward"
                    type="text"
                    placeholder="Enter your Ward No."
                    value={formData.ward}
                    onChange={handleInputChange}
                    className={`h-11 bg-white dark:bg-gray-800 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                      fieldErrors.ward ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.ward && (
                    <p className="text-sm text-red-500">{fieldErrors.ward}</p>
                  )}
                </div>

                {/* Contact No. */}
                <div className="space-y-2">
                  <Label htmlFor="contactNo" className="text-base font-semibold">
                    📞 Contact No. <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactNo"
                    name="contactNo"
                    type="tel"
                    placeholder="Enter your 10-digit contact number"
                    value={formData.contactNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
                      setFormData(prev => ({ ...prev, contactNo: value }));
                    }}
                    maxLength={10}
                    className={`h-11 bg-white dark:bg-gray-800 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                      fieldErrors.contactNo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.contactNo && (
                    <p className="text-sm text-red-500">{fieldErrors.contactNo}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-semibold">
                    🏠 Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`h-11 bg-white dark:bg-gray-800 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                      fieldErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.address && (
                    <p className="text-sm text-red-500">{fieldErrors.address}</p>
                  )}
                </div>

                {/* Complaint Type */}
                <div className="space-y-2">
                  <Label htmlFor="complaintType" className="text-base font-semibold">
                    🎯 Complaint Type <span className="text-red-500">*</span>
                  </Label>
                  {mounted && (
                    <Select
                      value={formData.complaintType}
                      onValueChange={handleSelectChange}
                      disabled={loading}
                    >
                      <SelectTrigger className={`h-11 bg-white dark:bg-gray-600 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                        fieldErrors.complaintType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <SelectValue placeholder="Select complaint type" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {fieldErrors.complaintType && (
                    <p className="text-sm text-red-500">{fieldErrors.complaintType}</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <Label htmlFor="details" className="text-base font-semibold">
                    📝 Complaint Details <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Please describe the issue in detail..."
                    value={formData.details}
                    onChange={handleInputChange}
                    className={`min-h-32 resize-none bg-white dark:bg-gray-800 border-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 ${
                      fieldErrors.details ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {fieldErrors.details && (
                    <p className="text-sm text-red-500">{fieldErrors.details}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="text-base font-semibold">
                    📸 Attach Image <span className="text-red-500">*</span>
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-5 text-center bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer ${
                    fieldErrors.image ? 'border-red-500' : 'border-blue-400 dark:border-blue-600'
                  }`}>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>
                  {fieldErrors.image && (
                    <p className="text-sm text-red-500">{fieldErrors.image}</p>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-6 relative">
                      <div className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto object-cover max-h-60"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setFormData(prev => ({ ...prev, image: null }))
                            const fileInput = document.getElementById("image-upload") as HTMLInputElement
                            if (fileInput) fileInput.value = ""
                          }}
                          disabled={loading}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                        {formData.image?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-75 text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="w-6 h-6 mr-3" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            {/* Info Box at Bottom */}
            <div className="border-t-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl mb-2">📧</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Sent To</h4>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    swms.helpdesk@gmail.com
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl mb-2">⏱️</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Response Time</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Within <span className="font-bold">24-48 hours</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl mb-2">✅</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Features</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Secure • Fast<br/>Image Attached
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Success Popup (5 seconds) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4 animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
              aria-label="Close popup"
            >
              ×
            </button>
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Complaint Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your complaint has been successfully sent to swms.helpdesk@gmail.com
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ Our team will review it within 24-48 hours
            </p>
          </div>
        </div>
      )}

      {/* Complaint History Card - Full Width */}
      {mounted && complaints.length > 0 && (
        <Card className="border-0 shadow-xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-8 border-b border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Complaint History</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {complaints.length} complaint{complaints.length !== 1 ? "s" : ""} submitted
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map(complaint => (
                <div
                  key={complaint.id}
                  className={`p-4 rounded-lg border transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {complaint.fullName}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 mb-3">
                    <p>
                      <span className="font-medium">Ward:</span> {complaint.ward}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {complaint.complaintType}
                    </p>
                    <p className="line-clamp-2">
                      <span className="font-medium">Details:</span> {complaint.details}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs pt-1">
                      📅 {complaint.submittedAt}
                    </p>
                  </div>
                  
                  {complaint.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={complaint.imageUrl}
                        alt="Complaint"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {complaint.status === "fixed" ? (
                      <div className="flex-1 p-2 bg-green-100 dark:bg-green-900/30 rounded text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-1 text-xs font-bold border border-green-300 dark:border-green-700">
                        <Check className="w-4 h-4" />
                        Fixed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkAsFixed(complaint.id)}
                        className="flex-1 p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 text-xs font-medium border border-blue-300 dark:border-blue-700"
                        title="Mark as Fixed"
                      >
                        <Check className="w-4 h-4" />
                        Mark Fixed
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="flex-1 p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors text-red-600 dark:text-red-400 flex items-center justify-center gap-1 text-xs font-medium border border-red-300 dark:border-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
