# Auth Confirm Folder

This folder contains the logic for handling authentication confirmation. When a user clicks on a confirmation link sent to their email, they are redirected to this folder's endpoint to complete the authentication process.

## Overview

The `auth/confirm` folder is responsible for:

1. **Handling Redirect Links**: Processing the redirect link sent to the user's email for authentication confirmation.
2. **Completing Authentication**: Finalizing the authentication process and updating the user's status.

## Folder Structure

```typescript
auth/
└── confirm/
  ├── route.ts
└── README.md
```

### Files

#### 1. route.ts

The `route.ts` file is the main entry point for handling the authentication confirmation process. It processes the token from the redirect link and completes the authentication process.

##### Example Implementation

```typescript
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirect(next);
      return;
    }
  }

  redirect("/error");
}
```

##### Explanation

- **Imports**: The necessary types and functions are imported from various modules, including `@supabase/supabase-js`, `next/server`, and utility functions for creating a Supabase client and handling redirects.
- **GET Function**: The `GET` function is an asynchronous function that takes a `NextRequest` object as its parameter. It extracts query parameters from the request URL using the `URL` class.
- **Token and Type**: The function retrieves `token_hash` and `type` parameters, which are essential for OTP verification and redirection.
- **Supabase Client**: If both `token_hash` and `type` are present, it creates a Supabase client using the `createClient` function.
- **OTP Verification**: The Supabase client is used to verify the OTP by calling the `verifyOtp` method with the extracted `token_hash` and `type`.
- **Redirection**: If the OTP verification is successful, the user is redirected to the URL specified by the `next` parameter. If there is an error during verification, the user is redirected to an error page.
