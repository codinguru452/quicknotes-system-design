
# QuickNotes System Design

## Description

QuickNotes is a note-taking application that demonstrates how a frontend communicates with an API and how an online service can be designed to support one million users.

The project uses JSONPlaceholder to demonstrate GET, POST and DELETE requests. It also includes documentation for API design, database design and system architecture.

## How to Run the API Client

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/quicknotes-system-design.git
   ```

2. Open the project folder:

   ```bash
   cd quicknotes-system-design
   ```

3. Open `index.html` in a browser or use VS Code Live Server.

4. Click **Load notes** to retrieve notes from the API.

5. Use the form to create notes and the Delete buttons to remove displayed notes.

Note: JSONPlaceholder is a practice API. Created and deleted notes are not permanently stored on its server.

## Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [Architecture](docs/architecture.md)

## What I Learned

1. How to use the Fetch API and async/await.
2. How GET, POST and DELETE requests work.
3. How to validate input and handle API errors.
4. How to design REST API endpoints.
5. How SQL databases use relationships and JOIN operations.
6. How caching, load balancing and read replicas support scalability.
