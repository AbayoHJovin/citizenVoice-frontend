import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Eye, UserPlus } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { Leader, fetchAllLeaders } from "../../services/adminService";
import { getProvinces, getDistricts, getSectors, getCells, getVillages } from "../../utils/locationHelpers";

const LeadersManagement = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [filteredLeaders, setFilteredLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [scopeFilter, setScopeFilter] = useState("");
  
  // Location filters
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [cellFilter, setCellFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  
  // Location options
  const [provinces] = useState<string[]>(getProvinces());
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  // Fetch leaders data
  useEffect(() => {
    const loadLeaders = async () => {
      try {
        setLoading(true);
        const data = await fetchAllLeaders();
        setLeaders(data);
        setFilteredLeaders(data);
        setError(null);
      } catch (err) {
        setError("Failed to load leaders data. Please try again later.");
        console.error("Error loading leaders:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaders();
  }, []);
  
  // Update districts when province changes
  useEffect(() => {
    if (provinceFilter) {
      const newDistricts = getDistricts(provinceFilter);
      setDistricts(newDistricts);
      setDistrictFilter("");
      setSectorFilter("");
      setCellFilter("");
      setVillageFilter("");
      setSectors([]);
      setCells([]);
      setVillages([]);
    } else {
      setDistricts([]);
      setDistrictFilter("");
    }
  }, [provinceFilter]);
  
  // Update sectors when district changes
  useEffect(() => {
    if (provinceFilter && districtFilter) {
      const newSectors = getSectors(provinceFilter, districtFilter);
      setSectors(newSectors);
      setSectorFilter("");
      setCellFilter("");
      setVillageFilter("");
      setCells([]);
      setVillages([]);
    } else {
      setSectors([]);
      setSectorFilter("");
    }
  }, [provinceFilter, districtFilter]);
  
  // Update cells when sector changes
  useEffect(() => {
    if (provinceFilter && districtFilter && sectorFilter) {
      const newCells = getCells(provinceFilter, districtFilter, sectorFilter);
      setCells(newCells);
      setCellFilter("");
      setVillageFilter("");
      setVillages([]);
    } else {
      setCells([]);
      setCellFilter("");
    }
  }, [provinceFilter, districtFilter, sectorFilter]);
  
  // Update villages when cell changes
  useEffect(() => {
    if (provinceFilter && districtFilter && sectorFilter && cellFilter) {
      const newVillages = getVillages(provinceFilter, districtFilter, sectorFilter, cellFilter);
      setVillages(newVillages);
      setVillageFilter("");
    } else {
      setVillages([]);
      setVillageFilter("");
    }
  }, [provinceFilter, districtFilter, sectorFilter, cellFilter]);
  
  // Filter leaders based on search term and filters
  useEffect(() => {
    let result = leaders;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        leader => 
          leader.name.toLowerCase().includes(term) || 
          leader.email.toLowerCase().includes(term)
      );
    }
    
    // Scope filter
    if (scopeFilter && scopeFilter !== 'all_scopes') {
      result = result.filter(leader => leader.adminstrationScope === scopeFilter);
    }
    
    // Location filters
    if (provinceFilter && provinceFilter !== 'all_provinces') {
      result = result.filter(leader => leader.province === provinceFilter);
      
      if (districtFilter && districtFilter !== 'all_districts') {
        result = result.filter(leader => leader.district === districtFilter);
        
        if (sectorFilter && sectorFilter !== 'all_sectors') {
          result = result.filter(leader => leader.sector === sectorFilter);
          
          if (cellFilter && cellFilter !== 'all_cells') {
            result = result.filter(leader => leader.cell === cellFilter);
            
            if (villageFilter && villageFilter !== 'all_villages') {
              result = result.filter(leader => leader.village === villageFilter);
            }
          }
        }
      }
    }
    
    setFilteredLeaders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [leaders, searchTerm, scopeFilter, provinceFilter, districtFilter, sectorFilter, cellFilter, villageFilter]);
  
  // Get current leaders for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaders = filteredLeaders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaders.length / itemsPerPage);
  
  // Get unique scope values for the filter
  const scopeOptions = Array.from(new Set(leaders.map(leader => leader.adminstrationScope))).filter(Boolean);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get full location string
  const getLocationString = (leader: Leader) => {
    const parts = [
      leader.province,
      leader.district,
      leader.sector,
      leader.cell,
      leader.village
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(" / ") : "N/A";
  };
  
  // Handle view details
  const handleViewDetails = (leaderId: string) => {
    navigate(`/admin/leaders/${leaderId}`);
  };
  
  // Handle add leader
  const handleAddLeader = () => {
    navigate('/admin/leaders/add');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setScopeFilter("");
    setProvinceFilter("");
    setDistrictFilter("");
    setSectorFilter("");
    setCellFilter("");
    setVillageFilter("");
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#020240]/10 p-6 rounded-lg border border-[#020240]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#020240]">Leaders Management</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all leaders in the system
              </p>
            </div>
            <Button 
              onClick={handleAddLeader}
              className="mt-4 md:mt-0 bg-[#020240] hover:bg-[#020240]/90 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Leader
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Scope filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Search</label>
                  <Input
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Administrative Scope</label>
                  <Select value={scopeFilter} onValueChange={setScopeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_scopes">All Scopes</SelectItem>
                      {scopeOptions.map((scope) => (
                        <SelectItem key={scope} value={scope}>
                          {scope}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Location filters */}
              <div>
                <h3 className="text-sm font-medium mb-2">Location Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Province filter */}
                  <div>
                    <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_provinces">All Provinces</SelectItem>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* District filter */}
                  <div>
                    <Select 
                      value={districtFilter} 
                      onValueChange={setDistrictFilter}
                      disabled={!provinceFilter || provinceFilter === "all_provinces"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_districts">All Districts</SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sector filter */}
                  <div>
                    <Select 
                      value={sectorFilter} 
                      onValueChange={setSectorFilter}
                      disabled={!districtFilter || districtFilter === "all_districts"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_sectors">All Sectors</SelectItem>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Cell filter */}
                  <div>
                    <Select 
                      value={cellFilter} 
                      onValueChange={setCellFilter}
                      disabled={!sectorFilter || sectorFilter === "all_sectors"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cell" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_cells">All Cells</SelectItem>
                        {cells.map((cell) => (
                          <SelectItem key={cell} value={cell}>
                            {cell}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Village filter */}
                  <div>
                    <Select 
                      value={villageFilter} 
                      onValueChange={setVillageFilter}
                      disabled={!cellFilter || cellFilter === "all_cells"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Village" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_villages">All Villages</SelectItem>
                        {villages.map((village) => (
                          <SelectItem key={village} value={village}>
                            {village}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Clear filters button */}
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  disabled={!searchTerm && !scopeFilter && !provinceFilter}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Leaders table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Leaders ({filteredLeaders.length})</CardTitle>
              <Button 
                onClick={handleAddLeader}
                className="bg-[#020240] hover:bg-[#020240]/90 flex items-center gap-2 md:hidden"
                size="sm"
              >
                <UserPlus className="h-4 w-4" />
                Add Leader
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#020240]"></div>
              </div>
            ) : filteredLeaders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leaders found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Administrative Scope</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentLeaders.map((leader) => (
                        <TableRow key={leader.id}>
                          <TableCell className="font-medium">{leader.name}</TableCell>
                          <TableCell>{leader.email}</TableCell>
                          <TableCell>{leader.adminstrationScope || "N/A"}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={getLocationString(leader)}>
                            {getLocationString(leader)}
                          </TableCell>
                          <TableCell>{formatDate(leader.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(leader.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaders.length)} of {filteredLeaders.length} leaders
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LeadersManagement;
