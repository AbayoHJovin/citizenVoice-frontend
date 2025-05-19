
import { useEffect, useState } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateProfile } from "../features/auth/authSlice";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  getProvinces, 
  getDistricts, 
  getSectors, 
  getCells, 
  getVillages 
} from "../utils/locationHelpers";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const isLeader = user?.role === 'LEADER';
  
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  const profileFormSchema = z.object({
    name: z.string().min(2, t('profile.validation.name')),
    email: z.string().email(t('profile.validation.email')),
    province: z.string().optional(),
    district: z.string().optional(),
    sector: z.string().optional(),
    cell: z.string().optional(),
    village: z.string().optional(),
  });
  
  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      province: user?.province || "",
      district: user?.district || "",
      sector: user?.sector || "",
      cell: user?.cell || "",
      village: user?.village || "",
    },
  });
  
  useEffect(() => {
    try {
      const allProvinces = getProvinces();
      setProvinces(allProvinces);
      
      if (user?.province) {
        const userDistricts = getDistricts(user.province);
        setDistricts(userDistricts);
        
        if (user?.district) {
          const userSectors = getSectors(user.province, user.district);
          setSectors(userSectors);
          
          if (user?.sector) {
            const userCells = getCells(user.province, user.district, user.sector);
            setCells(userCells);
            
            if (user?.cell) {
              const userVillages = getVillages(user.province, user.district, user.sector, user.cell);
              setVillages(userVillages);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      setError('Failed to load location data. Please try again later.');
    }
  }, [user]);
  
  const watchProvince = profileForm.watch('province');
  const watchDistrict = profileForm.watch('district');
  const watchSector = profileForm.watch('sector');
  const watchCell = profileForm.watch('cell');
  
  useEffect(() => {
    if (watchProvince) {
      try {
        const newDistricts = getDistricts(watchProvince);
        setDistricts(newDistricts);
        profileForm.setValue('district', '');
        profileForm.setValue('sector', '');
        profileForm.setValue('cell', '');
        profileForm.setValue('village', '');
        setSectors([]);
        setCells([]);
        setVillages([]);
      } catch (error) {
        console.error('Error loading districts:', error);
      }
    }
  }, [watchProvince, profileForm]);
  
  // Update sectors when district changes
  useEffect(() => {
    if (watchProvince && watchDistrict) {
      try {
        const newSectors = getSectors(watchProvince, watchDistrict);
        setSectors(newSectors);
        // Reset lower-level selections
        profileForm.setValue('sector', '');
        profileForm.setValue('cell', '');
        profileForm.setValue('village', '');
        setCells([]);
        setVillages([]);
      } catch (error) {
        console.error('Error loading sectors:', error);
      }
    }
  }, [watchProvince, watchDistrict, profileForm]);
  
  // Update cells when sector changes
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector) {
      try {
        const newCells = getCells(watchProvince, watchDistrict, watchSector);
        setCells(newCells);
        // Reset lower-level selections
        profileForm.setValue('cell', '');
        profileForm.setValue('village', '');
        setVillages([]);
      } catch (error) {
        console.error('Error loading cells:', error);
      }
    }
  }, [watchProvince, watchDistrict, watchSector, profileForm]);
  
  // Update villages when cell changes
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector && watchCell) {
      try {
        const newVillages = getVillages(watchProvince, watchDistrict, watchSector, watchCell);
        setVillages(newVillages);
        // Reset village selection
        profileForm.setValue('village', '');
      } catch (error) {
        console.error('Error loading villages:', error);
      }
    }
  }, [watchProvince, watchDistrict, watchSector, watchCell, profileForm]);

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // If we're exiting edit mode without saving, reset form values
      profileForm.reset({
        name: user?.name || "",
        email: user?.email || "",
        province: user?.province || "",
        district: user?.district || "",
        sector: user?.sector || "",
        cell: user?.cell || "",
        village: user?.village || "",
      });
    }
    setIsEditMode(!isEditMode);
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsProfileUpdating(true);
      setError(null);
      
      // Create an object with only the fields that have changed
      const updateData: {
        name: string;
        province?: string;
        district?: string;
        sector?: string;
        cell?: string;
        village?: string;
      } = {
        name: data.name // Name is required for the API call
      };
      
      // Only include address fields that have changed and are not empty
      if (!isLeader) { // Only update address if not a leader
        if (data.province && data.province !== user?.province) updateData.province = data.province;
        if (data.district && data.district !== user?.district) updateData.district = data.district;
        if (data.sector && data.sector !== user?.sector) updateData.sector = data.sector;
        if (data.cell && data.cell !== user?.cell) updateData.cell = data.cell;
        if (data.village && data.village !== user?.village) updateData.village = data.village;
      }
      
      // Check if at least one field besides name has changed
      const hasChanges = Object.keys(updateData).length > 1 || data.name !== user?.name;
      
      if (!hasChanges) {
        toast({
          title: t('profile.toast.noChanges.title'),
          description: t('profile.toast.noChanges.description'),
        });
        return;
      }
      
      // Dispatch the updateProfile action
      await dispatch(updateProfile(updateData)).unwrap();
      
      toast({
        title: t('profile.toast.success.title'),
        description: t('profile.toast.success.description'),
      });
      
      // Exit edit mode after successful update
      setIsEditMode(false);
      
    } catch (error: any) {
      setError(error?.message || t('profile.toast.error.description'));
      toast({
        variant: "destructive",
        title: t('profile.toast.error.title'),
        description: error?.message || t('profile.toast.error.description'),
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-3xl font-bold">{t('profile.header.title')}</h3>
          <p className="text-muted-foreground">
            {t('profile.header.description')}
          </p>
        </div>
        <Separator />
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.card.title')}</CardTitle>
              <CardDescription>
                {t('profile.card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form 
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)} 
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.form.name.label')}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isProfileUpdating || !isEditMode} className={!isEditMode ? "bg-gray-50" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.form.email.label')}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={true} className="bg-gray-50" />
                        </FormControl>
                        <FormDescription>
                          {t('profile.form.email.description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">{t('profile.form.address.title')}</h3>
                      {isLeader && (
                        <div className="text-sm text-amber-600">
                          {t('profile.form.address.leaderRestriction')}
                        </div>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Province Display/Dropdown */}
                      <FormField
                        control={profileForm.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.form.address.province')}</FormLabel>
                            {isEditMode && !isLeader ? (
                              <Select
                                disabled={isProfileUpdating}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                defaultValue={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={field.value || t('profile.form.address.selectProvince')} />
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
                            ) : (
                              <FormControl>
                                <Input value={field.value || ""} disabled={true} className="bg-gray-50" />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* District Display/Dropdown */}
                      <FormField
                        control={profileForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.form.address.district')}</FormLabel>
                            {isEditMode && !isLeader ? (
                              <Select
                                disabled={isProfileUpdating || !profileForm.getValues('province')}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                defaultValue={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={field.value || t('profile.form.address.selectDistrict')} />
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
                            ) : (
                              <FormControl>
                                <Input value={field.value || ""} disabled={true} className="bg-gray-50" />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Sector Display/Dropdown */}
                      <FormField
                        control={profileForm.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.form.address.sector')}</FormLabel>
                            {isEditMode && !isLeader ? (
                              <Select
                                disabled={isProfileUpdating || !profileForm.getValues('district')}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                defaultValue={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={field.value || t('profile.form.address.selectSector')} />
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
                            ) : (
                              <FormControl>
                                <Input value={field.value || ""} disabled={true} className="bg-gray-50" />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Cell Display/Dropdown */}
                      <FormField
                        control={profileForm.control}
                        name="cell"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.form.address.cell')}</FormLabel>
                            {isEditMode && !isLeader ? (
                              <Select
                                disabled={isProfileUpdating || !profileForm.getValues('sector')}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                defaultValue={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={field.value || t('profile.form.address.selectCell')} />
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
                            ) : (
                              <FormControl>
                                <Input value={field.value || ""} disabled={true} className="bg-gray-50" />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Village Display/Dropdown */}
                      <FormField
                        control={profileForm.control}
                        name="village"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.form.address.village')}</FormLabel>
                            {isEditMode && !isLeader ? (
                              <Select
                                disabled={isProfileUpdating || !profileForm.getValues('cell')}
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                defaultValue={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder={field.value || t('profile.form.address.selectVillage')} />
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
                            ) : (
                              <FormControl>
                                <Input value={field.value || ""} disabled={true} className="bg-gray-50" />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex space-x-2">
                    {isEditMode ? (
                      <>
                        <Button type="submit" disabled={isProfileUpdating} className="bg-[#020240] hover:bg-[#020240]/90">
                          {isProfileUpdating ? t('profile.form.buttons.saving') : t('profile.form.buttons.save')}
                        </Button>
                        <Button type="button" variant="outline" onClick={toggleEditMode} disabled={isProfileUpdating}>
                          {t('profile.form.buttons.cancel')}
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={toggleEditMode} className="bg-[#020240] hover:bg-[#020240]/90">
                        {t('profile.form.buttons.edit')}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
