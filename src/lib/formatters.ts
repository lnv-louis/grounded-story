import { Building2, GraduationCap, User, Landmark, Newspaper, Globe, FileText } from "lucide-react";

export const getSourceCategoryIcon = (category?: string) => {
  if (!category) return FileText;
  
  const cat = category.toLowerCase();
  if (cat.includes('news') || cat.includes('outlet')) return Newspaper;
  if (cat.includes('government') || cat.includes('agency')) return Landmark;
  if (cat.includes('research') || cat.includes('institution') || cat.includes('university')) return GraduationCap;
  if (cat.includes('individual') || cat.includes('person')) return User;
  if (cat.includes('organization') || cat.includes('company')) return Building2;
  if (cat.includes('political') || cat.includes('party')) return Landmark;
  
  return Globe;
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Invalid Date';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Add ordinal suffix (st, nd, rd, th)
    const suffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${month} ${day}${suffix(day)}, ${year}`;
  } catch {
    return 'Invalid Date';
  }
};
