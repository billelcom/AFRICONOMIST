# Security Specification - Africonomist

## Data Invariants
1. A user profile must match the authenticated UID.
2. Only Admins can modify user roles.
3. Saved articles must belong to the user who saved them.
4. AI articles default to `pending_review` status.
5. Only `HUMAN_EDITOR` or `ADMIN` can change article status to `published`.
6. Timestamps (`createdAt`, `updatedAt`) must use `request.time`.

## The Dirty Dozen (Attack Payloads)
1. **Identity Spoofing**: Creating a profile for a different UID.
2. **Privilege Escalation**: User trying to set `role: 'admin'`.
3. **Shadow Field Injection**: Adding `isVerified: true` to a profile update.
4. **Orphaned Write**: Saving an article for a non-existent user.
5. **Timestamp Fraud**: Setting a manual `createdAt` in the past.
6. **Bypassing Review**: AI agent (client-side) trying to set status to `published`.
7. **Cross-User Snooping**: Reading another user's `savedArticles`.
8. **Notification Spam**: User trying to create a notification for someone else.
9. **Outcome Locking Bypass**: Modifying a `published` article status without permission.
10. **ID Poisoning**: Using a 1MB string as a document ID.
11. **PII Leak**: Reading private `email` from another user's document.
12. **Query Scraping**: Listing all `users` without a secure filter.

## Test Runner (Conceptual)
All above payloads will return `PERMISSION_DENIED` via strict `hasOnly()` and `isValid[Entity]()` checks.
