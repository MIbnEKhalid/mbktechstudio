import express from "express";
import { pool } from "./pool.js";
// Removed auth import as requested

const router = express.Router();

// Note: Authentication temporarily disabled as requested by user
// Admin authentication will be added later by the user

// Get all submissions with pagination and filtering
router.get("/submissions", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            status,
            subject,
            priority,
            search,
            sortBy = 'submission_timestamp',
            sortOrder = 'DESC'
        } = req.query;

        // Validate and sanitize pagination parameters
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50)); // Max 100 per page
        const offset = (pageNum - 1) * limitNum;
        
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;

        // Build WHERE clause based on filters
        if (status && status !== 'all') {
            whereConditions.push(`status = $${paramIndex}`);
            queryParams.push(status);
            paramIndex++;
        }

        if (subject && subject !== 'all') {
            whereConditions.push(`subject = $${paramIndex}`);
            queryParams.push(subject);
            paramIndex++;
        }

        if (priority && priority !== 'all') {
            whereConditions.push(`priority = $${paramIndex}`);
            queryParams.push(priority);
            paramIndex++;
        }

        if (search) {
            whereConditions.push(`(
                name ILIKE $${paramIndex} OR 
                email ILIKE $${paramIndex} OR 
                message ILIKE $${paramIndex} OR 
                ticket_number ILIKE $${paramIndex}
            )`);
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        // Get total count for pagination
        const countQuery = `SELECT COUNT(*) FROM support_submissions ${whereClause}`;
        const countResult = await pool.query(countQuery, queryParams);
        const totalCount = parseInt(countResult.rows[0].count);

        // Get submissions
        const query = `
            SELECT 
                id, ticket_number, subject, support_type, project_category,
                name, email, phone_number, message, rating, status, priority,
                page_url, submission_timestamp, last_updated, assigned_to,
                admin_notes, resolution_notes, audit_trail, additional_fields
            FROM support_submissions 
            ${whereClause}
            ORDER BY ${sortBy} ${sortOrder}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(limit, offset);
        const result = await pool.query(query, queryParams);

        res.json({
            submissions: result.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount: totalCount,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

// Get single submission by ID
router.get("/submissions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT * FROM support_submissions WHERE id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching submission:", error);
        res.status(500).json({ error: "Failed to fetch submission" });
    }
});

// Update submission (generic) - used by frontend save changes
router.patch("/submissions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body || {};

        // Input validation
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid submission ID" });
        }

        // Allowed fields and mapping to DB columns
        const fieldMap = {
            status: 'status',
            adminNotes: 'admin_notes',
            assignedTo: 'assigned_to',
            priority: 'priority',
            resolutionNotes: 'resolution_notes',
            rating: 'rating',
            name: 'name',
            email: 'email',
            phoneNumber: 'phone_number',
            message: 'message',
            additionalFields: 'additional_fields'
        };

        // Fetch current submission for audit trail and existence
        const currentRes = await pool.query("SELECT * FROM support_submissions WHERE id = $1", [parseInt(id)]);
        if (currentRes.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        const current = currentRes.rows[0];
        const auditTrail = Array.isArray(current.audit_trail) ? current.audit_trail.slice() : [];

        // Validate adminNotes length
        if (updates.adminNotes && updates.adminNotes.length > 1000) {
            return res.status(400).json({ error: "Admin notes too long (max 1000 characters)" });
        }

        // Build SET clause
        const setClauses = [];
        const params = [];
        let idx = 1;

        Object.keys(updates).forEach(key => {
            if (!(key in fieldMap)) return;
            const column = fieldMap[key];
            const value = updates[key];

            // Skip undefined values
            if (typeof value === 'undefined') return;

            // Add audit entries for significant changes
            if (key === 'status' && value !== current.status) {
                auditTrail.push({
                    type: 'status',
                    action: `Status changed from '${current.status}' to '${value}'`,
                    timestamp: new Date().toISOString(),
                    by: 'admin',
                    notes: updates.adminNotes || null
                });
            }

            if (key === 'resolutionNotes' && value) {
                auditTrail.push({
                    type: 'resolution',
                    action: 'Resolution notes updated',
                    timestamp: new Date().toISOString(),
                    by: 'admin',
                    notes: value
                });
            }

            setClauses.push(`${column} = $${idx}`);
            params.push(value);
            idx++;
        });

        if (setClauses.length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        // always update audit_trail and last_updated
        setClauses.push(`audit_trail = $${idx}`);
        params.push(JSON.stringify(auditTrail));
        idx++;

        setClauses.push(`last_updated = NOW()`);

        const query = `UPDATE support_submissions SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`;
        params.push(parseInt(id));

        const result = await pool.query(query, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating submission (generic):', error);
        res.status(500).json({ error: 'Failed to update submission' });
    }
});

// Update submission status
router.patch("/submissions/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, assignedTo } = req.body;

        // Input validation
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid submission ID" });
        }

        const validStatuses = ['pending', 'in_progress', 'resolved', 'closed', 'on_hold'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: "Invalid status", 
                validStatuses: validStatuses 
            });
        }

        if (adminNotes && adminNotes.length > 1000) {
            return res.status(400).json({ error: "Admin notes too long (max 1000 characters)" });
        }

        // Get current submission for audit trail
        const currentSubmission = await pool.query("SELECT * FROM support_submissions WHERE id = $1", [parseInt(id)]);
        
        if (currentSubmission.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        const current = currentSubmission.rows[0];
        const auditTrail = current.audit_trail || [];
        
        // Add audit entry
        auditTrail.push({
            type: "status",
            action: `Status changed from '${current.status}' to '${status}'`,
            timestamp: new Date().toISOString(),
            by: "admin",
            notes: adminNotes || null
        });

        const query = `
            UPDATE support_submissions 
            SET status = $1, admin_notes = $2, assigned_to = $3, audit_trail = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(query, [
            status,
            adminNotes || current.admin_notes,
            assignedTo || current.assigned_to,
            JSON.stringify(auditTrail),
            id
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating submission:", error);
        res.status(500).json({ error: "Failed to update submission" });
    }
});

// Update submission priority
router.patch("/submissions/:id/priority", async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        // Input validation
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid submission ID" });
        }

        const validPriorities = ['low', 'normal', 'high', 'urgent'];
        if (!priority || !validPriorities.includes(priority)) {
            return res.status(400).json({ 
                error: "Invalid priority", 
                validPriorities: validPriorities 
            });
        }

        const query = `
            UPDATE support_submissions 
            SET priority = $1
            WHERE id = $2
            RETURNING *
        `;

        const result = await pool.query(query, [priority, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating priority:", error);
        res.status(500).json({ error: "Failed to update priority" });
    }
});

// Add resolution notes
router.patch("/submissions/:id/resolve", async (req, res) => {
    try {
        const { id } = req.params;
        const { resolutionNotes } = req.body;

        // Get current submission for audit trail
        const currentSubmission = await pool.query("SELECT * FROM support_submissions WHERE id = $1", [id]);
        
        if (currentSubmission.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        const current = currentSubmission.rows[0];
        const auditTrail = current.audit_trail || [];
        
        // Add audit entry
        auditTrail.push({
            type: "resolution",
            action: "Resolution notes added",
            timestamp: new Date().toISOString(),
            by: "admin",
            notes: resolutionNotes
        });

        const query = `
            UPDATE support_submissions 
            SET status = 'resolved', resolution_notes = $1, audit_trail = $2
            WHERE id = $3
            RETURNING *
        `;

        const result = await pool.query(query, [
            resolutionNotes,
            JSON.stringify(auditTrail),
            id
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error resolving submission:", error);
        res.status(500).json({ error: "Failed to resolve submission" });
    }
});

// Delete submission
router.delete("/submissions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Input validation
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid submission ID" });
        }
          const query = "DELETE FROM support_submissions WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [parseInt(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json({ message: "Submission deleted successfully" });
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).json({ error: "Failed to delete submission" });
    }
});

// Get dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_submissions,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_count,
                COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_count,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_count,
                COUNT(CASE WHEN subject = 'Support' THEN 1 END) as support_tickets,
                COUNT(CASE WHEN subject = 'Feedback' THEN 1 END) as feedback_count,
                COUNT(CASE WHEN submission_timestamp >= NOW() - INTERVAL '24 hours' THEN 1 END) as today_count,
                COUNT(CASE WHEN submission_timestamp >= NOW() - INTERVAL '7 days' THEN 1 END) as week_count
            FROM support_submissions
        `;

        const result = await pool.query(statsQuery);
        const stats = result.rows[0];

        // Convert string numbers to integers
        Object.keys(stats).forEach(key => {
            stats[key] = parseInt(stats[key]) || 0;
        });

        res.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
});

// Export submissions as CSV
router.get("/export/csv", async (req, res) => {
    try {
        const { status, subject, dateFrom, dateTo } = req.query;
        
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;

        if (status && status !== 'all') {
            whereConditions.push(`status = $${paramIndex}`);
            queryParams.push(status);
            paramIndex++;
        }

        if (subject && subject !== 'all') {
            whereConditions.push(`subject = $${paramIndex}`);
            queryParams.push(subject);
            paramIndex++;
        }

        if (dateFrom) {
            whereConditions.push(`submission_timestamp >= $${paramIndex}`);
            queryParams.push(dateFrom);
            paramIndex++;
        }

        if (dateTo) {
            whereConditions.push(`submission_timestamp <= $${paramIndex}`);
            queryParams.push(dateTo);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        const query = `
            SELECT 
                ticket_number, subject, support_type, project_category,
                name, email, phone_number, message, rating, status, priority,
                submission_timestamp, last_updated, assigned_to, resolution_notes
            FROM support_submissions 
            ${whereClause}
            ORDER BY submission_timestamp DESC
        `;

        const result = await pool.query(query, queryParams);
        
        // Convert to CSV
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No data to export" });
        }

        const headers = Object.keys(result.rows[0]);
        const csvHeaders = headers.join(',');
        const csvRows = result.rows.map(row => 
            headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );

        const csv = [csvHeaders, ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=support_submissions_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);

    } catch (error) {
        console.error("Error exporting CSV:", error);
        res.status(500).json({ error: "Failed to export data" });
    }
});

export default router;
