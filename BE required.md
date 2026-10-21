1. http://localhost:5174/api/v1/partner/top-products meke products tika enakota level 1 ekenda level 2 ekenda kiyala attach krala ewanna wei. {
   "success": true,
   "data": {
   "products": [
   {
   "product_id": "7d409117-4906-49e2-ab6c-04ef08c7dc02",
   "product_name": "Nevada Levure Instantee 500g",
   "total_earned": 56.25,
   "units": 2,
   "orders": 2
   },
   {
   "product_id": "ea6b6d2b-29df-4d06-a0e3-b9f6681250a6",
   "product_name": "Backerdream Yeast 500g",
   "total_earned": 20.63,
   "units": 1,
   "orders": 1
   },
   {
   "product_id": "b07db7ff-3f5b-487f-9df0-a3d81a693897",
   "product_name": "Anchor Full Cream Milk Powder 400g",
   "total_earned": 19.5,
   "units": 1,
   "orders": 1
   }
   ]
   }
   } danata ena response eka.

2. Forgot Password Flow with OTP Implementation:
   Partner Portal ekata Forgot Password feature eka hadanna ona. User ta email eka dila OTP eka verify karala aluth password ekak set karanna puluwan wenna ona.

   Mekata Backend eken API endpoints 3k awashya wenawa:

   -----------------------------------------------------------------------------
   A. Request OTP (Forgot Password):
   -----------------------------------------------------------------------------
   - Endpoint: POST /api/v1/partner/auth/forgot-password
   - Auth: Public (No token needed)
   - Description: User email eka submit kalama, email eka system eke thiyeda balala 6-digit OTP code ekak generate karala userge email ekata send karanna.

   - Request Headers:
     Content-Type: application/json

   - Request Body:
     {
       "email": "partner@example.com"
     }

   - Success Response (200 OK):
     {
       "success": true,
       "message": "Verification code has been sent to your email address.",
       "data": {
         "email": "partner@example.com",
         "expires_in": 300
       }
     }

   - Error Responses:
     * 400 Bad Request:
       {
         "success": false,
         "message": "Invalid email address format."
       }
     * 404 Not Found:
       {
         "success": false,
         "message": "No partner account found with this email address."
       }
     * 429 Too Many Requests (Rate limit - e.g. 1 request per 60 seconds):
       {
         "success": false,
         "message": "Please wait before requesting another verification code."
       }

   -----------------------------------------------------------------------------
   B. Verify OTP:
   -----------------------------------------------------------------------------
   - Endpoint: POST /api/v1/partner/auth/verify-otp
   - Auth: Public
   - Description: User enter karapu 6-digit OTP code eka valid da expire welada kiyala verify kirima.

   - Request Headers:
     Content-Type: application/json

   - Request Body:
     {
       "email": "partner@example.com",
       "otp": "123456"
     }

   - Success Response (200 OK):
     {
       "success": true,
       "message": "OTP verified successfully.",
       "data": {
         "reset_token": "temp_verified_reset_token_optional"
       }
     }

   - Error Responses:
     * 400 Bad Request:
       {
         "success": false,
         "message": "Invalid or expired OTP code."
       }
     * 429 Too Many Requests (Exceeded retry limit, e.g. max 5 failed attempts):
       {
         "success": false,
         "message": "Too many failed attempts. Please request a new OTP."
       }

   -----------------------------------------------------------------------------
   C. Reset Password:
   -----------------------------------------------------------------------------
   - Endpoint: POST /api/v1/partner/auth/reset-password
   - Auth: Public
   - Description: Verified OTP eka samaga aluth password eka update kirima.

   - Request Headers:
     Content-Type: application/json

   - Request Body:
     {
       "email": "partner@example.com",
       "otp": "123456",
       "new_password": "NewSecurePassword123!",
       "confirm_password": "NewSecurePassword123!"
     }

   - Success Response (200 OK):
     {
       "success": true,
       "message": "Password has been reset successfully. Please login with your new password."
     }

   - Error Responses:
     * 400 Bad Request:
       {
         "success": false,
         "message": "Passwords do not match or password must be at least 8 characters."
       }
     * 400 Bad Request (Invalid/Expired OTP):
       {
         "success": false,
         "message": "Invalid or expired OTP session. Please try again."
       }
     * 404 Not Found:
       {
         "success": false,
         "message": "Partner account not found."
       }

   -----------------------------------------------------------------------------
   D. Backend Security & Business Logic Guidelines:
   -----------------------------------------------------------------------------
   1. OTP Format: 6-digit cryptographically random numeric code (e.g. 100000 - 999999).
   2. OTP Expiry: Code eka 5 minutes (300 seconds) walin expire wenna ona.
   3. Resend Cooldown: OTP ekak yawapu gaman winadi 1k (60s) yanakan aluth OTP ekak illanna bari wenna rate limit karanna.
   4. Max Retry: Waradi OTP ekak 5 wathawakata wada enter kaloth e OTP eka invalidate karanna ona.
   5. Invalidate Previous OTP: Aluth OTP ekak generate karanakota kalin thibunu unused OTPs invalidate/delete karanna ona.
   6. One-time Use: Password eka reset unu gaman OTP eka / reset token eka delete karanna ona (re-use karanna bari wenna).
   7. Invalidate Existing Sessions: Password eka reset karapu gaman, kalin partner login wela hitapu tokens/sessions thiyenawanam ewath invalidate/revoke karanna.
   8. Email Template: Sribees branding eka athuwa professional email template ekakin OTP eka partner ge email ekata send karanna.

