

import { format } from 'date-fns';

export interface VisaInfo {
  title: string;
  content: any[];
}

export interface VisaType {
  id: string;
  name: string;
  description: string;
  info: VisaInfo[];
  image: string; // From API or placeholder
  price?: string;
  expected_processing_time?: string;
  detailedDescription?: string;
}

export interface Visa {
  id: string;
  country: string;
  slug: string;
  flag: string; // emoji
  image: string; // API image URL or placeholder id
  tagline: string;
  visaTypes: VisaType[];
  countryCode: string;
  subTagline: string;
  tags: string[];
  appliedCount: number;
  info?: VisaInfo[];
}

export interface SiteSettings {
  id: number;
  address: string;
  email: string;
  email2: string;
  phone_number: string;
  phone_number2: string;
}

export const API_BASE_URL = "https://visa-gateway-api-v1.vercel.app";

const countryToFlag: { [key: string]: string } = {
  'united states': '🇺🇸',
  'canada': '🇨🇦',
  'united kingdom': '🇬🇧',
  'australia': '🇦🇺',
  'japan': '🇯🇵',
  'romania': '🇷🇴',
  'america': '🇺🇸',
  'sudan': '🇸🇩'
};

const mapApiDataToVisa = (item: any): Visa => {
  const countryNameRaw = item.name.toLowerCase();
  const countryName = countryNameRaw === 'america' ? 'United States' : (countryNameRaw.charAt(0).toUpperCase() + countryNameRaw.slice(1));
  const slug = countryName.toLowerCase().replace(/\s/g, '-');
  
  const visaTypes = item.types || [];

  return {
    id: item.id.toString(),
    country: countryName,
    slug: slug,
    flag: countryToFlag[countryName.toLowerCase()] || '🏳️',
    image: item.image || 'hero',
    tagline: item.description || `Explore ${countryName}.`,
    countryCode: item.code,
    subTagline: item.description || `Explore visa options for ${countryName}.`,
    tags: ['Popular', 'schengen'], // Placeholder
    appliedCount: parseInt(item.id, 10) * 121,
    visaTypes: visaTypes.map((type: any) => ({
      id: type.id.toString(),
      name: type.name,
      description: type.headings || `Learn more about the ${type.name} visa.`,
      image: type.image || 'hero-dublin', // Use type image, fallback to placeholder
      info: [] // This will be populated by the detailed fetch
    }))
  };
};

const mapVisaTypeDetailsToInfo = (details: any): { info: VisaInfo[], price?: string, expected_processing_time?: string, detailedDescription?: string } => {
    const info: VisaInfo[] = [];

    if (details.overviews && details.overviews.length > 0) {
        info.push({
            title: "Overview",
            content: details.overviews.map((ov: any) => `${ov.points}: ${ov.overview}`)
        });
    }

    if (details.processes && details.processes.length > 0) {
        info.push({
            title: "Application Process",
            content: details.processes.map((p: any) => p.points)
        });
    }

    if (details.required_documents && details.required_documents.length > 0) {
        info.push({
            title: "Required Documents",
            content: details.required_documents
        });
    }

    if (details.notes && details.notes.length > 0) {
        info.push({
            title: "Important Notes",
            content: details.notes.map((n: any) => n.notes)
        });
    }

    return { 
        info,
        price: details.price,
        expected_processing_time: details.expected_processing_time,
        detailedDescription: details.description
    };
};


export const dummyApplications = [
  {
    id: 'APP-001',
    country: 'United States',
    visaType: 'B-2 Tourist Visa',
    date: '2024-05-15',
    status: 'In Progress',
  },
  {
    id: 'APP-002',
    country: 'Canada',
    visaType: 'Visitor Visa (TRV)',
    date: '2024-04-22',
    status: 'Approved',
  },
  {
    id: 'APP-003',
    country: 'United Kingdom',
    visaType: 'Standard Visitor Visa',
    date: '2024-06-01',
    status: 'Pending',
  },
    {
    id: 'APP-004',
    country: 'Australia',
    visaType: 'Visitor Visa (subclass 600)',
    date: '2024-03-10',
    status: 'Rejected',
  },
];

export const testimonials = [
  {
    name: "Alex Johnson",
    country: "Canada",
    avatar: "https://i.pravatar.cc/150?u=alex_johnson",
    comment: "Schengen visa gateway made my study permit application for Canada a breeze. The process was straightforward and their team was incredibly supportive. Highly recommended!",
  },
  {
    name: "Maria Garcia",
    country: "United Kingdom",
    avatar: "https://i.pravatar.cc/150?u=maria_garcia",
    comment: "I was overwhelmed with the UK visitor visa process, but Schengen visa gateway simplified everything. Their consultants were knowledgeable and guided me at every step. Thank you!",
  },
  {
    name: "Chen Wei",
    country: "Australia",
    avatar: "https://i.pravatar.cc/150?u=chen_wei",
    comment: "Getting my Australian work visa seemed impossible until I found Schengen visa gateway. Their expertise and attention to detail were instrumental in my application's success.",
  },
  {
    name: "Priya Patel",
    country: "United States",
    avatar: "https://i.pravatar.cc/150?u=priya_patel",
    comment: "The AI itinerary planner is a fantastic tool! It helped me understand my visa needs for a multi-country trip starting with the US. The consultant I spoke to was amazing too.",
  }
];

export const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'in_progress': 'secondary',
  'approved': 'default',
  'pending': 'outline',
  'rejected': 'destructive',
  'draft': 'outline',
  'not_uploaded': 'outline',
  'uploaded': 'secondary',
  'approved_by_admin': 'default'
};


export interface Application {
  id: string;
  country: string;
  visaType: string;
  date: string;
  status: string;
  username: string;
  adminNotes: string;
  rejectionReason: string;
  updatedAt: string;
  requiredDocuments: {
    id: number;
    document_name: string;
    status: string;
    document_file: string | null;
    admin_notes: string;
  }[];
  countryId: string;
  visaTypeId: string;
}


let visaDataCache: Visa[] | null = null;

export const getVisas = async (): Promise<Visa[]> => {
  if (visaDataCache) {
    return Promise.resolve(visaDataCache);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries/`);
    if (!response.ok) {
      console.error("Failed to fetch visa data from API");
      return [];
    }
    const data = await response.json();
    visaDataCache = data.map(mapApiDataToVisa);
    return visaDataCache;
  } catch (error) {
    console.error("Error fetching visa data:", error);
    return [];
  }
};

export const getVisaBySlug = async (slug: string): Promise<Visa | undefined> => {
  const visas = await getVisas();
  const visaSummary = visas.find((v) => v.slug === slug);
  if (!visaSummary) return undefined;

  try {
    const response = await fetch(`${API_BASE_URL}/api/countries/${visaSummary.id}/`);
    if (!response.ok) {
      console.error(`Failed to fetch visa details for ${visaSummary.country}`);
      return visaSummary; // Return summary data if details fail
    }
    const detailedData = await response.json();
    return mapApiDataToVisa(detailedData);
  } catch (error) {
    console.error(`Error fetching visa details for ${visaSummary.country}:`, error);
    return visaSummary; // Return summary data on error
  }
};


export const getCountryNames = async (): Promise<string[]> => {
  const visas = await getVisas();
  return Promise.resolve(visas.map(v => v.country));
}

const getVisaTypeDetailsById = async (visaTypeId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/visa-types/${visaTypeId}/`);
        if (!response.ok) {
            console.error(`Failed to fetch details for visa type ${visaTypeId}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching details for visa type ${visaTypeId}:`, error);
        return null;
    }
}

export const getVisaTypeDetails = async (countrySlug: string, visaTypeId: string): Promise<{ country?: Visa, visaType?: VisaType }> => {
  const country = await getVisaBySlug(countrySlug);
  if (!country) {
    return { country: undefined, visaType: undefined };
  }
  
  let visaType = country.visaTypes.find(vt => vt.id === visaTypeId);
  
  if (visaType) {
    const details = await getVisaTypeDetailsById(visaTypeId);
    if (details) {
      const { info, price, expected_processing_time, detailedDescription } = mapVisaTypeDetailsToInfo(details);
      visaType.info = info;
      visaType.price = price;
      visaType.expected_processing_time = expected_processing_time;
      visaType.detailedDescription = detailedDescription;
    }
  }

  return { country, visaType };
};


export const getApplicationById = async (id: string): Promise<Application | null> => {
    try {
        const tokens = localStorage.getItem('tokens');
        if (!tokens) return null;
        const { access } = JSON.parse(tokens);

        const response = await fetch(`${API_BASE_URL}/api/v2/visa-applications/${id}/`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch application ${id}`);
            return null;
        }

        const app = await response.json();
        
        if (!app || !app.country || !app.visa_type) {
            return null;
        }
        
        return {
            id: app.id.toString(),
            country: app.country.name.charAt(0).toUpperCase() + app.country.name.slice(1),
            visaType: app.visa_type.name,
            date: format(new Date(app.created_at), 'yyyy-MM-dd'),
            status: app.status.toLowerCase(),
            username: app.user.username,
            adminNotes: app.admin_notes,
            rejectionReason: app.rejection_reason,
            updatedAt: format(new Date(app.updated_at), 'yyyy-MM-dd HH:mm'),
            requiredDocuments: app.visa_type.required_documents.map((doc: any) => ({
              id: doc.id,
              document_name: doc.document_name,
              status: doc.status ? doc.status.toLowerCase().replace(/ /g, '_') : 'not_uploaded',
              document_file: doc.document_file,
              admin_notes: doc.admin_notes,
            })),
            countryId: app.country.id.toString(),
            visaTypeId: app.visa_type.id.toString(),
        };

    } catch (error) {
        console.error(`Error fetching application ${id}:`, error);
        return null;
    }
};

export const getUserApplications = async (accessToken: string): Promise<Application[]> => {
  if (!accessToken) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/visa-applications/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch applications");
      return [];
    }

    const data = await response.json();
    const applications = data['Applications:'] || [];

    return applications.map((app: any) => ({
      id: app.id.toString(),
      country: app.country.name.charAt(0).toUpperCase() + app.country.name.slice(1),
      visaType: app.visa_type.name,
      date: format(new Date(app.created_at), 'yyyy-MM-dd'),
      status: app.status.toLowerCase(),
      // Add default/empty values for fields not in this summary response
      username: '',
      adminNotes: '',
      rejectionReason: '',
      updatedAt: '',
      requiredDocuments: [],
      countryId: app.country.id.toString(),
      visaTypeId: app.visa_type.id.toString(),
    }));

  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/settings/`);
    if (!response.ok) {
      console.error("Failed to fetch site settings");
      return null;
    }
    const data = await response.json();
    return data as SiteSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
};
