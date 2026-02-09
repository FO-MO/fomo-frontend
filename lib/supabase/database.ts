/**
 * Supabase Database Utilities
 * CRUD operations for all tables - replaces Strapi API calls
 */
import { getSupabaseClient } from "./client";
import type {
  StudentProfile,
  EmployerProfile,
  CollegeProfile,
  CompanyProfile,
  Post,
  Comment,
  Project,
  ProjectDetail,
  Club,
  Job,
  GlobalJobPosting,
  CollegeSet,
  Certificate,
  InsertTables,
  UpdateTables,
  Json,
} from "./types";

// ============================================
// STUDENT PROFILES
// ============================================

/**
 * Get student profile by user ID
 * Replaces: getStudentProfile(studentId, token)
 */
export async function getStudentProfile(
  userId: string,
): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch student profile:", error);
    return null;
  }

  return data;
}

/**
 * Get student profile by student ID (legacy support)
 */
export async function getStudentProfileByStudentId(
  studentId: string,
): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("student_id", studentId)
    .single();

  if (error) {
    console.error("Failed to fetch student profile:", error);
    return null;
  }

  return data;
}

/**
 * Get student profile with certificates
 */
export async function getStudentProfileWithCertificates(
  userId: string,
): Promise<{
  profile: StudentProfile | null;
  certificates: Certificate[];
}> {
  const supabase = getSupabaseClient();

  const { data: profile, error: profileError } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    console.error("Failed to fetch student profile:", profileError);
    return { profile: null, certificates: [] };
  }

  const { data: certificates, error: certError } = await supabase
    .from("certificates")
    .select("*")
    .eq("student_profile_id", profile.id)
    .order("sort_order", { ascending: true });

  if (certError) {
    console.error("Failed to fetch certificates:", certError);
    return { profile, certificates: [] };
  }

  return { profile, certificates: certificates || [] };
}

/**
 * Create student profile
 * Replaces: createStudentProfile(data, token)
 */
export async function createStudentProfile(
  data: InsertTables<"student_profiles">,
): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("student_profiles")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create student profile:", error);
    return null;
  }

  return profile;
}

/**
 * Update student profile
 * Replaces: updateStudentProfile(documentId, data, token)
 */
export async function updateStudentProfile(
  profileId: string,
  data: UpdateTables<"student_profiles">,
): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("student_profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update student profile:", error);
    return null;
  }

  return profile;
}

/**
 * Check if student has completed profile
 * Replaces: hasCompletedProfile(studentId, token)
 */
export async function hasCompletedStudentProfile(
  userId: string,
): Promise<boolean> {
  const profile = await getStudentProfile(userId);
  if (!profile) return false;

  return !!(
    profile.name &&
    profile.college &&
    profile.course &&
    profile.graduation_year &&
    profile.about
  );
}

// ============================================
// EMPLOYER PROFILES
// ============================================

/**
 * Get employer profile by user ID
 */
export async function getEmployerProfile(
  userId: string,
): Promise<EmployerProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch employer profile:", error);
    return null;
  }

  return data;
}

/**
 * Create employer profile
 */
export async function createEmployerProfile(
  data: InsertTables<"employer_profiles">,
): Promise<EmployerProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("employer_profiles")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create employer profile:", error);
    return null;
  }

  return profile;
}

/**
 * Update employer profile
 */
export async function updateEmployerProfile(
  profileId: string,
  data: UpdateTables<"employer_profiles">,
): Promise<EmployerProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("employer_profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update employer profile:", error);
    return null;
  }

  return profile;
}

// ============================================
// COLLEGE PROFILES
// ============================================

/**
 * Get college profile by user ID
 * Replaces: getCollegeProfile(token) and getCollegeProfileById(token, userId)
 */
export async function getCollegeProfile(
  userId: string,
): Promise<CollegeProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("college_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch college profile:", error);
    return null;
  }

  return data;
}

/**
 * Create college profile
 * Replaces: createCollegeProfile(data, token)
 */
export async function createCollegeProfile(
  data: InsertTables<"college_profiles">,
): Promise<CollegeProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("college_profiles")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create college profile:", error);
    return null;
  }

  return profile;
}

/**
 * Update college profile
 * Replaces: updateCollegeProfile(documentId, data, token)
 */
export async function updateCollegeProfile(
  profileId: string,
  data: UpdateTables<"college_profiles">,
): Promise<CollegeProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("college_profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update college profile:", error);
    return null;
  }

  return profile;
}

/**
 * Delete college profile
 * Replaces: deleteCollegeProfile(documentId, token)
 */
export async function deleteCollegeProfile(
  profileId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("college_profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    console.error("Failed to delete college profile:", error);
    return false;
  }

  return true;
}

// ============================================
// COLLEGE SETS
// ============================================

/**
 * Get all college names
 * Replaces: fetchColleges(token) with namesOnly query
 */
export async function getCollegeNames(): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("college_sets").select("name");

  if (error) {
    console.error("Failed to fetch college names:", error);
    return [];
  }

  return (
    (data as Array<{ name: string | null }>)
      ?.map((entry) => entry.name)
      .filter((name): name is string => !!name) || []
  );
}

/**
 * Check if college code exists
 */
export async function checkCollegeCode(
  code: string,
): Promise<{ found: boolean; name?: string }> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("college_sets")
    .select("name")
    .eq("code", code)
    .single();

  if (error || !data) {
    return { found: false };
  }

  const result = data as { name: string | null };
  return { found: true, name: result.name || undefined };
}

/**
 * Get all college sets
 */
export async function getCollegeSets(): Promise<CollegeSet[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("college_sets")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch college sets:", error);
    return [];
  }

  return data || [];
}

// ============================================
// POSTS
// ============================================

/**
 * Get recent posts with author info
 * Replaces: fetching posts from /api/posts?populate=*&sort=createdAt:desc
 */
export async function getRecentPosts(limit = 20): Promise<
  Array<
    Post & {
      author: StudentProfile | null;
    }
  >
> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:student_profiles!author_id (*)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Get posts by user
 */
export async function getUserPosts(userId: string): Promise<Post[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Get posts by student profile
 */
export async function getPostsByStudentProfile(
  studentProfileId: string,
): Promise<Post[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", studentProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }

  return data || [];
}

/**
 * Create a post
 */
export async function createPost(
  data: InsertTables<"posts">,
): Promise<Post | null> {
  const supabase = getSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create post:", error);
    return null;
  }

  return post;
}

/**
 * Update a post
 */
export async function updatePost(
  postId: string,
  data: UpdateTables<"posts">,
): Promise<Post | null> {
  const supabase = getSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update post:", error);
    return null;
  }

  return post;
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error("Failed to delete post:", error);
    return false;
  }

  return true;
}

/**
 * Like a post
 */
export async function likePost(
  postId: string,
  userId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  // First, get the current post data
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("likes, liked_by")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    console.error("Failed to fetch post:", fetchError);
    return false;
  }

  const likedBy = (post.liked_by as string[]) || [];
  if (likedBy.includes(userId)) {
    return true; // Already liked
  }

  const { error } = await supabase
    .from("posts")
    .update({
      likes: post.likes + 1,
      liked_by: [...likedBy, userId],
    })
    .eq("id", postId);

  if (error) {
    console.error("Failed to like post:", error);
    return false;
  }

  return true;
}

/**
 * Unlike a post
 */
export async function unlikePost(
  postId: string,
  userId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("likes, liked_by")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    console.error("Failed to fetch post:", fetchError);
    return false;
  }

  const likedBy = (post.liked_by as string[]) || [];
  if (!likedBy.includes(userId)) {
    return true; // Not liked
  }

  const { error } = await supabase
    .from("posts")
    .update({
      likes: Math.max(0, post.likes - 1),
      liked_by: likedBy.filter((id) => id !== userId),
    })
    .eq("id", postId);

  if (error) {
    console.error("Failed to unlike post:", error);
    return false;
  }

  return true;
}

// ============================================
// COMMENTS
// ============================================

/**
 * Get comments for a post
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }

  return data || [];
}

/**
 * Create a comment
 */
export async function createComment(
  data: InsertTables<"comments">,
): Promise<Comment | null> {
  const supabase = getSupabaseClient();

  const { data: comment, error } = await supabase
    .from("comments")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create comment:", error);
    return null;
  }

  return comment;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Failed to delete comment:", error);
    return false;
  }

  return true;
}

// ============================================
// PROJECTS
// ============================================

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }

  return data || [];
}

/**
 * Get projects by student profile
 */
export async function getStudentProjects(
  studentProfileId: string,
): Promise<Project[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("student_profile_id", studentProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch student projects:", error);
    return [];
  }

  return data || [];
}

/**
 * Get project with details
 */
export async function getProjectWithDetails(projectId: string): Promise<{
  project: Project | null;
  details: ProjectDetail | null;
}> {
  const supabase = getSupabaseClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError) {
    console.error("Failed to fetch project:", projectError);
    return { project: null, details: null };
  }

  const { data: details, error: detailsError } = await supabase
    .from("project_details")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (detailsError && detailsError.code !== "PGRST116") {
    console.error("Failed to fetch project details:", detailsError);
  }

  return { project, details: details || null };
}

/**
 * Create a project
 */
export async function createProject(
  data: InsertTables<"projects">,
): Promise<Project | null> {
  const supabase = getSupabaseClient();

  const { data: project, error } = await supabase
    .from("projects")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create project:", error);
    return null;
  }

  return project;
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  data: UpdateTables<"projects">,
): Promise<Project | null> {
  const supabase = getSupabaseClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update project:", error);
    return null;
  }

  return project;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Failed to delete project:", error);
    return false;
  }

  return true;
}

// ============================================
// CLUBS
// ============================================

/**
 * Get all clubs
 */
export async function getClubs(): Promise<Club[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch clubs:", error);
    return [];
  }

  return data || [];
}

/**
 * Get all clubs with author information
 */
export async function getClubsWithAuthors(): Promise<any[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("clubs")
    .select(
      `
      *,
      authors!clubs_author_id_fkey (
        id,
        user_id,
        profile_pic,
        user_profiles!authors_user_id_fkey (
          username
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch clubs with authors:", error);
    return [];
  }

  return data || [];
}

/**
 * Get club by ID with videos and author
 */
export async function getClubWithDetails(clubId: string): Promise<{
  id: string;
  title: string;
  description: string;
  fomo_videos?: Array<{
    id: string;
    title: string;
    description: string;
    video: string;
    thumbnail: string;
    created_at: string;
    author_id: string;
    user_profiles?: {
      username: string;
    };
  }>;
} | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("clubs")
    .select(
      `
      *,
      authors!clubs_author_id_fkey (
        id,
        user_id,
        profile_pic,
        user_profiles!authors_user_id_fkey (
          username
        )
      ),
      fomo_videos (
        id,
        title,
        description,
        video,
        thumbnail,
        created_at,
        author_id,
        user_profiles!fomo_videos_author_id_fkey (
          username
        )
      )
    `,
    )
    .eq("id", clubId)
    .single();

  if (error) {
    console.error("Failed to fetch club with details:", error);
    return null;
  }

  return data;
}

/**
 * Get club by ID
 */
export async function getClub(clubId: string): Promise<Club | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", clubId)
    .single();

  if (error) {
    console.error("Failed to fetch club:", error);
    return null;
  }

  return data;
}

/**
 * Create a club
 */
export async function createClub(
  data: InsertTables<"clubs">,
): Promise<Club | null> {
  const supabase = getSupabaseClient();

  const { data: club, error } = await supabase
    .from("clubs")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create club:", error);
    return null;
  }

  return club;
}

// ============================================
// JOBS
// ============================================

/**
 * Get all jobs
 */
export async function getJobs(): Promise<Job[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }

  return data || [];
}

/**
 * Get job by ID
 */
export async function getJob(jobId: string): Promise<Job | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }

  return data;
}

/**
 * Create a job
 */
export async function createJob(
  data: InsertTables<"jobs">,
): Promise<Job | null> {
  const supabase = getSupabaseClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create job:", error);
    return null;
  }

  return job;
}

// ============================================
// GLOBAL JOB POSTINGS
// ============================================

/**
 * Get all global job postings
 */
export async function getGlobalJobPostings(): Promise<GlobalJobPosting[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("global_job_postings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch global job postings:", error);
    return [];
  }

  return data || [];
}

/**
 * Get global job postings by employer
 */
export async function getEmployerGlobalJobPostings(
  employerProfileId: string,
): Promise<GlobalJobPosting[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("global_job_postings")
    .select("*")
    .eq("employer_profile_id", employerProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch employer job postings:", error);
    return [];
  }

  return data || [];
}

/**
 * Create global job posting
 */
export async function createGlobalJobPosting(
  data: InsertTables<"global_job_postings">,
): Promise<GlobalJobPosting | null> {
  const supabase = getSupabaseClient();

  const { data: posting, error } = await supabase
    .from("global_job_postings")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create global job posting:", error);
    return null;
  }

  return posting;
}

// ============================================
// DATA SETS (for colleges list, etc.)
// ============================================

/**
 * Get data set by ID
 * Replaces: fetchColleges(token) which fetched from data-sets endpoint
 */
export async function getDataSet(dataSetId: string): Promise<Json | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("data_sets")
    .select("data")
    .eq("id", dataSetId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch data set:", error);
    return null;
  }

  return data?.data || null;
}

/**
 * Get data set by name
 */
export async function getDataSetByName(name: string): Promise<Json | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("data_sets")
    .select("data")
    .eq("name", name)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch data set:", error);
    return null;
  }

  return data?.data || null;
}

// ============================================
// COMPANY PROFILES
// ============================================

/**
 * Get company profile by user ID
 */
export async function getCompanyProfile(
  userId: string,
): Promise<CompanyProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch company profile:", error);
    return null;
  }

  return data;
}

/**
 * Get company profile by slug
 */
export async function getCompanyProfileBySlug(
  slug: string,
): Promise<CompanyProfile | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to fetch company profile:", error);
    return null;
  }

  return data;
}

/**
 * Create company profile
 */
export async function createCompanyProfile(
  data: InsertTables<"company_profiles">,
): Promise<CompanyProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("company_profiles")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to create company profile:", error);
    return null;
  }

  return profile;
}

/**
 * Update company profile
 */
export async function updateCompanyProfile(
  profileId: string,
  data: UpdateTables<"company_profiles">,
): Promise<CompanyProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error } = await supabase
    .from("company_profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update company profile:", error);
    return null;
  }

  return profile;
}

// ============================================
// CERTIFICATES
// ============================================

/**
 * Add certificate to student profile
 */
export async function addCertificate(
  data: InsertTables<"certificates">,
): Promise<Certificate | null> {
  const supabase = getSupabaseClient();

  const { data: cert, error } = await supabase
    .from("certificates")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Failed to add certificate:", error);
    return null;
  }

  return cert;
}

/**
 * Delete certificate
 */
export async function deleteCertificate(
  certificateId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", certificateId);

  if (error) {
    console.error("Failed to delete certificate:", error);
    return false;
  }

  return true;
}

// ============================================
// GENERIC FETCH HELPERS (for backward compatibility)
// ============================================

/**
 * Generic fetch from any table
 * Replaces: fetchData(token, endpoint)
 */
export async function fetchData<T>(
  table: keyof import("./types").Database["public"]["Tables"],
  filters?: { column: string; value: unknown }[],
): Promise<T[]> {
  const supabase = getSupabaseClient();

  let query = supabase.from(table).select("*");

  if (filters) {
    for (const filter of filters) {
      query = query.eq(filter.column, filter.value);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Failed to fetch from ${table}:`, error);
    return [];
  }

  return (data || []) as T[];
}

/**
 * Generic insert into any table
 * Replaces: postData(token, endpoint, data)
 */
export async function postData<T>(
  table: keyof import("./types").Database["public"]["Tables"],
  data: Record<string, unknown>,
): Promise<T | null> {
  const supabase = getSupabaseClient();

  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error(`Failed to insert into ${table}:`, error);
    return null;
  }

  return result as T;
}

/**
 * Generic update in any table
 * Replaces: putData(token, endpoint, data)
 */
export async function putData<T>(
  table: keyof import("./types").Database["public"]["Tables"],
  id: string,
  data: Record<string, unknown>,
): Promise<T | null> {
  const supabase = getSupabaseClient();

  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Failed to update ${table}:`, error);
    return null;
  }

  return result as T;
}
