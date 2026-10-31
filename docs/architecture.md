
# QuickNotes System Architecture

## 1. Functional Requirements

The system must allow users to:

1. Register and log in.
2. Create notes.
3. View notes.
4. Update notes.
5. Delete notes.
6. Organise notes using tags.

## 2. Non-Functional Requirements

- **Performance:** The application should respond quickly.
- **Scalability:** The system should support increasing numbers of users.
- **Availability:** Users should be able to access the application reliably.
- **Security:** Users should only access their own notes.
- **Reliability:** The system should protect stored data from loss.

## 3. Load Estimates for 1 Million Users

### Assumptions

- Registered users: 1,000,000
- Daily active users: 10% of registered users.
- Each active user reads 20 notes per day.
- Each active user creates 2 notes per day.
- Each note requires approximately 3 KB of storage.
- One day has 86,400 seconds.

### Daily Active Users

1,000,000 × 10% = 100,000 daily active users.

### Reads Per Second

100,000 × 20 = 2,000,000 reads per day.

2,000,000 ÷ 86,400 = approximately **23 reads per second**.

### Writes Per Second

100,000 × 2 = 200,000 writes per day.

200,000 ÷ 86,400 = approximately **2.3 writes per second**.

### Storage Per Year

200,000 notes per day × 365 = 73,000,000 notes per year.

73,000,000 × 3 KB = 219,000,000 KB.

This is approximately **219 GB per year**.

### Estimate Summary

| Measurement | Estimate |
|---|---:|
| Registered users | 1,000,000 |
| Daily active users | 100,000 |
| Reads per second | 23 |
| Writes per second | 2.3 |
| Storage per year | 219 GB |

QuickNotes is read-heavy because users view notes more often than they create them.

## 4. Architecture Diagram

```text
                 CLIENT
                    |
                    v
                   DNS
                    |
                    v
                   CDN
                    |
                    v
              LOAD BALANCER
                    |
             +------+------+
             |             |
             v             v
        APP SERVER 1   APP SERVER 2
             |             |
             +------+------+
                    |
             +------+------+
             |             |
             v             v
           CACHE     PRIMARY DATABASE
                           |
                           v
                      READ REPLICA

          APP SERVERS
               |
               v
             QUEUE
               |
               v
             WORKER
```

## 5. Architecture Components

- **Client:** Allows users to interact with QuickNotes.
- **DNS:** Converts the domain name into an IP address.
- **CDN:** Delivers static files from locations closer to users.
- **Load Balancer:** Distributes requests across application servers.
- **App Servers:** Process API requests and application logic.
- **Cache:** Stores frequently accessed data to reduce database queries.
- **Primary Database:** Stores permanent application data and handles writes.
- **Read Replica:** Handles read requests to reduce the primary database workload.
- **Queue:** Holds background tasks for later processing.
- **Worker:** Processes background tasks from the queue.

## 6. GET /notes Request Flow

1. The user requests their notes from the client.
2. DNS resolves the application domain.
3. The request reaches the application through the CDN and load balancer.
4. The load balancer forwards it to an available application server.
5. The application server authenticates the user.
6. The application checks the cache for the user's notes.
7. If the notes are not cached, the application retrieves them from the read replica.
8. The application stores the retrieved notes in the cache.
9. The server returns the notes to the client as JSON.
10. The client displays the notes.

## 7. POST /notes Request Flow

1. The user enters a note and submits the form.
2. The client sends a POST /notes request.
3. The load balancer forwards the request to an application server.
4. The application authenticates the user and validates the note.
5. The application saves the note in the primary database.
6. The application updates or invalidates the affected cache.
7. The application sends any required background task to the queue.
8. The server returns a 201 Created response.
9. The client displays the new note.

## 8. Trade-offs

### Caching vs Data Freshness

Caching improves response times and reduces database workload, but cached information may become outdated.

**Solution:** Update or invalidate cached data when a note changes.

### Read Replicas vs Consistency

Read replicas improve read performance, but replication delays may mean they do not immediately show the latest changes.

**Solution:** Read recently updated notes from the primary database when immediate consistency is needed.

### Background Processing vs Immediate Processing

Queues allow tasks to run without delaying the user's request, but background tasks may take time to complete.

**Solution:** Process non-essential tasks in the background and return the main request response first.

## 9. Avoiding Single Points of Failure

- Use at least two application servers so the application can continue if one fails.
- Configure the load balancer to stop sending requests to unhealthy servers.
- Back up the primary database regularly and have a recovery process.
- Configure database replication and a failover process.
- Use a highly available cache or allow the application to fall back to the database.
- Use a durable queue with retry handling to reduce the risk of losing background tasks.
