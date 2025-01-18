import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfo from "./_components/GeneralInfo";
import Transfers from "./_components/Transfers";

const ProfilePage = () => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="w-full mb-3">
        <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
        <TabsTrigger value="transfers" className="flex-1">Transferencias</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralInfo />
      </TabsContent>
      <TabsContent value="transfers">
        <Transfers />
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default ProfilePage;