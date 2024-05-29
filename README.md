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
-   [OpenWeather](https://openweathermap.org/) for weather predictions
-   [Google Maps Platform](https://developers.google.com/maps/documentation/) for autocomplete functionality for destinations

#### Websites:

-   [visahq.com](https://www.visahq.com/) for visa prerequisites
