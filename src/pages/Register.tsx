import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { getProvinces, getDistricts, getSectors, getCells, getVillages } from "../utils/locationHelpers";

// Create a function to generate the form schema with translations
const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(2, t('register.validation.name')),
    email: z.string().email(t('register.validation.email')),
    password: z.string().min(6, t('register.validation.password')),
    confirmPassword: z.string().min(6, t('register.validation.confirmPassword')),
    province: z.string().min(1, t('register.validation.province')),
    district: z.string().min(1, t('register.validation.district')),
    sector: z.string().min(1, t('register.validation.sector')),
    cell: z.string().min(1, t('register.validation.cell')),
    village: z.string().min(1, t('register.validation.village')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('register.validation.passwordsMatch'),
    path: ["confirmPassword"],
  });
};

const Register = () => {
  const { t } = useTranslation();
  
  // Create the form schema with the current translations
  const formSchema = createFormSchema(t);
  
  // Define the form data type
  type FormData = z.infer<typeof formSchema>;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [provinces] = useState<string[]>(getProvinces());
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });
  
  const watchProvince = form.watch("province");
  const watchDistrict = form.watch("district");
  const watchSector = form.watch("sector");
  const watchCell = form.watch("cell");
  
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
  
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector) {
      const newCells = getCells(watchProvince, watchDistrict, watchSector);
      setCells(newCells);
      form.setValue("cell", "");
      form.setValue("village", "");
      setVillages([]);
    }
  }, [watchProvince, watchDistrict, watchSector, form]);
  
  useEffect(() => {
    if (watchProvince && watchDistrict && watchSector && watchCell) {
      const newVillages = getVillages(watchProvince, watchDistrict, watchSector, watchCell);
      setVillages(newVillages);
      form.setValue("village", "");
    }
  }, [watchProvince, watchDistrict, watchSector, watchCell, form]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      address: {
        province: data.province,
        district: data.district,
        sector: data.sector,
        cell: data.cell,
        village: data.village
      }
    }));
    
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('register.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('register.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.form.name.label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('register.form.name.placeholder')} 
                        {...field} 
                        disabled={isLoading}
                      />
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
                    <FormLabel>{t('register.form.email.label')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder={t('register.form.email.placeholder')} 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.form.password.label')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder={t('register.form.password.placeholder')} 
                          {...field} 
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? t('register.form.password.hide') : t('register.form.password.show')}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.form.confirmPassword.label')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('register.form.confirmPassword.placeholder')} 
                          {...field} 
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword ? t('register.form.password.hide') : t('register.form.password.show')}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2 pb-1">
                <h3 className="text-sm font-medium">{t('register.form.address.title')}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('register.form.province.label')}</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={t('register.form.province.placeholder')} />
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
                      <FormLabel>{t('register.form.district.label')}</FormLabel>
                      <Select
                        disabled={isLoading || !watchProvince}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={t('register.form.district.placeholder')} />
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
                      <FormLabel>{t('register.form.sector.label')}</FormLabel>
                      <Select
                        disabled={isLoading || !watchDistrict}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={t('register.form.sector.placeholder')} />
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
                      <FormLabel>{t('register.form.cell.label')}</FormLabel>
                      <Select
                        disabled={isLoading || !watchSector}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={t('register.form.cell.placeholder')} />
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
                      <FormLabel>{t('register.form.village.label')}</FormLabel>
                      <Select
                        disabled={isLoading || !watchCell}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder={t('register.form.village.placeholder')} />
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('register.button.loading')}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('register.button.register')}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center">
            {t('register.footer.haveAccount')}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t('register.footer.signIn')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
