import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientsList from "@/components/clients-list"
import BootstrapConfigList from "@/components/bootstrap-config-list"
import SecurityConfigList from "@/components/security-config-list"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-applio-dark text-white py-6 md:py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-2xl font-bold mb-2 md:mb-2">Encore Leshan Demo</h1>
          <p className="text-md md:text-1xl max-w-2xl">
            Eclipse Leshan LwM2M Server with an Encore-based backend API for IoT device management
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 flex-grow">
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 overflow-x-auto">
            <TabsTrigger
              value="bootstrap"
              className="data-[state=active]:bg-applio-teal data-[state=active]:text-white text-xs md:text-sm"
            >
              Bootstrap Configs
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-applio-teal data-[state=active]:text-white text-xs md:text-sm"
            >
              Security Configs
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:bg-applio-teal data-[state=active]:text-white text-xs md:text-sm"
            >
              Connected Clients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsList />
          </TabsContent>

          <TabsContent value="bootstrap">
            <BootstrapConfigList />
          </TabsContent>

          <TabsContent value="security">
            <SecurityConfigList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
