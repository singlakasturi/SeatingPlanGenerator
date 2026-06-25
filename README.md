<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="nitj.jpg" width="180" alt="Dr. B. R. Ambedkar National Institute of Technology, Jalandhar"/>

# 🎓 NIT Jalandhar Seating Plan Portal
<em>Automating exam seating allocation with intelligent room planning, subject pairing, and one-click PDF generation.</em>

<!-- BADGES -->
<!-- local repository, no metadata badges. -->

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Spring_Boot-6DB33F.svg?style=default&logo=springboot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/Java-ED8B00.svg?style=default&logo=openjdk&logoColor=white" alt="Java">
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=default&logo=mysql&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/Express-000000.svg?style=default&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=default&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=default&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=default&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=default&logo=JavaScript&logoColor=black" alt="JavaScript">
<br>
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=default&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=default&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=default&logo=Axios&logoColor=white" alt="Axios">
<img src="https://img.shields.io/badge/CSS-663399.svg?style=default&logo=CSS&logoColor=white" alt="CSS">

</div>
<br>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

The **NIT Jalandhar Seating Plan Portal** is a full-stack web application developed to automate the process of generating examination seating plans. Instead of manually assigning students to rooms, the portal intelligently allocates seats based on room capacities, subject pairing rules, and examination schedules.

The system provides an end-to-end workflow—from uploading student and exam data to generating optimized seating arrangements and downloadable PDF reports. It also maintains allocation history, supports room previews, enables reallocation, and provides administrative controls through a modern React interface.

Built using a microservices-inspired architecture with **React**, **Node.js**, **Spring Boot**, and **MySQL**, the portal significantly reduces manual effort, minimizes human errors, and streamlines exam management for educational institutions.

---

## Features

- 📄 Upload student lists and examination schedules using Excel files.
- 🧠 Intelligent seat allocation based on room capacities and subject pairing.
- 🏫 Automatic classroom assignment for multiple examination dates and time slots.
- 🔄 Reallocation support with rollback of previous seating plans.
- 👀 Preview room layouts before finalizing allocations.
- 📊 View room occupancy summaries and allocation statistics.
- 📂 Maintain history of previously generated seating plans.
- 📥 Export professionally formatted seating plans as PDF files.
- 🔐 Secure administrator login using Google OAuth and JWT authentication.
- ⚡ Fast and responsive React-based user interface.
- 🏗️ Modular architecture using React, Node.js, Spring Boot, and MySQL.

---

## Project Structure

```sh
└── /
    ├── Backend
    │   ├── NodeBackend
    │   └── SpringBackend
    └── Frontend
        └── frontend
```

### Project Index

<details open>
	<summary><b><code>/</code></b></summary>
	<!-- Backend Submodule -->
	<details>
		<summary><b>Backend</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ Backend</b></code>
			<!-- NodeBackend Submodule -->
			<details>
				<summary><b>NodeBackend</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Backend.NodeBackend</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/db.js'>db.js</a></b></td>
							<td style='padding: 8px;'>- Serves as the central hub for database interactions, ensuring seamless data persistence and retrieval across the application<br>- Integrates with core services to maintain data integrity and support scalable, reliable operations.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/dbConfig.js'>dbConfig.js</a></b></td>
							<td style='padding: 8px;'>- Configures database connection parameters for the Node.js backend, enabling seamless interaction with the SQL Server<br>- Central to the backends data access layer, it establishes the foundation for querying and managing the NITJ_SEATING database.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/index.js'>index.js</a></b></td>
							<td style='padding: 8px;'>- Serves as the central backend API for authentication, data processing, and integration with external services<br>- Manages user sessions, Google OAuth, Excel file uploads, allocation logic, and history tracking<br>- Acts as a bridge between frontend, MySQL database, and microservices for room scheduling and report generation.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/mysqlConfig.js'>mysqlConfig.js</a></b></td>
							<td style='padding: 8px;'>- Establishes a persistent MySQL connection pool for database interactions, enabling efficient resource management and scalable data access<br>- Serves as the foundational data layer for backend operations, ensuring reliable communication with the seating_planner database.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/package-lock.json'>package-lock.json</a></b></td>
							<td style='padding: 8px;'>- The <code>package-lock.json</code> file ensures consistent and reproducible installation of dependency versions for the Node.js backend service<br>- It locks down exact versions of libraries (e.g., Express, Axios, CORS) to maintain stability across development, testing, and production environments, preventing version mismatches that could disrupt the backends API routing, middleware, and environment configuration management<br>- This is critical for the project's architecture, which relies on a reliable Node.js backend to handle HTTP requests, database interactions, and cross-origin resource sharing.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Backend/NodeBackend/package.json'>package.json</a></b></td>
							<td style='padding: 8px;'>- Configures the backend service, defining dependencies for API routing, database connectivity, and authentication<br>- Manages development and production scripts for server execution<br>- Supports multiple SQL databases and third-party services like Google OAuth<br>- Enables modular, scalable architecture for API endpoints and file handling.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- SpringBackend Submodule -->
			<details>
				<summary><b>SpringBackend</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Backend.SpringBackend</b></code>
					<!-- NITJ Submodule -->
					<details>
						<summary><b>NITJ</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ Backend.SpringBackend.NITJ</b></code>
							<!-- NITJ Submodule -->
							<details>
								<summary><b>NITJ</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ Backend.SpringBackend.NITJ.NITJ</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/mvnw'>mvnw</a></b></td>
											<td style='padding: 8px;'>- Enables consistent Maven version management across the project by downloading and installing the required distribution, handling authentication, and setting up the environment<br>- Ensures reliable builds with version-controlled dependencies and secure credential handling<br>- Facilitates seamless integration with the Spring backend ecosystem.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/mvnw.cmd'>mvnw.cmd</a></b></td>
											<td style='padding: 8px;'>- Serves as a Maven wrapper to standardize build processes and dependency management across the project<br>- Ensures consistent Maven execution by handling distribution downloads, version control, and environment setup, aligning with the Spring backends modular architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/pom.xml'>pom.xml</a></b></td>
											<td style='padding: 8px;'>- Defines the projects build configuration, dependency management, and integration with Spring Boot<br>- Coordinates Java version, third-party libraries for web services, database access, authentication, and document generation<br>- Streamlines development with tools for compilation, testing, and runtime support.</td>
										</tr>
									</table>
									<!-- src Submodule -->
									<details>
										<summary><b>src</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src</b></code>
											<!-- main Submodule -->
											<details>
												<summary><b>main</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main</b></code>
													<!-- java Submodule -->
													<details>
														<summary><b>java</b></summary>
														<blockquote>
															<div class='directory-path' style='padding: 8px 0; color: #666;'>
																<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java</b></code>
															<!-- Seating Submodule -->
															<details>
																<summary><b>Seating</b></summary>
																<blockquote>
																	<div class='directory-path' style='padding: 8px 0; color: #666;'>
																		<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating</b></code>
																	<!-- Planner Submodule -->
																	<details>
																		<summary><b>Planner</b></summary>
																		<blockquote>
																			<div class='directory-path' style='padding: 8px 0; color: #666;'>
																				<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner</b></code>
																			<!-- NITJ Submodule -->
																			<details>
																				<summary><b>NITJ</b></summary>
																				<blockquote>
																					<div class='directory-path' style='padding: 8px 0; color: #666;'>
																						<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ</b></code>
																					<table style='width: 100%; border-collapse: collapse;'>
																					<thead>
																						<tr style='background-color: #f8f9fa;'>
																							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																							<th style='text-align: left; padding: 8px;'>Summary</th>
																						</tr>
																					</thead>
																						<tr style='border-bottom: 1px solid #eee;'>
																							<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/SeatingPlannerApplication.java'>SeatingPlannerApplication.java</a></b></td>
																							<td style='padding: 8px;'>- Launches the backend services for the seating planner, enabling core functionality through a microservices architecture<br>- Excludes default database and JPA configurations to support custom data handling, aligning with the projects modular design and external service dependencies.</td>
																						</tr>
																					</table>
																					<!-- config Submodule -->
																					<details>
																						<summary><b>config</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.config</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/config/CorsConfig.java'>CorsConfig.java</a></b></td>
																									<td style='padding: 8px;'>- Enables cross-origin requests between frontend and backend services, ensuring secure and allowed communication<br>- Defines policies for origin validation, HTTP methods, headers, and credentials, facilitating seamless interaction between React UI, Node.js login, and Spring backend.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/config/JdbcConfig.java'>JdbcConfig.java</a></b></td>
																									<td style='padding: 8px;'>- Configures database connectivity for the backend module, establishing a MySQL connection pool and JDBC template<br>- Enables seamless data access layer integration, providing essential infrastructure for persistent storage operations within the applications architecture.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- controller Submodule -->
																					<details>
																						<summary><b>controller</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.controller</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/AllocationController.java'>AllocationController.java</a></b></td>
																									<td style='padding: 8px;'>- Manages seating plan generation and adjustments<br>- Handles initial allocation requests and reallocation after rolling back previous assignments<br>- Ensures consistent state management for dynamic seating arrangements while supporting both automated and manual intervention scenarios.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/BookingController.java'>BookingController.java</a></b></td>
																									<td style='padding: 8px;'>- Manages booking data retrieval and filtering through REST endpoints<br>- Exposes endpoints for fetching all bookings or filtered results by date and time, integrating with the service layer to provide structured access to reservation data across the application.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/ExportController.java'>ExportController.java</a></b></td>
																									<td style='padding: 8px;'>- Manages PDF export requests by handling the <code>/api/export/pdf</code> endpoint<br>- Delegates generation of room-based PDF files to the ExportService, returning structured data for downstream processing<br>- Integrates with the core export logic to enable dynamic seating plan exports.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/HistoryController.java'>HistoryController.java</a></b></td>
																									<td style='padding: 8px;'>- Manages HTTP endpoints for allocation history, enabling saving, retrieval, and deletion of past allocation records<br>- Integrates with the service layer to handle data persistence and query operations<br>- Exposes RESTful APIs for tracking and managing historical seating plans across the application.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/RoomSummaryController.java'>RoomSummaryController.java</a></b></td>
																									<td style='padding: 8px;'>- Exposes an API endpoint for retrieving room summaries, enabling filtered data retrieval based on date and time parameters<br>- Integrates with the service layer to aggregate and return structured room information, supporting dynamic query capabilities across the applications data flow.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/controller/StudentLoadController.java'>StudentLoadController.java</a></b></td>
																									<td style='padding: 8px;'>- Exposes an API endpoint for retrieving student data grouped by subject, enabling seamless integration with frontend systems<br>- It acts as a bridge between the service layer and external requests, ensuring structured data flow within the application architecture.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- holder Submodule -->
																					<details>
																						<summary><b>holder</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.holder</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/holder/RoomHolder.java'>RoomHolder.java</a></b></td>
																									<td style='padding: 8px;'>- Centralizes room data management for the application, initializing predefined room configurations during startup<br>- Acts as a data source for room information, ensuring consistent access across the system while abstracting room creation logic from core business processes.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- model Submodule -->
																					<details>
																						<summary><b>model</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.model</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/AllocationHistoryEntry.java'>AllocationHistoryEntry.java</a></b></td>
																									<td style='padding: 8px;'>- Tracks historical allocation data, linking bookings to their timestamps and metadata<br>- Stores allocation identifiers, dates, time slots, and optional payload for contextual details<br>- Serves as a model class within the applications data layer, enabling audit trails and historical record management for seating assignments.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/AllocationRequest.java'>AllocationRequest.java</a></b></td>
																									<td style='padding: 8px;'>- Defines data structure for seat allocation requests, capturing programme, year, date, time, and subject details<br>- Supports single or paired subject modes to structure scheduling parameters for seating arrangement calculations.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/AllocationResult.java'>AllocationResult.java</a></b></td>
																									<td style='padding: 8px;'>- Stores allocation outcomes by encapsulating date, time, and room assignments<br>- Represents the result of seating arrangements, linking temporal details with room-specific allocations<br>- Serves as a structured data model for tracking event schedules and resource assignments across the application.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/Room.java'>Room.java</a></b></td>
																									<td style='padding: 8px;'>- Models room configurations for different types (LT, ALT), defining layouts and seat arrangements<br>- Organizes usable seats in column-major order, adhering to capacity limits<br>- Provides structured access to seating data for allocation and display.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/RoomAllocation.java'>RoomAllocation.java</a></b></td>
																									<td style='padding: 8px;'>- Models room allocations by encapsulating room details, subject pairs, and seat assignments<br>- Serves as a data structure for transferring allocation information between layers, enabling integration with seating planning logic and database operations<br>- Central to coordinating resource distribution and scheduling within the system.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/RoomBooking.java'>RoomBooking.java</a></b></td>
																									<td style='padding: 8px;'>- Models a room booking to track allocations, dates, times, subjects, and timestamps<br>- It serves as a core data structure for managing classroom reservations, ensuring temporal and spatial context for scheduling<br>- Central to coordinating resource usage across the system.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/RoomFileDTO.java'>RoomFileDTO.java</a></b></td>
																									<td style='padding: 8px;'>- Facilitates transfer of room file data between layers<br>- Serves as a structured container for storing and retrieving file metadata and encoded content, supporting seamless integration with file processing workflows in the backend architecture.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/RoomSummaryResponse.java'>RoomSummaryResponse.java</a></b></td>
																									<td style='padding: 8px;'>- Aggregates room data to convey availability and booking status across the system<br>- It encapsulates total, booked, and available room counts alongside specific booked room identifiers, enabling unified representation of room state for downstream processing and user-facing insights.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/Seat.java'>Seat.java</a></b></td>
																									<td style='padding: 8px;'>- Models individual seats with section, row, and column details<br>- Tracks occupancy and roll number assignments<br>- Provides unique identifiers for seating planning and display<br>- Central to managing seat availability and student allocation within the system.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/SeatAssignment.java'>SeatAssignment.java</a></b></td>
																									<td style='padding: 8px;'>- Models seat assignments with core attributes and flexible note support<br>- Encapsulates seat ID, roll number, subject code, and optional notes for contextual data<br>- Facilitates structured data exchange via JSON, aligning with backend architecture requirements<br>- Enhances assignment tracking with extensible metadata.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/Section.java'>Section.java</a></b></td>
																									<td style='padding: 8px;'>- Models a seating section with named rows and columns, organizing seats into a grid<br>- Defines structure for seat arrangement, retrieval by position, and section metadata<br>- Enables centralized management of seating layouts within the applications data layer.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/model/SubjectPair.java'>SubjectPair.java</a></b></td>
																									<td style='padding: 8px;'>- Represents pairs of subjects for scheduling or conflict resolution<br>- Encapsulates two subject identifiers to model relationships within the seating arrangement logic, enabling data-driven decisions in the backend system<br>- Serves as a foundational model for handling subject pairings across the application.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- security Submodule -->
																					<details>
																						<summary><b>security</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.security</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/security/JwtAuthenticationFilter.java'>JwtAuthenticationFilter.java</a></b></td>
																									<td style='padding: 8px;'>- Secures backend endpoints by validating JWT tokens and authenticating requests<br>- Integrates with Spring Security to enforce access control, ensuring only valid tokens grant access to protected resources within the applications security framework.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/security/JwtUtil.java'>JwtUtil.java</a></b></td>
																									<td style='padding: 8px;'>- Enables secure user authentication by validating JWT tokens and extracting user identities<br>- Integrates with the security module to enforce access control, ensuring only authorized requests reach backend services<br>- Central to maintaining session integrity and protecting sensitive operations within the application architecture.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/security/SecurityConfig.java'>SecurityConfig.java</a></b></td>
																									<td style='padding: 8px;'>- Configures security by allowing specific endpoints and enforcing authentication for others<br>- Integrates JWT-based authentication to secure API requests while disabling CSRF protections<br>- Establishes a filter chain for request validation and authorization.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- service Submodule -->
																					<details>
																						<summary><b>service</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.service</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/AllocationHistoryService.java'>AllocationHistoryService.java</a></b></td>
																									<td style='padding: 8px;'>- Manages allocation history for the seating planner, storing recent entries in a limited circular buffer<br>- Handles saving, retrieving, and filtering entries by date and time, while supporting removal of the most recent entry during reallocation<br>- Ensures historical data is accessible for auditing and debugging purposes.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/BookingManager.java'>BookingManager.java</a></b></td>
																									<td style='padding: 8px;'>- Manages room bookings by tracking allocations, ensuring availability during scheduling, and enabling rollback of the most recent booking<br>- Coordinates with history service to maintain records, supporting export and summary features while handling reallocation scenarios.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/ExportService.java'>ExportService.java</a></b></td>
																									<td style='padding: 8px;'>- Generates downloadable PDF files for room allocations, organizing data by date<br>- Orchestrates merging individual room layouts into consolidated date-specific documents, encoding results as base64 strings for storage<br>- Central to exporting structured seating plans as reusable, date-based files.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/PdfGenerator.java'>PdfGenerator.java</a></b></td>
																									<td style='padding: 8px;'>- Generates structured PDF seating plans for exam rooms, adapting layouts based on room type and seat counts<br>- Orchestrates data extraction, header formatting, and visual styling to produce clear, scalable seating arrangements<br>- Integrates with backend models to ensure alignment with room configurations and allocation rules.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/RoomSummaryService.java'>RoomSummaryService.java</a></b></td>
																									<td style='padding: 8px;'>- Provides room availability insights by aggregating total, booked, and available room counts for specified times<br>- Integrates with room data and booking systems to deliver actionable metrics for event planning<br>- Central to resource management and scheduling decision-making.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/SeatAllocationService.java'>SeatAllocationService.java</a></b></td>
																									<td style='padding: 8px;'>Orchestrates seat allocation by assigning students to rooms based on subject pairs and availability, enforcing seating rules for specific room types, and ensuring all students are accommodated without conflicts.</td>
																								</tr>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/service/StudentDataService.java'>StudentDataService.java</a></b></td>
																									<td style='padding: 8px;'>- Provides student data retrieval, handling both Excel file and mock data sources<br>- Manages caching to ensure efficient data access, supporting subject-based queries<br>- Central to data flow between storage and application layers, enabling dynamic seating allocation logic.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																					<!-- util Submodule -->
																					<details>
																						<summary><b>util</b></summary>
																						<blockquote>
																							<div class='directory-path' style='padding: 8px 0; color: #666;'>
																								<code><b>⦿ Backend.SpringBackend.NITJ.NITJ.src.main.java.Seating.Planner.NITJ.util</b></code>
																							<table style='width: 100%; border-collapse: collapse;'>
																							<thead>
																								<tr style='background-color: #f8f9fa;'>
																									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																									<th style='text-align: left; padding: 8px;'>Summary</th>
																								</tr>
																							</thead>
																								<tr style='border-bottom: 1px solid #eee;'>
																									<td style='padding: 8px;'><b><a href='/Backend/SpringBackend/NITJ/NITJ/src/main/java/Seating/Planner/NITJ/util/ObjectMapperUtil.java'>ObjectMapperUtil.java</a></b></td>
																									<td style='padding: 8px;'>- Facilitates seamless conversion between object types, enabling data transformation across different representations<br>- Acts as a central utility for mapping values between classes, supporting flexible data handling in the backend services<br>- Streamlines object interoperability, ensuring consistent data flow within the architecture.</td>
																								</tr>
																							</table>
																						</blockquote>
																					</details>
																				</blockquote>
																			</details>
																		</blockquote>
																	</details>
																</blockquote>
															</details>
														</blockquote>
													</details>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- Frontend Submodule -->
	<details>
		<summary><b>Frontend</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ Frontend</b></code>
			<!-- frontend Submodule -->
			<details>
				<summary><b>frontend</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ Frontend.frontend</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Frontend/frontend/eslint.config.js'>eslint.config.js</a></b></td>
							<td style='padding: 8px;'>- Enforces consistent JavaScript and JSX coding standards across the frontend<br>- Integrates ESLint rules with React-specific guidelines to catch errors early, ensuring alignment with project practices<br>- Streamlines development by ignoring build artifacts and supporting modern syntax, enhancing maintainability and collaboration.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Frontend/frontend/index.html'>index.html</a></b></td>
							<td style='padding: 8px;'>- Serves as the entry point for the frontend application, providing the foundational HTML structure and loading the main JavaScript module to render the apps UI<br>- It establishes the root container for dynamic content and integrates with the projects modular architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Frontend/frontend/package-lock.json'>package-lock.json</a></b></td>
							<td style='padding: 8px;'>- Summary of <code>package-lock.json</code> Purpose** The <code>package-lock.json</code> file ensures consistent, reproducible dependency versions for the frontend application, critical for maintaining stability across development, testing, and production environments<br>- It locks specific versions of key libraries (e.g., React, React Router, Axios) and utilities (e.g., JWT decoding, OAuth integrations) to prevent version conflicts and ensure predictable behavior<br>- This file is foundational to the frontend architecture, enabling seamless integration with backend services, authentication flows, and data handling (e.g., Excel parsing), while aligning with the projects modular, tech-agnostic design.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Frontend/frontend/package.json'>package.json</a></b></td>
							<td style='padding: 8px;'>- Configures the frontend environment for a React application using Vite, defining dependencies for authentication, data fetching, routing, and file handling<br>- Establishes build tools and linting rules to ensure code quality and compatibility with the projects architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='/Frontend/frontend/vite.config.js'>vite.config.js</a></b></td>
							<td style='padding: 8px;'>- Configures React development environment for frontend integration<br>- Enables hot reload, optimization, and seamless plugin integration<br>- Establishes foundation for scalable, maintainable frontend architecture aligned with project structure and build requirements.</td>
						</tr>
					</table>
					<!-- public Submodule -->
					<details>
						<summary><b>public</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ Frontend.frontend.public</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/public/examData.json'>examData.json</a></b></td>
									<td style='padding: 8px;'>- Defines exam seating arrangements across multiple rooms, linking students to specific seats and subjects<br>- Includes schedule details, room configurations, and subject pairings<br>- Serves as a static data source for frontend display, ensuring structured access to exam logistics.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/public/index.html'>index.html</a></b></td>
									<td style='padding: 8px;'>- Serves as the foundational HTML structure for the application, defining metadata, viewport settings, and branding<br>- It hosts the root React component, ensuring proper rendering and accessibility while establishing the apps identity and visual theme.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- src Submodule -->
					<details>
						<summary><b>src</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ Frontend.frontend.src</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/App.css'>App.css</a></b></td>
									<td style='padding: 8px;'>- Defines the visual layout and interactive elements for the applications core components<br>- Establishes a responsive, centered structure with animated logo transitions and styled cards, ensuring a cohesive and engaging user experience across devices.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/App.jsx'>App.jsx</a></b></td>
									<td style='padding: 8px;'>- Routes navigation based on authentication status, directing users to appropriate pages<br>- Integrates with backend to enforce access control, ensuring only authenticated users reach protected routes<br>- Manages initial login check and redirects unauthenticated users to the login page.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/index.css'>index.css</a></b></td>
									<td style='padding: 8px;'>- Defines global styling for the applications UI, establishing typography, color schemes, and responsive design<br>- It ensures visual consistency across components by setting base fonts, link styles, button aesthetics, and dark/light mode adaptability<br>- Serves as the foundational style layer for the frontend interface.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/main.jsx'>main.jsx</a></b></td>
									<td style='padding: 8px;'>- Launches the frontend application by rendering the main App component within Reacts StrictMode for production checks<br>- Serves as the root entry point, initializing the React DOM and orchestrating the apps lifecycle<br>- Integrates with routing and state management defined in the broader architecture.</td>
								</tr>
							</table>
							<!-- pages Submodule -->
							<details>
								<summary><b>pages</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ Frontend.frontend.src.pages</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/ControlCenter.css'>ControlCenter.css</a></b></td>
											<td style='padding: 8px;'>- Styles the Control Center page with a modern, gradient-driven layout<br>- Defines visual elements like the header, navigation bar, stepper interface, and action cards, emphasizing clean typography, subtle shadows, and responsive design for consistent user experience across devices.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/ControlCenter.jsx'>ControlCenter.jsx</a></b></td>
											<td style='padding: 8px;'>- Facilitates user navigation through the seating planning workflow, enabling logout, plan generation, previous plan access, and room previews<br>- Integrates file upload functionality to import student data, streamlining the setup process for new seating arrangements.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/EditRoom.jsx'>EditRoom.jsx</a></b></td>
											<td style='padding: 8px;'>- This file serves as a mock data generator for the Edit Room feature in the frontend, populating a room's allocation details (seats, students, subjects) to simulate real-world data<br>- It leverages predefined section layouts and randomization logic to create sample allocations, enabling UI testing or demonstration without relying on backend data<br>- The generated data is structured to align with the project's room management architecture, supporting dynamic seat assignment and subject pairing for editing purposes<br>- <strong>Key Contextual Insights:</strong>-<strong>Purpose:</strong> Provides mock data for room allocation visualization and editing in the frontend.-<strong>Architecture Role:</strong> Acts as a data seeding utility, decoupled from backend logic, to support frontend UI workflows.-<strong>Scope:</strong> Focuses on generating synthetic data for ALT" room types, aligning with the project's modular frontend structure.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/Home.css'>Home.css</a></b></td>
											<td style='padding: 8px;'>- Styles the homepage layout by defining visual elements like headers, navigation, and content sections<br>- Establishes a cohesive design language with consistent spacing, colors, and typography<br>- Ensures responsive behavior for varying screen sizes while maintaining the frontends overall aesthetic and structural integrity.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/Home.jsx'>Home.jsx</a></b></td>
											<td style='padding: 8px;'>- Serves as the homepage, guiding users to the login section<br>- Integrates branding, navigation, and key features to establish context<br>- Directs unauthenticated users to the login flow while maintaining visual coherence with the projects identity and functional goals.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/login.css'>login.css</a></b></td>
											<td style='padding: 8px;'>- Styles the login interface, ensuring a cohesive visual hierarchy and responsive layout<br>- Defines color schemes, typography, and spacing to align with the applications branding<br>- Supports user interaction through hover effects and modal styling, enhancing accessibility and usability across device sizes.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/Login.jsx'>Login.jsx</a></b></td>
											<td style='padding: 8px;'>- Handles user authentication by processing login redirects, validating emails, and routing to appropriate pages<br>- Integrates Google OAuth for sign-in, ensuring seamless access to the application<br>- Manages navigation and state transitions to maintain a cohesive user experience across the platform.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/PreviewRoom.css'>PreviewRoom.css</a></b></td>
											<td style='padding: 8px;'>- Styles the preview room interface with a card layout, interactive buttons, and responsive design<br>- Supports dual layout modes for different views, ensuring consistent styling across the application while maintaining accessibility and visual hierarchy for user interactions.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/PreviewRoom.jsx'>PreviewRoom.jsx</a></b></td>
											<td style='padding: 8px;'>- This file serves as a frontend component for previewing a classroom or meeting room layout, generating mock seat allocations and subject pairings to visualize room configurations<br>- It simulates data for a room (e.g., capacity, subject codes, seat assignments) to enable users to review and validate room setups before finalizing them<br>- The component is part of a larger system managing classroom resources, likely integrated with backend logic for real data in production<br>- <strong>Key Contextual Insights:</strong>-<strong>Purpose:</strong> Provides a visual representation of room layouts and seat assignments for user review.-<strong>Mock Data:</strong> Uses simulated data (<code>MOCK_ALT_DATA</code>) to demonstrate seat allocations, subject pairings, and room configurations.-<strong>Integration:</strong> Likely ties into a broader system for managing classroom resources, with the frontend acting as a UI for previewing and validating room setups.-<strong>Scope:</strong> Focuses on user-facing previews rather than real-time data processing or backend logic.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/PreviousPlans.css'>PreviousPlans.css</a></b></td>
											<td style='padding: 8px;'>- Styles the layout and components for displaying previous plans, including a header with navigation, card-based grid for plan previews, and responsive design<br>- It manages visual states like loading and no plans, ensuring a clean, user-friendly interface with consistent spacing, colors, and interactive feedback.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/PreviousPlans.jsx'>PreviousPlans.jsx</a></b></td>
											<td style='padding: 8px;'>- Displays previous seating plans, enabling users to view detailed allocations and manage plans via the UI<br>- Integrates with backend APIs to fetch and delete records, aligns with the stepper workflow, and reinforces the control-center navigation structure for a cohesive user experience.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/RoomAllocation.css'>RoomAllocation.css</a></b></td>
											<td style='padding: 8px;'>- Styles the room allocation interface, defining visual structure and layout for key components like headers, navigation, step indicators, tables, and action buttons<br>- Ensures consistent design language across the frontend, supporting a cohesive user experience for managing room assignments and exam data.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/RoomAllocation.jsx'>RoomAllocation.jsx</a></b></td>
											<td style='padding: 8px;'>- Displays room subject allocations, enabling users to navigate through dates, edit room details, and regenerate allocations<br>- Integrates with backend for data persistence and export options, facilitating seamless transitions between submission, planning, and final output stages.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/SubjectPairing.css'>SubjectPairing.css</a></b></td>
											<td style='padding: 8px;'>- Stylizes the Subject Pairing page layout, defining visual structure for headers, navigation, tables, and interactive elements<br>- Ensures consistent spacing, colors, and responsive adjustments for optimal user experience across device sizes<br>- Supports core page functionality through cohesive design and accessibility-focused styling.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/SubjectPairing.jsx'>SubjectPairing.jsx</a></b></td>
											<td style='padding: 8px;'>- Manages subject pairing for exam dates, allowing users to swap subjects and save reallocation requests<br>- Integrates with backend to update room allocations, serving as a critical bridge between user input and system-wide scheduling adjustments.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/SubmitDetails.css'>SubmitDetails.css</a></b></td>
											<td style='padding: 8px;'>- Styles the SubmitDetails pages UI components, including the header, navigation, stepper indicators, and form fields<br>- Establishes consistent theming with the projects color scheme and layout structure, ensuring alignment with the overall frontend design system.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='/Frontend/frontend/src/pages/SubmitDetails.jsx'>SubmitDetails.jsx</a></b></td>
											<td style='padding: 8px;'>- Facilitates submission of exam details by capturing programme, year, time, room selection, and datesheet uploads<br>- Parses uploaded datesheet data to extract subject codes and triggers backend allocation processing for room assignments.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language:** Java
- **Package Manager:** Npm, Maven

### Installation

Build  from the source and intsall dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone ../
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd 
    ```

3. **Install the dependencies:**

<!-- SHIELDS BADGE CURRENTLY DISABLED -->
	<!-- [![npm][npm-shield]][npm-link] -->
	<!-- REFERENCE LINKS -->
	<!-- [npm-shield]: None -->
	<!-- [npm-link]: None -->

	**Using [npm](None):**

	```sh
	❯ echo 'INSERT-INSTALL-COMMAND-HERE'
	```
<!-- SHIELDS BADGE CURRENTLY DISABLED -->
	<!-- [![maven][maven-shield]][maven-link] -->
	<!-- REFERENCE LINKS -->
	<!-- [maven-shield]: https://img.shields.io/badge/Maven-C71A36.svg?style={badge_style}&logo=apache-maven&logoColor=white -->
	<!-- [maven-link]: https://maven.apache.org/ -->

	**Using [maven](https://maven.apache.org/):**

	```sh
	❯ mvn install
	```

### Usage

Run the project with:

**Using [npm](None):**
```sh
echo 'INSERT-RUN-COMMAND-HERE'
```
**Using [maven](https://maven.apache.org/):**
```sh
mvn exec:java
```

### Testing

 uses the {__test_framework__} test framework. Run the test suite with:

**Using [npm](None):**
```sh
echo 'INSERT-TEST-COMMAND-HERE'
```
**Using [maven](https://maven.apache.org/):**
```sh
mvn test
```

---

## Roadmap

## Roadmap

- [x] Student data upload through Excel
- [x] Automated seat allocation engine
- [x] Subject pairing and room assignment
- [x] PDF generation for seating plans
- [x] Google OAuth authentication
- [x] Allocation history and rollback support
- [x] Room preview and editing interface
- [x] Responsive React frontend

### Future Enhancements

- [ ] Department-wise access control
- [ ] Conflict detection for invigilator scheduling
- [ ] Email notifications for seating plans
- [ ] QR code generation for examination rooms
- [ ] Analytics dashboard for examination statistics
- [ ] Cloud deployment with Docker and CI/CD
- [ ] Multi-institution support

---

## Contributing

- **💬 [Join the Discussions](https://LOCAL///discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://LOCAL///issues)**: Submit bugs found or log feature requests for the `` project.
- **💡 [Submit Pull Requests](https://LOCAL///blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your LOCAL account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone .
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to LOCAL**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://LOCAL{///}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=/">
   </a>
</p>
</details>

---

## License

 is protected under the [LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## Acknowledgments

- Credit `contributors`, `inspiration`, `references`, etc.

<div align="right">

[![][back-to-top]](#top)

</div>


[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square


---
