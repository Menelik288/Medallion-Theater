# Medallion Theatre Ticket Management System — Functional Prompt Specification

## Project Overview

Build a complete **web-based theatre ticket reservation and management system** for **Medallion Theatre**.

The system will be used at the **will call station** by:
- **Ticket Clerks** for patron search, registration, seat reservation, cancellation, and rescheduling
- **Managers** for production and performance management, reporting, and administrative actions

The system replaces the current manual process and must prevent:
- forgotten reservations
- delayed seat updates
- duplicate seat assignment
- poor customer record handling

The system does **not** handle payment processing. Payment is collected manually outside the system.

The application should be optimized for:
- **Desktop**
- **Tablet**
- **Web browser usage**
- Chrome preferred

---

## Tech Direction

Build the system as a modern web application using:

- **Frontend:** HTML, CSS, JavaScript, EJS or modern component-based frontend
- **Backend:** Node.js
- **Database:** Required
- **Authentication:** Username/password with role-based access
- **Real-time seat status updates:** Required
- **Deployment target:** Browser-based internal theatre system

---

## Database Requirement

The system **must use a database**.

A database is necessary because the system must persist and manage:
- patron records
- unique patron numbers
- user accounts
- productions
- performances
- seats
- seat categories
- reservations
- reservation history
- cancellation and rescheduling state
- reports data

### Recommended Database
Use **Supabase PostgreSQL** as the primary database and backend service layer.

Why:
- relational structure fits the theatre domain well
- supports authentication
- supports row-level security if needed
- easy API access
- good for dashboards and admin systems
- suitable for real-time updates on seat availability

---

## Supabase MCP Configuration

Use this MCP server configuration in the project context:

```json
{
  "mcpServers": {
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp?project_ref=zqatuxatmzwzlfdobemp"
    }
  }
}
```

The system should be designed assuming **Supabase** is the primary backend/database service.

---

## Core Business Goal

The system should allow theatre staff to:

1. register and search patrons efficiently
2. manage productions and performances
3. display available and reserved seats visually
4. reserve one or more seats for a selected performance
5. prevent double booking in real time
6. cancel and reschedule reservations
7. generate operational reports
8. maintain accurate customer and seat data

---

## Primary Users

### 1. Ticket Clerk
Can:
- log in
- search patron by name or patron number
- register new patron
- select production and performance
- select seats from seat map
- calculate total price
- confirm reservation after manual payment
- cancel reservation
- reschedule reservation
- view patron reservation history

### 2. Manager
Can do everything a clerk can, plus:
- add/edit/delete productions
- add/edit/delete performances
- manage theatre schedule
- generate reports
- review sold and available seats
- manage administrative data

### 3. Patron
Indirect actor only:
- interacts through the clerk
- does not log into the system directly

---

## Functional Requirements

The system should do the following.

### Patron Management

#### Register Patron
The system should:
- allow the clerk to register a new patron
- capture:
  - first name
  - last name
  - street address
  - city
  - state
  - zip code
  - cell phone
  - email
- validate required fields
- generate a unique patron number automatically
- save the patron to the database
- show confirmation after saving

#### Search Patron
The system should:
- allow search by:
  - full name
  - partial name
  - patron number
- display matching results quickly
- allow the clerk to select the correct patron
- show patron profile and reservation history

#### Patron History
The system should:
- display upcoming reservations
- display past reservations
- show reservation details
- allow cancellation or rescheduling from the patron profile

#### Frequent Patron Identification
The system should:
- track reservation history
- allow the theatre to identify frequent patrons

---

## Production Management

The system should allow managers to manage productions.

Each production should include:
- production ID
- production name
- production type:
  - play
  - concert
  - musical
  - other
- duration
- description
- status:
  - upcoming
  - on sale
  - closed

### Add Production
The system should:
- show a form for new production creation
- validate required fields
- ensure production name uniqueness
- save successfully to the database

### Edit Production
The system should:
- allow managers to update production details
- validate changed values
- prevent invalid duplicates

### Delete Production
The system should:
- allow deletion only if no performances are associated
- show warning before delete
- prevent deletion if linked performances exist

---

## Performance Management

The system should allow managers to manage performances under productions.

Each performance should include:
- performance ID
- production reference
- date
- time type:
  - matinee
  - evening
- optional notes

### Add Performance
The system should:
- allow selection of an existing production
- allow date selection
- allow matinee/evening selection
- allow optional notes
- prevent creation for past dates
- prevent duplicate performance for the same production, date, and time type

### Edit Performance
The system should:
- allow managers to update date, time, and note
- validate scheduling conflicts
- warn if reservations already exist for that performance

### Delete Performance
The system should:
- allow deletion only when business rules permit
- show warning if reservations exist
- preserve system integrity

---

## Seat and Reservation Management

This is the most critical part of the system.

### Seat Map
The system should display a visual seat map for the selected performance.

Seat colors should clearly indicate:
- **Available seats:** green
- **Reserved seats:** red or gray
- **Selected seats:** blue

The seat map should:
- be easy to use
- refresh in real time
- prevent clerks from selecting already reserved seats
- visually disable unavailable seats

### Seat Categories
Each seat should belong to a category such as:
- Orchestra
- Mezzanine
- Balcony
- Box

The system should support category-based pricing.

### Reserve Tickets
The reservation flow should work like this:

1. Clerk identifies or registers patron
2. Clerk selects production
3. Clerk selects performance date
4. Clerk selects time type
5. System loads seat map
6. Clerk selects one or more seats
7. System calculates total price
8. Patron confirms reservation
9. Clerk confirms reservation after collecting payment outside the system
10. System stores reservation and marks seats as reserved

The system must:
- allow one or more seats in one reservation
- calculate price based on seat category and seat count
- assign a unique reservation ID
- store reservation timestamp
- tie reservation to:
  - patron
  - performance
  - selected seats

### Real-Time Double Booking Prevention
The system must:
- verify seat availability when selected
- verify seat availability again before final confirmation
- if a seat was just taken by another clerk, show:
  - **"Seat no longer available"**
- refresh the seat map immediately
- never allow two patrons to reserve the same seat for the same performance

### Cancel Reservation
The system should:
- allow a clerk to find an existing reservation
- ask for confirmation before cancellation
- mark reservation as cancelled
- free all associated seats for that performance
- reflect the updated seat availability immediately

### Reschedule Reservation
The system should:
- allow moving a reservation to another performance
- recalculate availability
- recalculate fee difference if applicable
- release old seats only after the new reservation is finalized
- update reservation status to rescheduled

---

## Price Calculation

The system should:
- calculate the total reservation price based on:
  - seat category
  - number of seats reserved
- display the total before confirmation
- return calculation quickly

Payment itself is **out of scope** and handled manually.

---

## Reports

The system should provide reports for managers and operational staff.

### Required Reports

#### Seats Sold / Available Report
The system should:
- allow a manager to choose a performance
- show seats sold
- show seats still available
- present the information in clear tables and summaries

#### Patron Purchase Report
The system should:
- allow searching by patron name or patron number
- show all tickets purchased by that patron
- allow filtering by performance if needed

#### Reservation Reporting
The system should support:
- reservation history visibility
- performance occupancy visibility
- operational overview of future performances

---

## Notifications

The system should support notifying patrons of upcoming events.

Possible delivery methods:
- email
- SMS

This can be implemented as:
- current placeholder capability
- future enhancement if external service is integrated

---

## Authentication and Access Control

The system must require login.

### Roles

#### Clerk
Permissions:
- patron search
- patron registration
- reservation creation
- cancellation
- rescheduling
- history viewing

#### Manager
Permissions:
- all clerk rights
- production management
- performance management
- report access
- admin-level modifications

### Security Requirements
The system should:
- use username and password authentication
- store passwords securely using hashing
- restrict access by role
- show access denied messaging for unauthorized pages
- protect sensitive customer data

---

## Non-Functional Requirements

### Performance
The system should:
- display available seats in less than 2 seconds
- calculate reservation totals in less than 4 seconds
- support up to 4 ticket clerks at the same time
- keep confirmed reservation data updated in real time

### Responsiveness
The UI should be optimized for:
- desktop
- tablet

Mobile support is not required.

### Usability
The system should:
- provide clear forms and validation
- keep workflows simple and fast
- allow staff to complete tasks quickly at the will call desk
- clearly distinguish reserved vs available seats

### Reliability
The system should:
- maintain accurate seat states
- prevent duplicate seat assignment
- preserve transaction integrity
- recover gracefully from temporary connection loss where possible

### Error Handling
The system should:
- show friendly validation messages
- block past dates
- show “No productions found” when appropriate
- show “Seat no longer available” when concurrency conflict occurs
- prevent reservation if performance is sold out

---

## UI/UX Expectations

The UI should be a **professional internal dashboard** with a **premium theatre-inspired design**.

### Design Style
- elegant
- theatre-inspired
- dark navy or black theme
- gold accents
- professional typography
- modern cards and tables
- fast workflow for reservation staff

### Layout
- left sidebar navigation
- top header
- content-focused main area
- admin dashboard structure

### Key UI Expectations
- easy patron lookup
- clear forms
- visually strong seat map
- simple manager controls
- professional reporting layout
- friendly warnings and confirmations

---

## Suggested Pages / Screens

### Authentication
1. Login Page

### Clerk Pages
2. Clerk Dashboard
3. Search Patron Page
4. Register Patron Page
5. Patron Details / Reservation History Page
6. Reservation Page
7. Reservation Confirmation Page
8. Cancel / Reschedule Reservation Page

### Manager Pages
9. Manager Dashboard
10. Manage Productions Page
11. Add/Edit Production Page
12. Manage Performances Page
13. Add/Edit Performance Page
14. Reports Page

### Optional Utility Pages
15. Error / Access Denied Page
16. Settings / Profile Page

---

## Suggested Data Model

The system should include database tables or equivalent entities for:

### Users
- id
- username
- password_hash
- role

### Patrons
- id
- patron_number
- first_name
- last_name
- street_address
- city
- state
- zip_code
- cell_phone
- email
- created_at

### Productions
- id
- production_id
- name
- type
- duration
- description
- status
- created_at

### Performances
- id
- performance_id
- production_id
- date
- time_type
- notes
- created_at

### Seats
- id
- seat_code
- row
- seat_number
- category
- base_price

### Reservations
- id
- reservation_id
- patron_id
- performance_id
- total_price
- status
- reserved_at

### Reservation Seats
- id
- reservation_id
- seat_id

This relational structure is important for:
- preventing duplicate seat assignment
- handling one reservation with multiple seats
- generating reports reliably

---

## Real-Time Logic Expectation

The seat selection system should be built with real-time awareness.

When one clerk reserves a seat:
- the seat should become unavailable to others immediately or near real time
- the system should re-check availability at final confirmation
- stale seat selection should be blocked

Supabase real-time features may be used to support this.

---

## Example Functional Flow

### Example: New Patron Reservation
1. Clerk logs in
2. Clerk registers a new patron
3. System assigns a patron number
4. Clerk selects a production
5. Clerk selects performance date and time
6. Seat map loads
7. Clerk selects seats
8. System calculates total
9. Clerk confirms after manual payment
10. Reservation is saved
11. Seats become unavailable to all other clerks

### Example: Existing Patron Reservation
1. Clerk searches by name or patron number
2. Patron profile is shown
3. Clerk selects a performance
4. Seat map is displayed
5. Clerk reserves available seats
6. Reservation is stored and linked to the patron

### Example: Cancel Reservation
1. Clerk opens patron reservation history
2. Clerk chooses reservation
3. System asks for confirmation
4. Cancellation is confirmed
5. Seats are released
6. Updated availability appears immediately

---

## Constraints

The system should respect the following constraints:

- payment is not handled in the system
- only authenticated users can access the application
- patron does not interact directly with the system
- the application is intended for internal theatre operations
- desktop and tablet only
- real-time seat correctness is more important than cosmetic animation

---

## Final Deliverable

Build a complete Medallion Theatre Ticket Management System that:

- stores patron records
- assigns unique patron numbers
- manages productions and performances
- displays seat availability visually
- allows one or more seats to be reserved
- calculates total cost
- prevents double booking
- supports cancellation and rescheduling
- generates theatre operation reports
- uses a database
- uses Supabase as backend/database with the MCP configuration above
- provides role-based access for clerks and managers

The final product should function as a reliable internal reservation and theatre operations system.
