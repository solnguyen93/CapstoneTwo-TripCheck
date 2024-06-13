# TripCheck

TripCheck utilizes a tree-based data structure and recursive algorithms to handle nested items and their relationships. With this, users can put items inside other items in their checklists, making it easier to organize and find things. The app integrates various APIs to enhance the travel planning experience with weather forecasts, and currency exchange rates.
Click [Here](https://tripcheck.onrender.com) to explore TripCheck or follow the guide below for setup.

## Usage Tips

-   **Edit, Share, or Delete**: Click on the checklist, then click on the three-dot icon and select the desired action.
-   **New Checklist**: Click on the three-dot icon and select 'New'.
-   **Edit Item Name**: Click on the item name.
-   While editing the item name:
    -   Press `Enter` to add a new item.
    -   Press `Backspace` to delete item.
    -   Click the `(+)` icon to add a sub-item (nest items).

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

-   Install PostgreSQL: [PostgreSQL Installation Guide](https://www.postgresql.org/download/)
-   Install Node.js and npm: [Node.js Installation Guide](https://nodejs.org/)

### Step 1: Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/solnguyen93/CapstoneTwo
```

### Step 2: Install Frontend Dependencies and Start Frontend

Navigate to the frontend directory, install the necessary dependencies, and start the frontend server:

```bash
cd CapstoneTwo/my-frontend
npm install
npm start
```

### Step 3: Database Configuration

Ensure PostgreSQL is installed and running. Create a database named 'mydatabase' using the following command:

```bash
createdb mydatabase
```

### Step 4: DSet Up Environment Variables

Create a .env file in the my-backend directory and add the following environment variables:

```bash
PORT=5000
PGUSER=your_username
PGPASSWORD=your_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=mydatabase
JWT_SECRET=your_jwt_secret
```

### Step 5: Install Backend Dependencies, Seed Database, and Start Backend

Navigate to the backend directory, install the necessary dependencies, seed the database with initial data, and start the backend server:

```bash
cd CapstoneTwo/my-backend
npm install
psql mydatabase
\i setup.sql
\q
npm start
```

## Running the Application

After completing the steps above, application should be up and running with the frontend accessible at http://localhost:3000 and the backend server running on its respective port as defined in your backend configuration or the default http://localhost:5000.

## Database Schema

Link to Schema: [Schema](https://github.com/solnguyen93/CapstoneTwo/blob/main/Capstone%20Two_%20Schema.png)

### User Table

-   **id**: Integer, primary key, autoincrement
-   **name**: Text, not null
-   **username**: Text, not null, unique
-   **password**: Text, not null
-   **email**: Text, not null, unique

### Checklist Table

-   **id**: Integer, primary key, autoincrement
-   **title**: Text, not null, unique
-   **description**: Text
-   **trip_destination**: Text
-   **trip_from_date**: DateTime
-   **trip_to_date**: DateTime

### User_Checklist Table

-   **id**: Integer, primary key, autoincrement
-   **user_id**: Integer, foreign key (references User.id), not null
-   **checklist_id**: Integer, foreign key (references Checklist.id), not null
-   **role**: Text, not null

### Item Table

-   **id**: Integer, primary key, autoincrement
-   **checklist_id**: Integer, foreign key (references Checklist.id), not null
-   **parent_item_id**: Integer, foreign key (references Item.id)
-   **name**: Text, not null, unique
-   **position**: Integer
-   **is_checked**: Boolean, not null, default FALSE

### Relationships

-   **Item to Checklist**: Item.checklist_id references Checklist.id
-   **Item to Parent Item**: Item.parent_item_id references Item.id
-   **User_Checklist to User**: User_Checklist.user_id references User.id
-   **User_Checklist to Checklist**: User_Checklist.checklist_id references Checklist.id

### Data Source

#### APIs:

-   [Restful Countries Api](https://restfulcountries.com/api-documentation/version/1) for country data
-   [ExchangeRate-Api](https://www.exchangerate-api.com/docs/overview) for currency rates
-   [VisualCrossing](https://www.visualcrossing.com/weather-api) for weather predictions
-   [Google Maps Platform](https://developers.google.com/maps/documentation/) for autocomplete functionality for destinations (Coming soon)

#### Websites:

-   [visahq.com](https://www.visahq.com/) for visa prerequisites (Coming soon)

#### Key Features:

-   **Keyboard-Focused Item Management:** Users can quickly add new checklist items by pressing "Enter" and delete items with ease using the "Backspace" key. Minimizing the need for switching between keyboard and mouse.

-   **Tree Structure:** Employ a tree-based structure and recursive algorithms to effectively manage nested items and their interconnections. This facilitates the creation of nested items within each checklist, enabling users to organize items hierarchically.

-   **Sharing Functionality:** Enable users to share their checklists with other users by providing their usernames.
-   **Access Control:** Implement access control mechanisms based on user roles (owner or shared) and authorization requirements.
-   **Data Persistence:** Ensure that checklist data is securely stored and persisted in a database.
-   **Real-time Updates:** Provide real-time updates for shared checklists, allowing users to see changes made by others in real-time.
-   **User Authentication:** Implement user authentication to allow users to sign up, log in, and manage their accounts securely.
-   **Notifications:** Notify users when their checklists are shared with others or when changes are made to shared checklists.
