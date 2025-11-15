"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import WaterInfrastructureMap from "@/components/map"
import EnhancedVizagMap from "@/components/EnhancedVizagMap"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import Image from "next/image"
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  Activity,
  Zap,
  MessageSquare,
  MapPin,
  Building,
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download
} from "lucide-react"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chatMessage, setChatMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // In a real app, this would send the message to the server
      setChatMessage("")
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Get immediate help from GVMC's Water Supply Department.</p>
          <p className="text-gray-600 dark:text-gray-400">Our helpline and email channels are available 24×7 to resolve water issues across all 98 wards of Visakhapatnam.</p>

        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live Support Online</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="glass-light border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Phone className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Visakhapatnam Support</p>
                        <p className="text-xs text-green-600 mt-1">Available now</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    GVMC Water Supply Helpline – Visakhapatnam
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-4 pr-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For any water supply complaints, tanker requests, or leakages, contact:
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Toll-Free Helpline
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">24×7 GVMC Water Supply Support</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg">1800-4250-0009</p>
                            <p className="text-xs text-green-600">Available 24/7</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Alternate Landline
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">During office hours</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg">0891-2762876</p>
                            <p className="text-xs text-green-600">Online</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Emergency (Water Supply Cell)
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">After-hours emergencies</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg">0891-2746672</p>
                            <p className="text-xs text-red-600">Emergency</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Superintendent Engineer (Water Supply)
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Direct contact</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg">+91 99480 95519</p>
                            <p className="text-xs text-green-600">Available</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Office Hours:</strong> 9:00 AM – 6:00 PM (Monday – Saturday)<br/>
                      <strong>Address:</strong> Greater Visakhapatnam Municipal Corporation (GVMC), Tenneti Bhavan, Asilmetta, Visakhapatnam, Andhra Pradesh – 530003<br/>
                      <strong>Official Website:</strong> <a href="https://www.gvmc.gov.in" className="underline">https://www.gvmc.gov.in</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">📋 Instructions:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Dial <strong>1800-4250-0009</strong> for 24×7 GVMC Water Supply Support.</li>
                      <li>If unreachable, use <strong>0891-2762876</strong> during office hours.</li>
                      <li>For after-hours emergencies, call <strong>0891-2746672</strong> (Water Supply Cell).</li>
                      <li>Clearly mention your <strong>Ward No. (1 – 98)</strong>, locality, and issue.</li>
                      <li>Request and note your <strong>Complaint ID</strong> for tracking.</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <strong>Tip:</strong> Calls are logged automatically by GVMC's Smart Water Desk for faster resolution.
                    </p>
                  </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      © 2025 Greater Visakhapatnam Municipal Corporation (GVMC).<br/>
                      All official details are sourced from the Government of Andhra Pradesh portal: <a href="https://www.gvmc.gov.in" className="underline">https://www.gvmc.gov.in</a>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="glass-light border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Visakhapatnam Support</p>
                        <p className="text-xs text-green-600 mt-1">24/7 response</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    GVMC Email Support – Visakhapatnam
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-4 pr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use email for non-urgent water supply issues, billing clarifications, or feedback.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Primary Email
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Main GVMC citizen services</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm">visakhapatnam.citizen@gvmc.gov.in</p>
                              <p className="text-xs text-green-600">Active</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                CC / Backup
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Additional support email</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm">support@gvmc.gov.in</p>
                              <p className="text-xs text-green-600">Active</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Complaint Portal
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Online complaint submission</p>
                            </div>
                            <div className="text-right">
                              <a href="https://www.gvmc.gov.in/Citizen%20Services.htm" className="text-sm text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                                Citizen Services Portal
                              </a>
                              <p className="text-xs text-green-600">Online</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Address:</strong> Greater Visakhapatnam Municipal Corporation (GVMC), Tenneti Bhavan, Asilmetta, Visakhapatnam, Andhra Pradesh – 530003
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">📝 Instructions for Email:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>
                          <strong>Subject Line → "Water Supply Issue – [Ward No.] – [Short Description]"</strong><br/>
                          <em>Example: Water Supply Issue – Ward 45 – Low Pressure in Sector 2</em>
                        </li>
                        <li>
                          Include in message:
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            <li>Full Name</li>
                            <li>Mobile Number</li>
                            <li>Ward No. / Locality</li>
                            <li>Description of Issue</li>
                            <li>Attach photo (if possible)</li>
                          </ul>
                        </li>
                        <li>You'll receive an acknowledgment within <strong>24 hours</strong>.</li>
                        <li>Track your issue on the official <strong>GVMC Citizen Services Portal</strong>.</li>
                      </ol>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                        <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <strong>Tip:</strong> Mark subject as <strong>"URGENT"</strong> for leakages or contamination cases.
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      © 2025 Greater Visakhapatnam Municipal Corporation (GVMC).<br/>
                      Information verified from the official government website: <a href="https://www.gvmc.gov.in" className="underline">https://www.gvmc.gov.in</a>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* GVMC Ward Boundaries Map - Full View */}
          <Card className="glass-light border-blue-200 dark:border-blue-800 w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
                GREATER VISAKHAPATNAM MUNICIPAL CORPORATION MAP
                SHOWING THE WARD BOUNDARIES OF 98 WARDS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TransformWrapper
                  initialScale={1}
                  minScale={0.3}
                  maxScale={6}
                  centerOnInit={true}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="flex justify-center gap-2 mb-4 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => zoomIn()}
                          className="flex items-center gap-1"
                        >
                          <ZoomIn className="w-4 h-4" />
                          Zoom In
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => zoomOut()}
                          className="flex items-center gap-1"
                        >
                          <ZoomOut className="w-4 h-4" />
                          Zoom Out
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetTransform()}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.gvmc.gov.in/wss/image_uploads/gvmcnewward98.pdf', '_blank')}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Button>
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 w-full max-w-6xl mx-auto">
                        <TransformComponent>
                          <Image
                            src="/gvmcnewward98.png"
                            alt="Greater Visakhapatnam Municipal Corporation Ward Boundaries Map - Full View"
                            width={1200}
                            height={900}
                            className="object-contain w-full h-auto"
                            style={{ cursor: 'grab' }}
                          />
                        </TransformComponent>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        © Greater Visakhapatnam Municipal Corporation - <a href="https://www.gvmc.gov.in" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">https://www.gvmc.gov.in</a>
                      </div>
                    </>
                  )}
                </TransformWrapper>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <EnhancedVizagMap />
        </TabsContent>
      </Tabs>
    </div>
  )
}
