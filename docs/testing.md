# SAKAN Testing & Quality Assurance Documentation

## 1. Testing Strategy
The SAKAN QA strategy encompasses unit, integration, and security test suites:
1. **Unit & Validation Tests**:
   - Egyptian phone number validation and E.164 normalization
   - Price, deposit, and utility calculation logic
   - Housing type conditional field validation (rooms vs studios vs apartments)
   - Password strength evaluation
2. **Security & Authorization Tests**:
   - Role-based permissions checking
   - Data masking verification (phone and address privacy)
   - Unauthorized listing modification rejection
   - Moderator privilege boundaries
3. **End-to-End Simulation Tests**:
   - Matching engine logic between `wanted_requests` and new `listings`
   - Real-time conversation participants check

---

## 2. Running Automated Tests
```bash
# Execute test suite
npm run test
```
