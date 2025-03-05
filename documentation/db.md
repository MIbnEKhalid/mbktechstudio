
# Database Structure

## Book Table

- `name` (text): The name of the book.
- `semester` (enum): The semester the book is used in. Possible values: `Semester1`, `Semester2`, `Semester3`, `Semester4`, `Semester5`, `Semester6`, `Semester7`, `Semester8`.
- `category` (enum): The category of the book. Possible values: `All`, `CourseBooks`, `LabManuals`, `Other`.
- `description` (text): A brief description of the book.
- `imageURL` (text): The URL of the book's image (e.g., `image.png`).
- `link` (text): A link to the book (e.g., Google Drive link).

Example:
```json
{
        "id": 0,
        "name": "Using Information Technology",
        "category": "CourseBooks",
        "description": "Brian K Williams & Stacey Sawyer",
        "imageURL": "UsingInformationTechnology.png",
        "link": "https://drive.google.com/file/d/15-2kf11bDvZDgIDmCNpvbJ6SzIQMTg2h/view?usp=sharing",
        "semester": "Semester1"
}
```

## Assignment & Quiz Table

- `subject` (text): The subject of the assignment or quiz.
- `description` (text): A brief description of the assignment or quiz.
- `issueDate` (text): The date the assignment or quiz was issued.
- `dueDate` (text): The due date for the assignment or quiz.

Example:
```json
{
        "id": 0,
        "issueDate": "01/03/2025",
        "dueDate": "01/03/2026",
        "subject": "Assignment",
        "description": "Test Assignment"
}
```

## Ticket Table

- `ticketno` (text): The ticket number.
- `name` (text): The name of the person who created the ticket.
- `title` (text): The title of the ticket.
- `status` (enum): The current status of the ticket. Possible values: `Pending`, `Open`, `Closed`, `Resolved`, `In Progress`.
- `createdDate` (text): The date and time the ticket was created.
- `lastUpdated` (text): The date and time the ticket was last updated.
- `auditTrail` (jsonb): A record of actions taken on the ticket.
        - `type` (text): The type of action (e.g., `status`, `update`).
        - `action` (text): A description of the action.
        - `timestamp` (text): The date and time the action occurred.

Example:
```json
{
        "id": 3,
        "name": "Name",
        "ticketno": "T000111333",
        "title": "Issue",
        "status": "Pending",
        "createdDate": "1:50:50 PM 25-02-2025",
        "lastUpdated": "1:50:50 PM 25-02-2025",
        "auditTrail": [
                {
                        "type": "status",
                        "action": "Ticket Created",
                        "timestamp": "2024-11-14T08:45:00Z"
                },
                {
                        "type": "status",
                        "action": "Status changed to 'In Progress'",
                        "timestamp": "2024-11-14T09:30:00Z"
                },
                {
                        "type": "update",
                        "action": "Network Issue Investigated",
                        "timestamp": "2024-11-14T10:00:00Z"
                },
                {
                        "type": "status",
                        "action": "Status changed to 'Resolved'",
                        "timestamp": "2024-11-15T10:00:00Z"
                }
        ]
}
```
