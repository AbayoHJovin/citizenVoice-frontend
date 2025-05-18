import rwandaData from './rwanda';

// Helper function to extract provinces
export const getProvinces = (): string[] => {
  return rwandaData.data.map(province => Object.keys(province)[0]);
};

// Helper function to get districts for a specific province
export const getDistricts = (province: string): string[] => {
  const provinceData = rwandaData.data.find(p => Object.keys(p)[0] === province);
  if (!provinceData) return [];
  
  const districts = provinceData[province as keyof typeof provinceData];
  return districts.map((district: any) => Object.keys(district)[0]);
};

// Helper function to get sectors for a specific district in a province
export const getSectors = (province: string, district: string): string[] => {
  const provinceData = rwandaData.data.find(p => Object.keys(p)[0] === province);
  if (!provinceData) return [];
  
  const districts = provinceData[province as keyof typeof provinceData];
  const districtData = districts.find((d: any) => Object.keys(d)[0] === district);
  if (!districtData) return [];
  
  const sectors = districtData[district as keyof typeof districtData];
  return sectors.map((sector: any) => Object.keys(sector)[0]);
};

// Helper function to get cells for a specific sector in a district
export const getCells = (province: string, district: string, sector: string): string[] => {
  const provinceData = rwandaData.data.find(p => Object.keys(p)[0] === province);
  if (!provinceData) return [];
  
  const districts = provinceData[province as keyof typeof provinceData];
  const districtData = districts.find((d: any) => Object.keys(d)[0] === district);
  if (!districtData) return [];
  
  const sectors = districtData[district as keyof typeof districtData];
  const sectorData = sectors.find((s: any) => Object.keys(s)[0] === sector);
  if (!sectorData) return [];
  
  const cells = sectorData[sector as keyof typeof sectorData];
  return cells.map((cell: any) => Object.keys(cell)[0]);
};

// Helper function to get villages for a specific cell in a sector
export const getVillages = (province: string, district: string, sector: string, cell: string): string[] => {
  const provinceData = rwandaData.data.find(p => Object.keys(p)[0] === province);
  if (!provinceData) return [];
  
  const districts = provinceData[province as keyof typeof provinceData];
  const districtData = districts.find((d: any) => Object.keys(d)[0] === district);
  if (!districtData) return [];
  
  const sectors = districtData[district as keyof typeof districtData];
  const sectorData = sectors.find((s: any) => Object.keys(s)[0] === sector);
  if (!sectorData) return [];
  
  const cells = sectorData[sector as keyof typeof sectorData];
  const cellData = cells.find((c: any) => Object.keys(c)[0] === cell);
  if (!cellData) return [];
  
  return cellData[cell as keyof typeof cellData];
};
