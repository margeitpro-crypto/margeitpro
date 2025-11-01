# TODO: Admin vs User Update Functions

## Overview
Create separate update functions for admins and users with role-based restrictions to differentiate admin and user update capabilities.

## Tasks

### 1. Update gasClient.ts
- [x] Create `updateUserByAdmin` function for full user updates (role, plan, accessPage, etc.) with admin role check
- [x] Create `updateUserByUser` function for limited user updates (e.g., profile picture only) with user ownership check
- [x] Keep existing `updateUser` as fallback or deprecate it

### 2. Update AdminControlCenter.tsx
- [x] Replace `updateUser` calls with `updateUserByAdmin`
- [x] Ensure admin role is verified before allowing updates

### 3. Update FormManagement.tsx
- [x] Replace `updateUser` calls with `updateUserByAdmin`
- [x] Ensure admin role is verified before allowing updates

### 4. Update Settings.tsx
- [x] Replace `updateUser` calls with `updateUserByUser`
- [x] Ensure user can only update their own data

### 5. Testing
- [ ] Test admin updates work correctly with full permissions
- [ ] Test user updates are restricted to allowed fields
- [ ] Test role-based access controls prevent unauthorized updates
- [ ] Verify error handling for invalid update attempts

## Dependent Files
- services/gasClient.ts
- pages/AdminControlCenter.tsx
- pages/FormManagement.tsx
- pages/Settings.tsx

## Followup Steps
- Run the application and test update functionalities
- Check console logs for any errors
- Verify UI reflects proper restrictions
