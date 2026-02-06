/**
 * TypeScript types for Supabase database tables
 * These types are based on the Strapi schema migration
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum types matching the SQL schema
export type IndustryEnum =
  | 'Technology'
  | 'Finance'
  | 'Healthcare'
  | 'Education'
  | 'E-commerce'
  | 'Manufacturing'
  | 'Consulting'
  | 'Marketing'
  | 'Real Estate'
  | 'Hospitality'
  | 'Retail'
  | 'Entertainment'
  | 'Automotive'
  | 'Energy'
  | 'Telecommunications'
  | 'Agriculture'
  | 'Construction'
  | 'Pharmaceuticals'
  | 'Aerospace'
  | 'Other';

export type CompanySizeEnum =
  | 'employees_1to10'
  | 'employees_11to50'
  | 'employees_51to200'
  | 'employees_201to500'
  | 'employees_501to1000'
  | 'employees_1001to5000'
  | 'employees_5001to10000'
  | 'employees_10000plus';

export type CompanyTypeEnum =
  | 'Startup'
  | 'Small Business'
  | 'Mid-size Company'
  | 'Enterprise'
  | 'Non-profit'
  | 'Government'
  | 'Educational Institution'
  | 'Self-employed';

export type WorkModelEnum = 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          usertype: string | null;
          confirmed: boolean;
          blocked: boolean;
          provider: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          usertype?: string | null;
          confirmed?: boolean;
          blocked?: boolean;
          provider?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          usertype?: string | null;
          confirmed?: boolean;
          blocked?: boolean;
          provider?: string | null;
          updated_at?: string;
        };
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          student_id: string | null;
          name: string | null;
          email: string | null;
          about: string | null;
          profile_pic: string | null;
          background_img: string | null;
          college: string | null;
          course: string | null;
          location: string | null;
          graduation_year: number | null;
          skills: string[] | null;
          interests: string[] | null;
          verification: number;
          dob: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          student_id?: string | null;
          name?: string | null;
          email?: string | null;
          about?: string | null;
          profile_pic?: string | null;
          background_img?: string | null;
          college?: string | null;
          course?: string | null;
          location?: string | null;
          graduation_year?: number | null;
          skills?: string[] | null;
          interests?: string[] | null;
          verification?: number;
          dob?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          user_id?: string | null;
          student_id?: string | null;
          name?: string | null;
          email?: string | null;
          about?: string | null;
          profile_pic?: string | null;
          background_img?: string | null;
          college?: string | null;
          course?: string | null;
          location?: string | null;
          graduation_year?: number | null;
          skills?: string[] | null;
          interests?: string[] | null;
          verification?: number;
          dob?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      certificates: {
        Row: {
          id: string;
          student_profile_id: string | null;
          title: string | null;
          description: string | null;
          certificate_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_profile_id?: string | null;
          title?: string | null;
          description?: string | null;
          certificate_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          student_profile_id?: string | null;
          title?: string | null;
          description?: string | null;
          certificate_url?: string | null;
          sort_order?: number;
        };
      };
      employer_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          name: string | null;
          description: string | null;
          profile_pic: string | null;
          background_img: string | null;
          website: string | null;
          industry: string | null;
          location: string | null;
          no_of_employers: number | null;
          specialties: string | null;
          phone_number: number | null;
          email: string | null;
          country_code: number | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name?: string | null;
          description?: string | null;
          profile_pic?: string | null;
          background_img?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          no_of_employers?: number | null;
          specialties?: string | null;
          phone_number?: number | null;
          email?: string | null;
          country_code?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          user_id?: string | null;
          name?: string | null;
          description?: string | null;
          profile_pic?: string | null;
          background_img?: string | null;
          website?: string | null;
          industry?: string | null;
          location?: string | null;
          no_of_employers?: number | null;
          specialties?: string | null;
          phone_number?: number | null;
          email?: string | null;
          country_code?: number | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      employer_data: {
        Row: {
          id: string;
          employer_profile_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          employer_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          employer_profile_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      college_profiles: {
        Row: {
          id: string;
          college_name: string | null;
          description: string | null;
          ranking: string | null;
          location: string | null;
          number_of_students: string | null;
          establishment_date: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          college_name?: string | null;
          description?: string | null;
          ranking?: string | null;
          location?: string | null;
          number_of_students?: string | null;
          establishment_date?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          college_name?: string | null;
          description?: string | null;
          ranking?: string | null;
          location?: string | null;
          number_of_students?: string | null;
          establishment_date?: string | null;
          user_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      college_sets: {
        Row: {
          id: string;
          name: string | null;
          code: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          code: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          name?: string | null;
          code?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string | null;
          company: string | null;
          location: string | null;
          description: string | null;
          salary: number | null;
          date: string | null;
          skill: Json | null;
          image: string | null;
          employer_data_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          company?: string | null;
          location?: string | null;
          description?: string | null;
          salary?: number | null;
          date?: string | null;
          skill?: Json | null;
          image?: string | null;
          employer_data_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          title?: string | null;
          company?: string | null;
          location?: string | null;
          description?: string | null;
          salary?: number | null;
          date?: string | null;
          skill?: Json | null;
          image?: string | null;
          employer_data_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      company_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string;
          slug: string | null;
          tagline: string | null;
          logo: string | null;
          cover_image: string | null;
          about: string | null;
          industry: IndustryEnum | null;
          company_size: CompanySizeEnum | null;
          company_type: CompanyTypeEnum | null;
          founded_year: number | null;
          headquarters: string | null;
          locations: Json | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          social_links: Json | null;
          mission: string | null;
          vision: string | null;
          values: Json | null;
          culture: string | null;
          benefits: Json | null;
          specialties: Json | null;
          products: Json | null;
          achievements: Json | null;
          funding: string | null;
          investors: Json | null;
          revenue: string | null;
          ceo: string | null;
          leadership: Json | null;
          employee_testimonials: Json | null;
          company_photos: string[] | null;
          company_videos: string[] | null;
          diversity_statement: string | null;
          sustainability_initiatives: string | null;
          tech_stack: Json | null;
          work_model: WorkModelEnum | null;
          glassdoor_rating: number | null;
          employee_count: number | null;
          growth_rate: number | null;
          client_logos: string[] | null;
          press_releases: Json | null;
          is_verified: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_name: string;
          slug?: string | null;
          tagline?: string | null;
          logo?: string | null;
          cover_image?: string | null;
          about?: string | null;
          industry?: IndustryEnum | null;
          company_size?: CompanySizeEnum | null;
          company_type?: CompanyTypeEnum | null;
          founded_year?: number | null;
          headquarters?: string | null;
          locations?: Json | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          social_links?: Json | null;
          mission?: string | null;
          vision?: string | null;
          values?: Json | null;
          culture?: string | null;
          benefits?: Json | null;
          specialties?: Json | null;
          products?: Json | null;
          achievements?: Json | null;
          funding?: string | null;
          investors?: Json | null;
          revenue?: string | null;
          ceo?: string | null;
          leadership?: Json | null;
          employee_testimonials?: Json | null;
          company_photos?: string[] | null;
          company_videos?: string[] | null;
          diversity_statement?: string | null;
          sustainability_initiatives?: string | null;
          tech_stack?: Json | null;
          work_model?: WorkModelEnum | null;
          glassdoor_rating?: number | null;
          employee_count?: number | null;
          growth_rate?: number | null;
          client_logos?: string[] | null;
          press_releases?: Json | null;
          is_verified?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          user_id?: string | null;
          company_name?: string;
          slug?: string | null;
          tagline?: string | null;
          logo?: string | null;
          cover_image?: string | null;
          about?: string | null;
          industry?: IndustryEnum | null;
          company_size?: CompanySizeEnum | null;
          company_type?: CompanyTypeEnum | null;
          founded_year?: number | null;
          headquarters?: string | null;
          locations?: Json | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          social_links?: Json | null;
          mission?: string | null;
          vision?: string | null;
          values?: Json | null;
          culture?: string | null;
          benefits?: Json | null;
          specialties?: Json | null;
          products?: Json | null;
          achievements?: Json | null;
          funding?: string | null;
          investors?: Json | null;
          revenue?: string | null;
          ceo?: string | null;
          leadership?: Json | null;
          employee_testimonials?: Json | null;
          company_photos?: string[] | null;
          company_videos?: string[] | null;
          diversity_statement?: string | null;
          sustainability_initiatives?: string | null;
          tech_stack?: Json | null;
          work_model?: WorkModelEnum | null;
          glassdoor_rating?: number | null;
          employee_count?: number | null;
          growth_rate?: number | null;
          client_logos?: string[] | null;
          press_releases?: Json | null;
          is_verified?: boolean;
          is_featured?: boolean;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string | null;
          image: string | null;
          description: string | null;
          author: string | null;
          no_members: number | null;
          skills: Json | null;
          join: boolean | null;
          student_profile_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          image?: string | null;
          description?: string | null;
          author?: string | null;
          no_members?: number | null;
          skills?: Json | null;
          join?: boolean | null;
          student_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          title?: string | null;
          image?: string | null;
          description?: string | null;
          author?: string | null;
          no_members?: number | null;
          skills?: Json | null;
          join?: boolean | null;
          student_profile_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      project_details: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string | null;
          image: string | null;
          title: string | null;
          owner: string | null;
          date: string | null;
          project_description: string | null;
          skills: Json | null;
          stars: number | null;
          project_detail: string | null;
          github_url: string | null;
          need_help: Json | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          image?: string | null;
          title?: string | null;
          owner?: string | null;
          date?: string | null;
          project_description?: string | null;
          skills?: Json | null;
          stars?: number | null;
          project_detail?: string | null;
          github_url?: string | null;
          need_help?: Json | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          project_id?: string | null;
          user_id?: string | null;
          image?: string | null;
          title?: string | null;
          owner?: string | null;
          date?: string | null;
          project_description?: string | null;
          skills?: Json | null;
          stars?: number | null;
          project_detail?: string | null;
          github_url?: string | null;
          need_help?: Json | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          description: string | null;
          user_id: string | null;
          author_id: string | null;
          likes: number;
          liked_by: Json | null;
          images: string[] | null;
          media: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          description?: string | null;
          user_id?: string | null;
          author_id?: string | null;
          likes?: number;
          liked_by?: Json | null;
          images?: string[] | null;
          media?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          description?: string | null;
          user_id?: string | null;
          author_id?: string | null;
          likes?: number;
          liked_by?: Json | null;
          images?: string[] | null;
          media?: string[] | null;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string | null;
          user_id: string | null;
          content: string | null;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          content?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          post_id?: string | null;
          user_id?: string | null;
          content?: string | null;
          sent_at?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      authors: {
        Row: {
          id: string;
          user_id: string | null;
          profile_pic: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          profile_pic?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          user_id?: string | null;
          profile_pic?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      clubs: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          no_member: number | null;
          skills: Json | null;
          author_id: string | null;
          pic: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          no_member?: number | null;
          skills?: Json | null;
          author_id?: string | null;
          pic?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          title?: string | null;
          description?: string | null;
          no_member?: number | null;
          skills?: Json | null;
          author_id?: string | null;
          pic?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      fomo_videos: {
        Row: {
          id: string;
          thumbnail: string | null;
          video: string | null;
          title: string | null;
          description: string | null;
          author_id: string | null;
          club_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          thumbnail?: string | null;
          video?: string | null;
          title?: string | null;
          description?: string | null;
          author_id?: string | null;
          club_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          thumbnail?: string | null;
          video?: string | null;
          title?: string | null;
          description?: string | null;
          author_id?: string | null;
          club_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      global_job_postings: {
        Row: {
          id: string;
          data: Json | null;
          employer_profile_id: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          data?: Json | null;
          employer_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          data?: Json | null;
          employer_profile_id?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      college_job_postings: {
        Row: {
          id: string;
          data: Json | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          data?: Json | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          data?: Json | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      employer_applications: {
        Row: {
          id: string;
          data: Json | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          data?: Json | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          data?: Json | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      employer_dash_tiles: {
        Row: {
          id: string;
          application_number: number | null;
          application_percentage: number | null;
          active_jobs: number | null;
          active_jobs_college: number | null;
          active_jobs_week: number | null;
          hire_time: number | null;
          hire_time_industrial: number | null;
          hire_time_improvement: number | null;
          hire_month: number | null;
          hire_conversion: number | null;
          hire_percent: number | null;
          cost_save: number | null;
          cost_redn_percentage: number | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          application_number?: number | null;
          application_percentage?: number | null;
          active_jobs?: number | null;
          active_jobs_college?: number | null;
          active_jobs_week?: number | null;
          hire_time?: number | null;
          hire_time_industrial?: number | null;
          hire_time_improvement?: number | null;
          hire_month?: number | null;
          hire_conversion?: number | null;
          hire_percent?: number | null;
          cost_save?: number | null;
          cost_redn_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          application_number?: number | null;
          application_percentage?: number | null;
          active_jobs?: number | null;
          active_jobs_college?: number | null;
          active_jobs_week?: number | null;
          hire_time?: number | null;
          hire_time_industrial?: number | null;
          hire_time_improvement?: number | null;
          hire_month?: number | null;
          hire_conversion?: number | null;
          hire_percent?: number | null;
          cost_save?: number | null;
          cost_redn_percentage?: number | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      data_sets: {
        Row: {
          id: string;
          name: string | null;
          data: Json | null;
          created_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          data?: Json | null;
          created_at?: string;
          published_at?: string | null;
        };
        Update: {
          name?: string | null;
          data?: Json | null;
          published_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      industry_enum: IndustryEnum;
      company_size_enum: CompanySizeEnum;
      company_type_enum: CompanyTypeEnum;
      work_model_enum: WorkModelEnum;
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience type aliases
export type UserProfile = Tables<'user_profiles'>;
export type StudentProfile = Tables<'student_profiles'>;
export type EmployerProfile = Tables<'employer_profiles'>;
export type CollegeProfile = Tables<'college_profiles'>;
export type CompanyProfile = Tables<'company_profiles'>;
export type Post = Tables<'posts'>;
export type Comment = Tables<'comments'>;
export type Project = Tables<'projects'>;
export type ProjectDetail = Tables<'project_details'>;
export type Club = Tables<'clubs'>;
export type Job = Tables<'jobs'>;
export type GlobalJobPosting = Tables<'global_job_postings'>;
export type CollegeSet = Tables<'college_sets'>;
export type Certificate = Tables<'certificates'>;
