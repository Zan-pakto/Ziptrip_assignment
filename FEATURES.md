# Features & Functionalities Documentation

This document explicitly details all the features and functionalities implemented in the Todo Application.

## 1. Task Management (CRUD Operations)

### 1.1 Create Task
- **Functionality**: Users can add a new task by providing a title and an optional description.
- **UI Element**: The "Create New Task" form on the dashboard.
- **Backend Flow**: A `POST /api/todos` request is sent with the task details. The task is saved to the MongoDB database with a default `completed` status of `false` and automatically generated timestamps.
- **UX Feature**: The form automatically clears upon successful creation and fetches the updated list instantly.

### 1.2 Read Tasks
- **Functionality**: Users can view all their tasks on the main dashboard and view individual task details on a separate page.
- **UI Element**: 
  - The main dashboard displays a list of all tasks.
  - The Single Task View (`/todo?id=...`) shows the comprehensive details of a specific task.
- **Backend Flow**: 
  - `GET /api/todos` retrieves all tasks sorted by creation date (newest first).
  - `GET /api/todos/:id` retrieves the specific details for a single task using its MongoDB ObjectId.

### 1.3 Update Task (Edit)
- **Functionality**: Users can modify the title and description of an existing task.
- **UI Element**: Clicking the "Edit" button populates the main creation form with the task's existing details and changes the form into "Edit Mode".
- **Backend Flow**: A `PUT /api/todos/:id` request is dispatched to update the document in the database.
- **UX Feature**: The page smooth-scrolls to the top so the user immediately sees the edit form. A "Cancel" button appears to allow exiting edit mode.

### 1.4 Delete Task
- **Functionality**: Users can permanently remove a task.
- **UI Element**: The "Delete" button (trash icon) on the task list, or the "Delete Task" button on the Single Task View.
- **Backend Flow**: A `DELETE /api/todos/:id` request is sent to remove the document from the database.
- **UX Feature**: In the single view, clicking delete prompts a confirmation dialog to prevent accidental data loss. After deletion, the user is automatically navigated back to the dashboard.

## 2. Status Management

### 2.1 Mark as Complete / Pending
- **Functionality**: Users can toggle the completion status of a task.
- **UI Element**: Checkbox/Status button on the individual task row, or the prominent "Mark as Completed / Mark as Pending" button on the Single Task View.
- **Backend Flow**: A `PUT /api/todos/:id` request is sent updating only the `completed` boolean flag.
- **UX Feature**: 
  - **Optimistic UI Updates**: The frontend instantly reflects the change before waiting for the server response, ensuring a snappy and responsive feel.
  - **Visual Cues**: Completed tasks are faded out, receive a strikethrough on their title, and have their accent colors changed from warning (amber) to success (emerald).

## 3. UI/UX Enhancements

### 3.1 Empty States
- **Functionality**: Provides visual feedback when there are no tasks in the database.
- **UI Element**: A beautifully designed "No tasks yet" placeholder is displayed instead of a blank screen, encouraging the user to add their first task.

### 3.2 Loading States
- **Functionality**: Informs the user that background data fetching is occurring.
- **UI Element**: Animated spinning loaders are displayed on both the dashboard and the single view page until the backend resolves the request.

### 3.3 Dynamic Formatting
- **Functionality**: Dates and times are properly parsed and displayed in a human-readable format.
- **UI Element**: The Single Task View shows beautifully formatted `Created At` and `Last Updated` timestamps using standard JavaScript Date localization.

## 4. Routing & Navigation
- **Functionality**: Multi-page navigation without reloading the browser.
- **UI Element**: React Router is used to seamlessly navigate between the main `/todos` list and the `/todo?id=...` detail views.

## 5. Error Handling
- **Functionality**: Gracefully handles situations where data fails to load or a task ID is invalid.
- **UI Element**: Displays a red error banner or empty state ("Task not found") if the API returns a 404 or the backend is unreachable.
