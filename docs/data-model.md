
# QuickNotes Data Model

## 1. Entities and Columns

### Users

| Column | Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| username | VARCHAR(50) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |

### Notes

| Column | Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | Optional |

### Tags

| Column | Type | Key / Constraint |
|---|---|---|
| id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key |
| name | VARCHAR(50) | NOT NULL |

### Note_Tags

| Column | Type | Key / Constraint |
|---|---|---|
| note_id | INTEGER | Composite Primary Key, Foreign Key |
| tag_id | INTEGER | Composite Primary Key, Foreign Key |

## 2. Relationships

- **Users and Notes (One-to-Many):** One user can have many notes, but each note belongs to one user.
- **Users and Tags (One-to-Many):** One user can create many tags, but each tag belongs to one user.
- **Notes and Tags (Many-to-Many):** One note can have many tags, and one tag can belong to many notes. The note_tags table connects them.

## 3. CREATE TABLE Statements

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

## 4. Example SQL Queries

### Query 1: Retrieve all notes belonging to a user

```sql
SELECT *
FROM notes
WHERE user_id = 1;
```

### Query 2: Retrieve notes with their tags (JOIN)

```sql
SELECT notes.title, tags.name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id;
```

### Query 3: Count notes belonging to each user

```sql
SELECT users.username, COUNT(notes.id) AS total_notes
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.username;
```

## 5. Index

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

**Reason:** This index helps the database find notes belonging to a particular user faster.

## 6. SQL vs NoSQL

I would choose a SQL database such as PostgreSQL for QuickNotes. The application has structured data and clear relationships between users, notes and tags. SQL supports primary keys, foreign keys and JOIN operations, which help maintain data consistency.
