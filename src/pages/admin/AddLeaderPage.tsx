import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "../../components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../../components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import AppLayout from "../../components/layout/AppLayout";
import { CreateLeaderData, createLeader } from "../../services/adminService";
import { getProvinces, getDistricts, getSectors, getCells, getVillages } from "../../utils/locationHelpers";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  adminstrationScope: z.string().min(1, "Administrative scope is required"),
  province: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddLeaderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Location options
  const [provinces] = useState<string[]>(getProvinces());
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      adminstrationScope: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });
  
  // Watch for changes in the location fields
  const watchProvince = form.watch("province");
  const watchDistrict = form.watch("district");
  const watchSector = form.watch("sector");
  const watchCell = form.watch("cell");
  
  // Update districts when province changes
  useEffect(() => {
    if (watchProvince) {
      const newDistricts = getDistricts(watchProvince);
      setDistricts(newDistricts);
      form.setValue("district", "");
      form.setValue("sector", "");
      form.setValue("cell", "");
      form.setValue("village", "");
      setSectors([]);
      setCells([]);
      setVillages([]);
    }
  }, [watchProvince, form]);
  
  // Update sectors when district changes
  useEffect(() => {
    if (watchProvince && watchDistrict) {
      const newSectors = getSectors(watchProvince, watchDistrict);
      setSectors(newSectors);
      form.setValue("sector", "");
      form.setValue("cell", "");
      form.setValue("village", "");
      setCells([]);
      setVillages([]);
    }
  }, [watchProvince, watchDistrict, form]);
  
  // Update cells when sector changes
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector) {
      const newCells = getCells(watchProvince, watchDistrict, watchSector);
      setCells(newCells);
      form.setValue("cell", "");
      form.setValue("village", "");
      setVillages([]);
    }
  }, [watchProvince, watchDistrict, watchSector, form]);
  
  // Update villages when cell changes
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector && watchCell) {
      const newVillages = getVillages(watchProvince, watchDistrict, watchSector, watchCell);
      setVillages(newVillages);
      form.setValue("village", "");
    }
  }, [watchProvince, watchDistrict, watchSector, watchCell, form]);
  
  // Form submission handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const leaderData: CreateLeaderData = {
        name: data.name,
        email: data.email,
        adminstrationScope: data.adminstrationScope,
      };
      
      // Only include location fields if they have values
      if (data.province) leaderData.province = data.province;
      if (data.district) leaderData.district = data.district;
      if (data.sector) leaderData.sector = data.sector;
      if (data.cell) leaderData.cell = data.cell;
      if (data.village) leaderData.village = data.village;
      
      const result = await createLeader(leaderData);
      
      toast({
        title: "Success",
        description: result.message || "Leader created successfully",
      });
      
      // Redirect back to leaders list
      navigate("/admin/leaders");
    } catch (err: any) {
      setError(err.message || "Failed to create leader. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    navigate("/admin/leaders");
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Add New Leader</h1>
              <p className="text-muted-foreground mt-2">
                Create a new leader account with administrative privileges
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leaders
            </Button>
          </div>
        </div>
        
        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Leader Information</CardTitle>
            <CardDescription>
              Enter the details for the new leader. A random password will be generated and the leader will be able to reset it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter leader's name" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter leader's email" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="adminstrationScope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administrative Scope</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select scope" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NATIONAL">National</SelectItem>
                            <SelectItem value="PROVINCE">Province</SelectItem>
                            <SelectItem value="DISTRICT">District</SelectItem>
                            <SelectItem value="SECTOR">Sector</SelectItem>
                            <SelectItem value="CELL">Cell</SelectItem>
                            <SelectItem value="VILLAGE">Village</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the location this leader will be responsible for
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select
                            disabled={isSubmitting}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <Select
                            disabled={isSubmitting || !watchProvince}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sector</FormLabel>
                          <Select
                            disabled={isSubmitting || !watchDistrict}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectors.map((sector) => (
                                <SelectItem key={sector} value={sector}>
                                  {sector}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cell"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cell</FormLabel>
                          <Select
                            disabled={isSubmitting || !watchSector}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select cell" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cells.map((cell) => (
                                <SelectItem key={cell} value={cell}>
                                  {cell}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="village"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Village</FormLabel>
                          <Select
                            disabled={isSubmitting || !watchCell}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select village" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {villages.map((village) => (
                                <SelectItem key={village} value={village}>
                                  {village}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <CardFooter className="flex justify-end space-x-4 px-0 pb-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#020240] hover:bg-[#020240]/90"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Leader
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AddLeaderPage;
