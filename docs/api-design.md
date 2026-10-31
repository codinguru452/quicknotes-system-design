
# QuickNotes API Design

Base URL: `https://api.quicknotes.com/v1`

All requests and responses use JSON.

## 1. API Endpoints

| Method | Path | Description | Success Status |
|---|---|---|---|
| GET | /notes | Retrieve all notes | 200 OK |
| GET | /notes/{id} | Retrieve one note | 200 OK |
| POST | /notes | Create a new note | 201 Created |
| PUT | /notes/{id} | Update an existing note | 200 OK |
| DELETE | /notes/{id} | Delete a note | 204 No Content |
| GET | /tags | Retrieve all tags | 200 OK |

## 2. Create a Note

**Request**

`POST /notes`

Request body:

```json
{
  "title": "Study Plan",
  "body": "Study JavaScript and Python."
}
```

**Response**

Status: `201 Created`

```json
{
  "id": 101,
  "userId": 1,
  "title": "Study Plan",
  "body": "Study JavaScript and Python."
}
```

## 3. List Notes

**Request**

`GET /notes`

**Response**

Status: `200 OK`

```json
{
  "notes": [
    {
      "id": 101,
      "userId": 1,
      "title": "Study Plan",
      "body": "Study JavaScript and Python."
    },
    {
      "id": 102,
      "userId": 1,
      "title": "Shopping List",
      "body": "Buy books and stationery."
    }
  ]
}
```

## 4. Retrieve One Note

`GET /notes/101`

Success status: `200 OK`

## 5. Update a Note

`PUT /notes/101`

Request body:

```json
{
  "title": "Updated Study Plan",
  "body": "Study JavaScript, Python and SQL."
}
```

Success status: `200 OK`

## 6. Delete a Note

`DELETE /notes/101`

Success status: `204 No Content`

## 7. Retrieve Tags

`GET /tags`

Success status: `200 OK`

## 8. Error Status Codes

| Status Code | Meaning |
|---|---|
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server error |

**Example Error Response**

```json
{
  "error": "Bad Request",
  "message": "The note title is required.",
  "status": 400
}
```
