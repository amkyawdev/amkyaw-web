# AmkyawDev Admin Guide

## Overview

The admin panel allows you to manage templates, projects, users, and messages.

## Access

Navigate to `/admin.html` and login with admin credentials.

## Managing Templates

### Add New Template

1. Click "Add Template" button
2. Fill in the form:
   - Name: Template name
   - Category: portfolio/ecommerce/blog/business
   - Price: Price in USD
   - Description: Template description
   - Features: Comma-separated features
   - Image: Path to template image
   - Demo URL: Link to live demo

3. Click "Add Template"

### Edit Template

1. Click the edit icon on the template row
2. Modify the fields
3. Click "Save Template"

### Delete Template

1. Click the trash icon
2. Confirm deletion

## Managing Projects

Similar to templates management.

## User Management

View all registered users, their roles, and activity.

## Messages

View and respond to contact form submissions.

## Security

- Only users with admin role can access the panel
- All actions are logged for audit
- CSRF protection is enabled