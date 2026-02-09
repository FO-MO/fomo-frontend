/**
 * Supabase utilities barrel file
 * Export all Supabase-related functionality from a single import
 */

// Client
export { getSupabaseClient, supabase } from "./client";

// Auth
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  isAuthenticated,
  getAccessToken,
  refreshSession,
  resetPassword,
  updatePassword,
  updateEmail,
  onAuthStateChange,
  type AuthResponse,
  type SignUpOptions,
  type SignInOptions,
} from "./auth";

// Database operations
export {
  // Student Profiles
  getStudentProfile,
  getStudentProfileByStudentId,
  getStudentProfileWithCertificates,
  createStudentProfile,
  updateStudentProfile,
  hasCompletedStudentProfile,
  // Employer Profiles
  getEmployerProfile,
  createEmployerProfile,
  updateEmployerProfile,
  // College Profiles
  getCollegeProfile,
  createCollegeProfile,
  updateCollegeProfile,
  deleteCollegeProfile,
  // College Sets
  getCollegeNames,
  checkCollegeCode,
  getCollegeSets,
  // Posts
  getRecentPosts,
  getUserPosts,
  getPostsByStudentProfile,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  // Comments
  getPostComments,
  createComment,
  deleteComment,
  // Projects
  getProjects,
  getStudentProjects,
  getProjectWithDetails,
  createProject,
  updateProject,
  deleteProject,
  // Clubs
  getClubs,
  getClubsWithAuthors,
  getClub,
  getClubWithDetails,
  createClub,
  // Jobs
  getJobs,
  getJob,
  createJob,
  // Global Job Postings
  getGlobalJobPostings,
  getEmployerGlobalJobPostings,
  createGlobalJobPosting,
  // Data Sets
  getDataSet,
  getDataSetByName,
  // Company Profiles
  getCompanyProfile,
  getCompanyProfileBySlug,
  createCompanyProfile,
  updateCompanyProfile,
  // Certificates
  addCertificate,
  deleteCertificate,
  // Generic helpers
  fetchData,
  postData,
  putData,
} from "./database";

// Storage
export {
  BUCKETS,
  uploadFile,
  uploadProfilePic,
  uploadBackgroundImage,
  uploadCertificate,
  uploadProjectImage,
  uploadPostMedia,
  uploadVideo,
  uploadCompanyAsset,
  uploadEmployerLogo,
  uploadEmployerBackgroundImage,
  uploadMultipleFiles,
  deleteFile,
  deleteFiles,
  getPublicUrl,
  getSignedUrl,
  listFiles,
  moveFile,
  copyFile,
  getStorageUrl,
  extractPathFromUrl,
  type BucketName,
  type UploadResult,
  type UploadOptions,
} from "./storage";

// Types
export type {
  Database,
  Json,
  Tables,
  InsertTables,
  UpdateTables,
  UserProfile,
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
  IndustryEnum,
  CompanySizeEnum,
  CompanyTypeEnum,
  WorkModelEnum,
} from "./types";
