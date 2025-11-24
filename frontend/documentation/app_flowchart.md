flowchart TD
  A[Start] --> B[Visit Site]
  B --> C[Login or Register]
  C --> D[Authenticate Credentials]
  D --> E{Authentication Successful}
  E -- No --> F[Show Error]
  F --> C
  E -- Yes --> G[Check User Role]
  G --> H{User Role Admin}
  H -- Yes --> I[Admin Dashboard]
  H -- No --> J[Customer Dashboard]
  I --> K[Manage Menu]
  K --> L[Manage Orders]
  L --> M[Manage Users]
  M --> N[Logout]
  J --> O[Browse Menu]
  O --> P[Add Items to Cart]
  P --> Q[Proceed to Checkout]
  Q --> R[Place Order]
  R --> S[Order Confirmation]
  S --> T[View Order History]
  T --> N