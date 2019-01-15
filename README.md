# The Brilliance Event Productions App
## A Custom CRM/Events/Inventory/Staff Management and Analytics App

![Login](/deliverables/Deployed/Login.png)
![Dashboard](/deliverables/Deployed/Dashboard.png)
![List](/deliverables/Deployed/List.png)
![Detail](/deliverables/Deployed/Detail.png)

## Features
* Admin and Employee Login
* Admin has full CRUD on all Tables / Employee has limited CRUD
* CRM: Generate Invoices to Print or Email, Keep track of Client Balances
* Manage Events:  Schedule Employees, Map Out Logistics, Visualize Cash Flow
* Inventory: Keep track of Inventory Items (Stock, Maintenance, Cash Flow)
* Staff: Payroll, Time-Tracking, Reimbursements
* Dashboard Analytics

## Technologies Used
* Ruby on Rails
* React
* Google Calendar API
* MapBox

## ERD
![ERD](/deliverables/ERD.jpeg)

## Wireframes
### Login
![Login](/deliverables/Wireframes/Login.png)
### Dashboard - Admin
![Admin](/deliverables/Wireframes/Admin-Dashboard-Overview.png)
### Events List
![Admin](/deliverables/Wireframes/Admin-Events-List.png)
### Event Detail - Basic Information
![Admin](/deliverables/Wireframes/Admin-Event-Detail-Basic-Information.png)
### Event Detail - Invoice
![Admin](/deliverables/Wireframes/Admin-Event-Detail-Invoice.png)
### Event Detail - Logistics
![Admin](/deliverables/Wireframes/Admin-Event-Detail-Logistics.png)
### Event Detail - Cash Flow
![Admin](/deliverables/Wireframes/Admin-Event-Detail-Cash-Flow.png)
### Clients List
![Admin](/deliverables/Wireframes/Admin-Clients-List.png)
### Invoices List
![Admin](/deliverables/Wireframes/Admin-Invoices-List.png)

## MVP
* Create, Read, Update, and Delete Events
* Read Events from Google Calendar

## Post MVP Features
* CRUD Invoices, Clients, and Inventory
* Fully sync Google Calendar
* Admin and Employee Login
* Dashboard Analytics

## Code Example
This is something I found while researching how Active Model Serializer works. Very helpful on the Front-End.

```Ruby
ActiveModelSerializers.config.key_transform = :camel_lower
```

It converts all your json response data from snake_case to camelCase
