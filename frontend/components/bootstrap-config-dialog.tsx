"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"

interface BootstrapConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: any | null
  onSave: (data: any) => void
}

export default function BootstrapConfigDialog({ open, onOpenChange, initialData, onSave }: BootstrapConfigDialogProps) {
  const [activeTab, setActiveTab] = useState("lwm2m-as")
  const isMobile = useMobile()
  const [formData, setFormData] = useState({
    endpoint: "",
    serverUrl: "coap://localhost:5683",
    securityMode: "No Security",
    masterSecret: "",
    masterSalt: "",
    senderId: "",
    recipientId: "",
    aeadAlgorithm: "AES_CCM_16_64_128",
    hkdfAlgorithm: "HKDF_HMAC_SHA_256",
    initiator: "",
    authenticationMethod: "",
    ciphersuite: "",
    credentialIdentifier: "",
    publicCredential: "",
    privateKey: "",
    serverCredentialIdentifier: "",
    serverPublicCredential: "",
    oscoreMasterSecretLength: "",
    oscoreMasterSaltLength: "",
    edhocOscoreCombined: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
      })
    } else {
      // Reset form for new config
      setFormData({
        endpoint: "",
        serverUrl: "coap://localhost:5683",
        securityMode: "No Security",
        masterSecret: "",
        masterSalt: "",
        senderId: "",
        recipientId: "",
        aeadAlgorithm: "AES_CCM_16_64_128",
        hkdfAlgorithm: "HKDF_HMAC_SHA_256",
        initiator: "",
        authenticationMethod: "",
        ciphersuite: "",
        credentialIdentifier: "",
        publicCredential: "",
        privateKey: "",
        serverCredentialIdentifier: "",
        serverPublicCredential: "",
        oscoreMasterSecretLength: "",
        oscoreMasterSaltLength: "",
        edhocOscoreCombined: "",
      })
    }
  }, [initialData, open])

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const fillClientDMConfig = () => {
    // Logic to fill client to DM config
    console.log("Fill Client->DM config")
  }

  const fillClientASConfig = () => {
    // Logic to fill client to AS config
    console.log("Fill Client->AS config")
  }

  const fillClientBSConfig = () => {
    // Logic to fill client to BS config
    console.log("Fill Client->BS config")
  }

  // Form field component to reduce repetition
  const FormField = ({ label, id, value, onChange, type = "text", hint }: any) => (
    <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 items-center gap-4"}`}>
      <Label htmlFor={id} className={isMobile ? "" : "text-right"}>
        {label}
      </Label>
      <div className={isMobile ? "" : "col-span-2"}>
        <Input id={id} value={value} onChange={(e) => onChange(id, e.target.value)} type={type} />
        {hint && <p className="text-xs text-muted-foreground text-right mt-1">{hint}</p>}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? "max-w-[95vw]" : "max-w-2xl"} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>New Bootstrap Configuration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <FormField label="Client endpoint" id="endpoint" value={formData.endpoint} onChange={handleChange} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="lwm2m-as"
                className="data-[state=active]:bg-applio-teal data-[state=active]:text-white text-xs md:text-sm"
              >
                LWM2M/AS Server
              </TabsTrigger>
              <TabsTrigger
                value="lwm2m-bs"
                className="data-[state=active]:bg-applio-teal data-[state=active]:text-white text-xs md:text-sm"
              >
                LWM2M Bootstrap Server
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lwm2m-as" className="space-y-4">
              <FormField label="LWM2M Server URL" id="serverUrl" value={formData.serverUrl} onChange={handleChange} />

              <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 items-center gap-4"}`}>
                <Label htmlFor="securityMode" className={isMobile ? "" : "text-right"}>
                  Security mode
                </Label>
                <div className={isMobile ? "" : "col-span-2"}>
                  <Select value={formData.securityMode} onValueChange={(value) => handleChange("securityMode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select security mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No Security">No Security</SelectItem>
                      <SelectItem value="Pre-Shared Key">Pre-Shared Key</SelectItem>
                      <SelectItem value="Raw Public Key">Raw Public Key</SelectItem>
                      <SelectItem value="X.509 Certificate">X.509 Certificate</SelectItem>
                      <SelectItem value="OSCORE">OSCORE</SelectItem>
                      <SelectItem value="EDHOC">EDHOC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fillClientDMConfig}
                  className="bg-applio-gray text-white hover:bg-applio-gray/90"
                >
                  Fill Client-&gt;DM config
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={fillClientASConfig}
                  className="bg-applio-gray text-white hover:bg-applio-gray/90"
                >
                  Fill Client-&gt;AS config
                </Button>
              </div>

              {formData.securityMode === "OSCORE" && (
                <>
                  <FormField
                    label="Master Secret"
                    id="masterSecret"
                    value={formData.masterSecret}
                    onChange={handleChange}
                    hint="Hexadecimal format"
                  />
                  <FormField
                    label="Master Salt"
                    id="masterSalt"
                    value={formData.masterSalt}
                    onChange={handleChange}
                    hint="Hexadecimal format"
                  />
                  <FormField
                    label="Sender ID"
                    id="senderId"
                    value={formData.senderId}
                    onChange={handleChange}
                    hint="Hexadecimal format"
                  />
                  <FormField
                    label="Recipient ID"
                    id="recipientId"
                    value={formData.recipientId}
                    onChange={handleChange}
                    hint="Hexadecimal format"
                  />
                  <FormField
                    label="AEAD Algorithm"
                    id="aeadAlgorithm"
                    value={formData.aeadAlgorithm}
                    onChange={handleChange}
                  />
                  <FormField
                    label="HKDF Algorithm"
                    id="hkdfAlgorithm"
                    value={formData.hkdfAlgorithm}
                    onChange={handleChange}
                  />
                </>
              )}

              {formData.securityMode === "EDHOC" && (
                <>
                  <FormField label="Initiator" id="initiator" value={formData.initiator} onChange={handleChange} />
                  <FormField
                    label="Authentication Method"
                    id="authenticationMethod"
                    value={formData.authenticationMethod}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Ciphersuite"
                    id="ciphersuite"
                    value={formData.ciphersuite}
                    onChange={handleChange}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="lwm2m-bs" className="space-y-4">
              <FormField label="LWM2M Server URL" id="serverUrl" value={formData.serverUrl} onChange={handleChange} />

              <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 items-center gap-4"}`}>
                <Label htmlFor="securityMode" className={isMobile ? "" : "text-right"}>
                  Security mode
                </Label>
                <div className={isMobile ? "" : "col-span-2"}>
                  <Select value={formData.securityMode} onValueChange={(value) => handleChange("securityMode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select security mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No Security">No Security</SelectItem>
                      <SelectItem value="Pre-Shared Key">Pre-Shared Key</SelectItem>
                      <SelectItem value="Raw Public Key">Raw Public Key</SelectItem>
                      <SelectItem value="X.509 Certificate">X.509 Certificate</SelectItem>
                      <SelectItem value="OSCORE">OSCORE</SelectItem>
                      <SelectItem value="EDHOC">EDHOC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fillClientBSConfig}
                  className="bg-applio-gray text-white hover:bg-applio-gray/90 w-full md:w-auto"
                >
                  Fill Client-&gt;BS config
                </Button>
              </div>

              {formData.securityMode === "OSCORE" && (
                <>
                  <FormField
                    label="OSCORE Master Secret Length"
                    id="oscoreMasterSecretLength"
                    value={formData.oscoreMasterSecretLength}
                    onChange={handleChange}
                  />
                  <FormField
                    label="OSCORE Master Salt Length"
                    id="oscoreMasterSaltLength"
                    value={formData.oscoreMasterSaltLength}
                    onChange={handleChange}
                  />
                  <FormField
                    label="EDHOC OSCORE Combined"
                    id="edhocOscoreCombined"
                    value={formData.edhocOscoreCombined}
                    onChange={handleChange}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`bg-applio-gray text-white hover:bg-applio-gray/90 ${isMobile ? "w-full" : ""}`}
          >
            Close
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className={`bg-applio-teal hover:bg-applio-teal/90 ${isMobile ? "w-full" : ""}`}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
