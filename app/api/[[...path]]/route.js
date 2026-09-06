import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const BRANCHES = [
  'AIML',
  'COMPUTER SCIENCE',
  'MECHANICAL ENGINEERING',
  'CIVIL ENGINEERING',
  'ELECTRONICS AND TELECOMMUNICATION',
  'ELECTRICAL ENGINEERING',
  'STAFF'
];

const COMPLAINT_CATEGORIES = [
  'Harassment',
  'Bullying',
  'Ragging',
  'Safety Concern',
  'Infrastructure Issue',
  'Hostel Issue',
  'Medical Emergency',
  'Other'
];

// Categories that require media (photo/video)
const MEDIA_REQUIRED_CATEGORIES = ['Bullying', 'Ragging', 'Infrastructure Issue'];

const AUTO_REPLY_MESSAGE = "Thank you for bringing this infrastructure issue to our attention. We understand the inconvenience it may have caused and sincerely apologize for the same. Our team has taken note of the concern and is currently reviewing the situation to identify the root cause. Necessary steps will be taken to resolve the issue at the earliest and ensure that such problems are minimized in the future. We appreciate your patience and cooperation while we work towards improving the infrastructure and maintaining a better experience for everyone. 👍 HAVE A GOOD DAY 😊";

const MAX_ADMIN_ACCOUNTS = 16;
const MAX_PRINCIPAL_ACCOUNTS = 3;

let client;
let db;

async function connectDB() {
  if (db) return db;
  
  try {
    const mongoUrl = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME || 'student_safety_db';
    
    client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('complaints').createIndex({ branch: 1 });
    await db.collection('complaints').createIndex({ studentId: 1 });
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function validateImageQuality(base64Image) {
  try {
    // Simple validation without external API
    // Check if it's an image
    if (!base64Image.startsWith('data:image/')) {
      return { isValid: true, reason: null }; // Skip validation for videos
    }

    // Extract the base64 data
    const base64Data = base64Image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Validation rules:
    // 1. Minimum file size (at least 50KB for decent quality)
    const minSize = 50 * 1024; // 50KB
    if (imageBuffer.length < minSize) {
      return { 
        isValid: false, 
        reason: 'Image quality is too poor. Please upload a clearer, higher resolution image.' 
      };
    }

    // 2. Maximum file size (already checked elsewhere, but double-check)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (imageBuffer.length > maxSize) {
      return { 
        isValid: false, 
        reason: 'Image file is too large. Maximum size: 50MB' 
      };
    }

    // 3. Check image dimensions by analyzing header
    // JPEG starts with FFD8, PNG starts with 89504E47
    const header = imageBuffer.slice(0, 4).toString('hex');
    const isValidFormat = header.startsWith('ffd8') || header.startsWith('89504e47') || header.startsWith('47494638');
    
    if (!isValidFormat) {
      return { 
        isValid: false, 
        reason: 'Invalid image format. Please upload a JPEG, PNG, or GIF image.' 
      };
    }

    // If all checks pass, accept the image
    return { isValid: true, reason: null };
  } catch (error) {
    console.error('Image validation error:', error);
    // If validation fails, allow the image (graceful degradation)
    return { isValid: true, reason: null };
  }
}

function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

export async function GET(request, { params }) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');
  
  try {
    const database = await connectDB();
    
    // Get branches
    if (path === 'branches') {
      return Response.json({ branches: BRANCHES });
    }
    
    // Get complaint categories
    if (path === 'categories') {
      return Response.json({ categories: COMPLAINT_CATEGORIES });
    }
    
    // Get public stats (no authentication required)
    if (path === 'public/stats') {
      const complaints = database.collection('complaints');
      
      const totalComplaints = await complaints.countDocuments({});
      const resolvedComplaints = await complaints.countDocuments({ status: 'resolved' });
      const pendingComplaints = await complaints.countDocuments({ status: 'pending' });
      const inProgressComplaints = await complaints.countDocuments({ status: 'in-progress' });
      
      // Get last complaint timestamp
      const lastComplaint = await complaints.findOne({}, { sort: { createdAt: -1 } });
      
      // Get branch-wise stats
      const branchStats = [];
      for (const branch of BRANCHES) {
        const submitted = await complaints.countDocuments({ branch });
        const resolved = await complaints.countDocuments({ branch, status: 'resolved' });
        branchStats.push({ branch, submitted, resolved });
      }
      
      const users = database.collection('users');
      const totalUsers = await users.countDocuments({});
      const totalStudents = await users.countDocuments({ role: 'student' });
      const totalTeachers = await users.countDocuments({ role: 'teacher' });
      const totalAdmins = await users.countDocuments({ role: 'admin' });
      const totalPrincipals = await users.countDocuments({ role: 'principal' });
      
      return Response.json({
        total: totalComplaints,
        resolved: resolvedComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        lastComplaintAt: lastComplaint?.createdAt || null,
        byBranch: branchStats,
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalPrincipals
      });
    }
    
    // Get analytics stats (authenticated)
    if (path === 'analytics/stats') {
      const user = getAuthUser(request);
      
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const complaints = database.collection('complaints');
      let query = {};
      
      // Filter based on role
      if (user.role === 'admin') {
        query.branch = user.branch;
      } else if (user.role === 'student') {
        query.studentId = user.userId;
      }
      // Principal sees all complaints (no filter)
      
      const totalComplaints = await complaints.countDocuments(query);
      const resolvedComplaints = await complaints.countDocuments({ ...query, status: 'resolved' });
      const pendingComplaints = await complaints.countDocuments({ ...query, status: 'pending' });
      const inProgressComplaints = await complaints.countDocuments({ ...query, status: 'in-progress' });
      
      // Get branch-wise stats
      const branchStats = [];
      for (const branch of BRANCHES) {
        const branchQuery = user.role === 'principal' ? { branch } : { ...query, branch };
        const submitted = await complaints.countDocuments(branchQuery);
        const resolved = await complaints.countDocuments({ ...branchQuery, status: 'resolved' });
        if (user.role === 'principal' || user.branch === branch) {
          branchStats.push({ branch, submitted, resolved });
        }
      }
      
      // Get category-wise stats
      const categoryStats = [];
      for (const category of COMPLAINT_CATEGORIES) {
        const categoryQuery = { ...query, category };
        const submitted = await complaints.countDocuments(categoryQuery);
        const resolved = await complaints.countDocuments({ ...categoryQuery, status: 'resolved' });
        categoryStats.push({ category, submitted, resolved });
      }
      
      // Student submissions (non-anonymous)
      const studentSubmissions = await complaints.countDocuments({ ...query, isAnonymous: false, studentId: { $ne: null } });
      const studentResolved = await complaints.countDocuments({ ...query, isAnonymous: false, studentId: { $ne: null }, status: 'resolved' });
      
      // Anonymous submissions
      const anonymousSubmissions = await complaints.countDocuments({ ...query, isAnonymous: true });
      const anonymousResolved = await complaints.countDocuments({ ...query, isAnonymous: true, status: 'resolved' });
      
      return Response.json({
        overview: {
          total: totalComplaints,
          resolved: resolvedComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints
        },
        byBranch: branchStats,
        byCategory: categoryStats,
        byType: {
          student: { submitted: studentSubmissions, resolved: studentResolved },
          anonymous: { submitted: anonymousSubmissions, resolved: anonymousResolved }
        }
      });
    }
    
    // Get complaints
    if (path === 'complaints') {
      const user = getAuthUser(request);
      
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });}
      
      const complaints = database.collection('complaints');
      let query = {};
      
      // Principal sees all complaints (including admin reports)
      if (user.role === 'principal') {
        query = {}; // No filter, see all
      } 
      // Admin sees their branch complaints + admin reports visible to principal only
      else if (user.role === 'admin') {
        query = {
          branch: user.branch,
          isAdminReport: { $ne: true } // Admins don't see other admins' reports about teachers
        };
      } 
      // Student sees only their own complaints
      else if (user.role === 'student') {
        query.studentId = user.userId;
      }
      // Teacher sees only their own complaints
      else if (user.role === 'teacher') {
        query.studentId = user.userId;
      }
      
      let result = await complaints
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      // Hide anonymous user identity from non-admin/principal users
      result = result.map(complaint => {
        if (complaint.isAnonymous && user.role !== 'admin' && user.role !== 'principal') {
          return {
            ...complaint,
            studentName: 'Anonymous',
            studentEmail: null,
            studentId: null
          };
        }
        return complaint;
      });
      
      return Response.json({ complaints: result });
    }
    
    // Get single complaint
    if (path.startsWith('complaints/')) {
      const complaintId = path.split('/')[1];
      const user = getAuthUser(request);
      
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const complaints = database.collection('complaints');
      let complaint = await complaints.findOne({ id: complaintId });
      
      if (!complaint) {
        return Response.json({ error: 'Complaint not found' }, { status: 404 });
      }
      
      // Check access permissions
      if (user.role === 'admin' && complaint.branch !== user.branch) {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      if (user.role === 'student' && complaint.studentId !== user.userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      // Principal can access all complaints
      
      // Hide anonymous user identity from non-admin/principal users
      if (complaint.isAnonymous && user.role !== 'admin' && user.role !== 'principal') {
        complaint = {
          ...complaint,
          studentName: 'Anonymous',
          studentEmail: null,
          studentId: null
        };
      }
      
      return Response.json({ complaint });
    }
    
    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('GET error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');
  
  try {
    const database = await connectDB();
    const body = await request.json();
    
    // User registration
    if (path === 'auth/register') {
      const { email, password, name, branch, role } = body;
      
      // Block public admin/principal registration - requires admin secret
      const userRole = role || 'student';
      if (userRole === 'admin' || userRole === 'principal') {
        return Response.json({ error: 'Admin/Principal accounts can only be created by existing administrators. Contact an admin to register.' }, { status: 403 });
      }
      
      if (!email || !password || !name) {
        return Response.json({ error: 'Email, password and name are required' }, { status: 400 });
      }

      // Password strength validation
      if (password.length < 6) {
        return Response.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }
      
      let strength = 0;
      if (password.length >= 8) strength += 30;
      if (password.length >= 12) strength += 10;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
      if (/\d/.test(password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
      if (strength < 30) {
        return Response.json({
          error: 'Password is too weak. Use a mix of uppercase, lowercase, numbers, and special characters.'
        }, { status: 400 });
      }
      
      // Branch is not required for principal and teacher
      if (userRole !== 'principal' && userRole !== 'teacher' && !branch) {
        return Response.json({ error: 'Branch is required' }, { status: 400 });
      }
      
      if (branch && !BRANCHES.includes(branch)) {
        return Response.json({ error: 'Invalid branch' }, { status: 400 });
      }
      
      // Check account limits
      const users = database.collection('users');
      
      if (userRole === 'admin') {
        const adminCount = await users.countDocuments({ role: 'admin' });
        if (adminCount >= MAX_ADMIN_ACCOUNTS) {
          return Response.json({ error: `Maximum ${MAX_ADMIN_ACCOUNTS} admin accounts allowed` }, { status: 400 });
        }
      }
      
      if (userRole === 'principal') {
        const principalCount = await users.countDocuments({ role: 'principal' });
        if (principalCount >= MAX_PRINCIPAL_ACCOUNTS) {
          return Response.json({ error: `Maximum ${MAX_PRINCIPAL_ACCOUNTS} principal accounts allowed` }, { status: 400 });
        }
      }
      
      // Check if user exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return Response.json({ error: 'User already exists' }, { status: 400 });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        branch: branch || 'ALL',
        role: userRole,
        status: (userRole === 'admin' || userRole === 'principal') ? 'pending' : 'approved',
        isVerified: userRole !== 'admin' && userRole !== 'principal',
        createdAt: new Date().toISOString()
      };
      
      await users.insertOne(newUser);
      
      // Generate token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role, branch: newUser.branch },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return Response.json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          branch: newUser.branch,
          role: newUser.role
        }
      });
    }
    
    // User login
    if (path === 'auth/login') {
      const { email, password, role } = body;
      
      if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
      }
      
      const users = database.collection('users');
      const user = await users.findOne({ email });
      
      if (!user) {
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Check if role matches (if role is provided)
      if (role && user.role !== role) {
        return Response.json({ error: 'Invalid credentials for this role' }, { status: 401 });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, branch: user.branch },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return Response.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          branch: user.branch,
          role: user.role
        }
      });
    }
    
    // Create complaint (authenticated users only now)
    if (path === 'complaints') {
      const { title, description, category, branch, keepAnonymous, isAdminReport, reportedTeacherName, mediaBase64, mediaType } = body;
      
      if (!title || !description || !category || !branch) {
        return Response.json({ error: 'All fields are required' }, { status: 400 });
      }
      
      if (!COMPLAINT_CATEGORIES.includes(category)) {
        return Response.json({ error: 'Invalid category' }, { status: 400 });
      }
      
      if (!BRANCHES.includes(branch)) {
        return Response.json({ error: 'Invalid branch' }, { status: 400 });
      }
      
      // Validate media if provided
      if (mediaBase64 && mediaType) {
        const validMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
        if (!validMediaTypes.includes(mediaType)) {
          return Response.json({ error: 'Invalid media type. Allowed: JPEG, PNG, GIF, MP4, WebM, MOV' }, { status: 400 });
        }
        
        // Check file size (max 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (mediaBase64.length > maxSize * 1.33) { // Base64 is ~33% larger
          return Response.json({ error: 'Media file too large. Maximum size: 50MB' }, { status: 400 });
        }
      }
      
      // Must be authenticated
      const user = getAuthUser(request);
      if (!user) {
        return Response.json({ error: 'Unauthorized - Please login to submit complaint' }, { status: 401 });
      }
      
      // Admin report against teacher - only visible to principal
      if (isAdminReport && user.role === 'admin') {
        const newComplaint = {
          id: uuidv4(),
          title,
          description,
          category,
          branch: user.branch,
          status: 'pending',
          isAnonymous: false,
          isAdminReport: true,
          reportedTeacherName: reportedTeacherName || 'Not specified',
          adminId: user.userId,
          adminName: (await database.collection('users').findOne({ id: user.userId }))?.name || 'Admin',
          studentId: null,
          studentName: null,
          studentEmail: null,
          responses: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const complaints = database.collection('complaints');
        await complaints.insertOne(newComplaint);
        
        return Response.json({
          message: 'Admin report submitted successfully',
          complaint: newComplaint
        });
      }
      
      // Teachers and students can submit complaints
      if (user.role !== 'student' && user.role !== 'teacher') {
        return Response.json({ error: 'Only students and teachers can submit complaints' }, { status: 403 });
      }
      
      // Get student/teacher details
      const users = database.collection('users');
      const submitter = await users.findOne({ id: user.userId });
      
      const isAnonymous = !!keepAnonymous;
      
      const newComplaint = {
        id: uuidv4(),
        title,
        description,
        category,
        branch,
        status: category === 'Infrastructure Issue' ? 'resolved' : 'pending',
        isAnonymous,
        isAdminReport: false,
        studentId: user.userId,
        studentName: submitter?.name || (user.role === 'teacher' ? 'Teacher' : 'Student'),
        studentEmail: submitter?.email || null,
        submitterRole: user.role, // Track if submitted by student or teacher
        media: mediaBase64 && mediaType ? {
          id: uuidv4(),
          base64: mediaBase64,
          type: mediaType,
          uploadedAt: new Date().toISOString()
        } : null,
        responses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Auto-reply for Infrastructure Issue
      if (category === 'Infrastructure Issue') {
        newComplaint.responses.push({
          id: uuidv4(),
          adminId: 'system',
          adminName: 'System Auto-Reply',
          message: AUTO_REPLY_MESSAGE,
          timestamp: new Date().toISOString()
        });
      }
      
      const complaints = database.collection('complaints');
      await complaints.insertOne(newComplaint);
      
      return Response.json({
        message: 'Complaint submitted successfully',
        complaint: newComplaint
      });
    }
    
    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('POST error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');
  
  try {
    const database = await connectDB();
    const body = await request.json();
    
    // Update complaint (admin and principal)
    if (path.startsWith('complaints/')) {
      const complaintId = path.split('/')[1];
      const user = getAuthUser(request);
      
      if (!user || (user.role !== 'admin' && user.role !== 'principal')) {
        return Response.json({ error: 'Unauthorized - Admin or Principal access required' }, { status: 403 });
      }
      
      const complaints = database.collection('complaints');
      const complaint = await complaints.findOne({ id: complaintId });
      
      if (!complaint) {
        return Response.json({ error: 'Complaint not found' }, { status: 404 });
      }
      
      // Check if admin has access to this branch (principal can access all)
      if (user.role === 'admin' && complaint.branch !== user.branch) {
        return Response.json({ error: 'Unauthorized - Different branch' }, { status: 403 });
      }
      
      const updateData = {
        updatedAt: new Date().toISOString()
      };
      
      // Update status if provided
      if (body.status) {
        if (!['pending', 'in-progress', 'resolved'].includes(body.status)) {
          return Response.json({ error: 'Invalid status' }, { status: 400 });
        }
        updateData.status = body.status;
      }
      
      // Add response if provided
      if (body.response) {
        const users = database.collection('users');
        const admin = await users.findOne({ id: user.userId });
        
        const newResponse = {
          id: uuidv4(),
          adminId: user.userId,
          adminName: admin?.name || (user.role === 'principal' ? 'Principal' : 'Admin'),
          message: body.response,
          timestamp: new Date().toISOString()
        };
        
        updateData.responses = [...complaint.responses, newResponse];
      }
      
      await complaints.updateOne(
        { id: complaintId },
        { $set: updateData }
      );
      
      const updatedComplaint = await complaints.findOne({ id: complaintId });
      
      return Response.json({
        message: 'Complaint updated successfully',
        complaint: updatedComplaint
      });
    }
    
    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('PATCH error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');
  
  try {
    const database = await connectDB();
    const user = getAuthUser(request);
    
    // Delete complaint (admin and principal only)
    if (path.startsWith('complaints/')) {
      if (!user || (user.role !== 'admin' && user.role !== 'principal')) {
        return Response.json({ error: 'Unauthorized - Admin or Principal access required' }, { status: 403 });
      }
      
      const complaintId = path.split('/')[1];
      const complaints = database.collection('complaints');
      const complaint = await complaints.findOne({ id: complaintId });
      
      if (!complaint) {
        return Response.json({ error: 'Complaint not found' }, { status: 404 });
      }
      
      // Check if admin has access to this branch (principal can delete all)
      if (user.role === 'admin' && complaint.branch !== user.branch) {
        return Response.json({ error: 'Unauthorized - Different branch' }, { status: 403 });
      }
      
      // Delete the complaint
      await complaints.deleteOne({ id: complaintId });
      
      return Response.json({
        message: 'Complaint deleted successfully',
        deletedComplaintId: complaintId
      });
    }
    
    return Response.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('DELETE error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}