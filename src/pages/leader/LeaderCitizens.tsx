import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertCircle, Search, Users, Mail, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import AppLayout from "../../components/layout/AppLayout";
import { getLeaderCitizens, Citizen } from "../../services/citizenService";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

const LeaderCitizens = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const itemsPerPage = 10;

  // Get the current leader's location data
  const leader = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderCitizens();
        setCitizens(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch citizens");
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  // Determine the leader's administrative level and generate appropriate filter options
  const { adminLevel, locationOptions } = useMemo(() => {
    let level = "";
    const options = [];
    
    // Determine the most specific administrative level of the leader
    if (leader?.village) {
      level = "village";
      // Village leaders can only see citizens in their village
      options.push({ value: "village", label: `${leader.village} Village` });
    } else if (leader?.cell) {
      level = "cell";
      // Cell leaders can only see citizens in their cell
      options.push({ value: "cell", label: `${leader.cell} Cell` });
    } else if (leader?.sector) {
      level = "sector";
      // Sector leaders can only see citizens in their sector
      options.push({ value: "sector", label: `${leader.sector} Sector` });
    } else if (leader?.district) {
      level = "district";
      // District leaders can only see citizens in their district
      options.push({ value: "district", label: `${leader.district} District` });
    } else if (leader?.province) {
      level = "province";
      // Province leaders can only see citizens in their province
      options.push({ value: "province", label: `${leader.province} Province` });
    }
    
    return { adminLevel: level, locationOptions: options };
  }, [leader]);

  // Filter citizens based on search term and ensure they're within the leader's administrative scope
  const filteredCitizens = useMemo(() => {
    // First filter citizens to only those within the leader's administrative scope
    const scopedCitizens = citizens.filter((citizen) => {
      // Match based on the leader's administrative level
      switch (adminLevel) {
        case "village":
          return citizen.village === leader?.village;
        case "cell":
          return citizen.cell === leader?.cell;
        case "sector":
          return citizen.sector === leader?.sector;
        case "district":
          return citizen.district === leader?.district;
        case "province":
          return citizen.province === leader?.province;
        default:
          return false;
      }
    });
    
    // Then apply search filter to the scoped citizens
    return scopedCitizens.filter((citizen) => {
      return searchTerm === "" || 
        citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [citizens, searchTerm, adminLevel, leader]);

  // Pagination
  const totalPages = Math.ceil(filteredCitizens.length / itemsPerPage);
  const paginatedCitizens = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCitizens.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCitizens, currentPage]);

  // Get location string
  const getLocationString = (citizen: Citizen) => {
    const parts = [];
    
    if (citizen?.village) parts.push(`${citizen.village} Village`);
    if (citizen?.cell) parts.push(`${citizen.cell} Cell`);
    if (citizen?.sector) parts.push(`${citizen.sector} Sector`);
    if (citizen?.district) parts.push(`${citizen.district} District`);
    if (citizen?.province) parts.push(`${citizen.province} Province`);
    
    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Citizens</h1>
            <p className="text-muted-foreground">
              Manage and view citizens under your administration
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Citizens
            </CardTitle>
            <CardDescription>
              Use the filters below to find specific citizens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search by Name or Email
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search citizens..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
              </div>
              {locationOptions.length > 1 && (
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Filter by Location
                  </label>
                  <Select
                    value={locationFilter}
                    onValueChange={(value) => {
                      setLocationFilter(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Citizens Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Citizens List
            </CardTitle>
            <CardDescription>
              {filteredCitizens.length} {filteredCitizens.length === 1 ? "citizen" : "citizens"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCitizens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No citizens found matching your filters.</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCitizens.map((citizen) => (
                        <TableRow key={citizen.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-[#020240] flex items-center justify-center text-white">
                                {citizen.name.charAt(0)}
                              </div>
                              {citizen.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {citizen.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="max-w-[300px] truncate" title={getLocationString(citizen)}>
                                {getLocationString(citizen)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => setCurrentPage(index + 1)}
                              isActive={currentPage === index + 1}
                              className="cursor-pointer"
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            aria-disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Statistics Card */}
        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Citizen Statistics</CardTitle>
              <CardDescription>
                Summary of citizens under your administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Citizens</span>
                  <span className="text-3xl font-bold text-[#020240]">{filteredCitizens.length}</span>
                </div>
                
                {adminLevel === "village" && leader?.village && (
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">In {leader.village} Village</span>
                    <span className="text-3xl font-bold text-[#020240]">
                      {filteredCitizens.length}
                    </span>
                  </div>
                )}
                
                {adminLevel === "cell" && leader?.cell && (
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">In {leader.cell} Cell</span>
                    <span className="text-3xl font-bold text-[#020240]">
                      {filteredCitizens.length}
                    </span>
                  </div>
                )}
                
                {adminLevel === "sector" && leader?.sector && (
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">In {leader.sector} Sector</span>
                    <span className="text-3xl font-bold text-[#020240]">
                      {filteredCitizens.length}
                    </span>
                  </div>
                )}
                
                {adminLevel === "district" && leader?.district && (
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">In {leader.district} District</span>
                    <span className="text-3xl font-bold text-[#020240]">
                      {filteredCitizens.length}
                    </span>
                  </div>
                )}
                
                {adminLevel === "province" && leader?.province && (
                  <div className="rounded-lg border p-4 flex flex-col">
                    <span className="text-sm text-muted-foreground">In {leader.province} Province</span>
                    <span className="text-3xl font-bold text-[#020240]">
                      {filteredCitizens.length}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default LeaderCitizens;
