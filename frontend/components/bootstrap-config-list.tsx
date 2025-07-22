"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import BootstrapConfigDialog from "./bootstrap-config-dialog"
import { useMobile } from "@/hooks/use-mobile"

// Mock bootstrap config data - replace with actual API call
const mockBootstrapConfigs = [
  { id: "bs1", endpoint: "device001", serverUrl: "coap://localhost:5683", securityMode: "OSCORE" },
  { id: "bs2", endpoint: "device002", serverUrl: "coap://localhost:5683", securityMode: "Pre-Shared Key" },
  { id: "bs3", endpoint: "device003", serverUrl: "coap://localhost:5683", securityMode: "No Security" },
]

export default function BootstrapConfigList() {
  const [configs, setConfigs] = useState(mockBootstrapConfigs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<any>(null)
  const isMobile = useMobile()

  const handleAddConfig = () => {
    setEditingConfig(null)
    setIsDialogOpen(true)
  }

  const handleEditConfig = (config: any) => {
    setEditingConfig(config)
    setIsDialogOpen(true)
  }

  const handleDeleteConfig = async (id: string) => {
    if (confirm("Are you sure you want to delete this bootstrap configuration?")) {
      try {
        // await fetch(`/api/bootstrap/${id}`, { method: 'DELETE' })
        setConfigs(configs.filter((config) => config.id !== id))
      } catch (error) {
        console.error("Failed to delete bootstrap config:", error)
      }
    }
  }

  const handleSaveConfig = (config: any) => {
    if (editingConfig) {
      // Update existing config
      setConfigs(configs.map((c) => (c.id === editingConfig.id ? { ...c, ...config } : c)))
    } else {
      // Add new config
      setConfigs([...configs, { id: `bs${Date.now()}`, ...config }])
    }
    setIsDialogOpen(false)
  }

  // Mobile card view for configs
  const MobileConfigCard = ({ config }: { config: (typeof configs)[0] }) => (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="p-4 bg-applio-lightgray">
        <CardTitle className="text-base">{config.endpoint}</CardTitle>
        <CardDescription className="text-xs">{config.securityMode}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="grid grid-cols-3">
          <span className="font-medium">Server URL:</span>
          <span className="col-span-2 break-all">{config.serverUrl}</span>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => handleEditConfig(config)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(config.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-applio-lightgray flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Bootstrap Configurations</CardTitle>
          <CardDescription>Manage LwM2M client bootstrap configurations</CardDescription>
        </div>
        <Button
          onClick={handleAddConfig}
          className="bg-applio-teal hover:bg-applio-teal/90 flex items-center gap-1 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" /> Add New Configuration
        </Button>
      </CardHeader>
      <CardContent className={isMobile ? "p-4" : "p-0"}>
        {configs.length === 0 ? (
          <div className="text-center py-8">No bootstrap configurations found</div>
        ) : isMobile ? (
          <div className="space-y-4">
            {configs.map((config) => (
              <MobileConfigCard key={config.id} config={config} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-applio-lightgray">
                  <TableHead>Client Endpoint</TableHead>
                  <TableHead>Server URL</TableHead>
                  <TableHead>Security Mode</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>{config.endpoint}</TableCell>
                    <TableCell>{config.serverUrl}</TableCell>
                    <TableCell>{config.securityMode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditConfig(config)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteConfig(config.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <BootstrapConfigDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingConfig}
        onSave={handleSaveConfig}
      />
    </Card>
  )
}
