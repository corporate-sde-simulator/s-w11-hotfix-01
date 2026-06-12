# Beginner Explanatory Guide: SEC-310: Fix CORS Configuration for API Security

> **Task Type**: Service Task  
> **Domain/Focus**: API Security and CORS Configuration

---

## 1. The Goal (In-Depth Beginner Explanation)

### The Core Problem
In web development, Cross-Origin Resource Sharing (CORS) is a security feature that allows or restricts resources requested from another domain outside the domain from which the first resource was served. Currently, the API's CORS configuration is set to allow requests from all origins by using the wildcard character `*`. This means that any website, including potentially malicious ones, can make requests to our API on behalf of logged-in users. This is a significant security risk as it could lead to unauthorized access to sensitive user data.

The task at hand is to modify the CORS configuration to only allow requests from specific, trusted domains. This change is crucial for protecting user data and ensuring that only legitimate applications can interact with our API. By implementing this fix, we will enhance the security of our application and safeguard our users from potential attacks, such as Cross-Site Request Forgery (CSRF).

### Jargon Buster (Key Terms Explained)
* **CORS (Cross-Origin Resource Sharing)**: CORS is a security feature implemented in web browsers that allows or restricts web applications running at one origin (domain) to make requests to resources from another origin. For example, if your web application is hosted at `https://app.ourcompany.com`, it should only be able to access resources from trusted domains. If not configured correctly, it can lead to security vulnerabilities.

* **Origin**: An origin is defined by the combination of the protocol (http or https), domain (like `ourcompany.com`), and port (like `:3000`). For instance, `https://app.ourcompany.com` is a different origin from `http://localhost:3000`. Browsers enforce the same-origin policy to prevent malicious sites from accessing sensitive data from another site.

* **Allowed Origins**: This refers to a list of domains that are permitted to access resources on the server. In our case, we will define a list of trusted domains that can make API requests, ensuring that only these domains are allowed to interact with our API.

### Expected Outcome
After implementing the solution, the API should only respond to requests from the specified allowed origins. 

**Before**: The API allows requests from any origin, which poses a security risk. For example, a request from `https://evil-site.com` would be accepted.

**After**: The API will only accept requests from `https://app.ourcompany.com`, `https://admin.ourcompany.com`, and `http://localhost:3000`. If a request comes from `https://evil-site.com`, it will be rejected, thereby enhancing the security of the application.

---

## 2. Related Coding Concepts & Syntax (50% Theory, 50% Practice)

### Concept 1: CORS Configuration
#### 📘 Theoretical Overview (50%)
CORS is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. It is crucial for web security as it prevents unauthorized access to sensitive data. If CORS is not configured correctly, it can lead to vulnerabilities where malicious sites can perform actions on behalf of users without their consent.

When a browser makes a cross-origin request, it sends an `Origin` header to the server, indicating the origin of the request. The server can then respond with the `Access-Control-Allow-Origin` header to specify which origins are allowed to access the resource. If the origin is not in the allowed list, the browser will block the request.

#### 💻 Syntax & Practical Examples (50%)
* **Language Syntax**:
  ```javascript
  function corsMiddleware(req) {
      const origin = req.headers.origin; // Get the origin of the request
      const ALLOWED_ORIGINS = [
          'https://app.ourcompany.com',
          'https://admin.ourcompany.com',
          'http://localhost:3000',
      ];

      // Check if the origin is in the allowed list
      if (ALLOWED_ORIGINS.includes(origin)) {
          return {
              'Access-Control-Allow-Origin': origin, // Allow the request
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Allow-Credentials': 'true',
          };
      } else {
          return {
              'Access-Control-Allow-Origin': 'null', // Deny the request
          };
      }
  }
  ```

* **Real-World Application**:
  ```javascript
  // Example of using the CORS middleware in an Express.js application
  const express = require('express');
  const app = express();

  app.use((req, res, next) => {
      const corsHeaders = corsMiddleware(req);
      res.set(corsHeaders);
      next();
  });

  app.get('/api/data', (req, res) => {
      res.json({ message: 'This is secure data!' });
  });

  app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
  });
  ```

---

## 3. Step-by-Step Logic & Walkthrough

1. **Step 1: Locate and Analyze the Target File**
   * Navigate to the `s-w11-hotfix-01` folder and open the `cors_fix.js` file. 
   * Look at the lines of code where the CORS headers are defined, specifically the `corsMiddleware` function.

2. **Step 2: Input Verification & Validation**
   * Check if the `req.headers.origin` is present. If it is `null` or `undefined`, we should handle that case to avoid errors.

3. **Step 3: Core Implementation / Modification**
   * Modify the `corsMiddleware` function to check if the `origin` from the request is included in the `ALLOWED_ORIGINS` array. If it is, set the `Access-Control-Allow-Origin` header to that origin; otherwise, deny the request by setting it to `null`.

4. **Step 4: Output Verification & Testing**
   * After making the changes, run the tests included at the bottom of the `cors_fix.js` file. Ensure that requests from allowed origins succeed while requests from disallowed origins fail.

---

## 4. Detailed Walkthrough of Test Cases

### Test Case 1: Standard / Success Case
* **Description**: This test checks if a request from an allowed origin is processed correctly.
* **Inputs**:
  ```json
  {
      "headers": {
          "origin": "https://app.ourcompany.com"
      }
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The function `corsMiddleware` receives the request with the origin `https://app.ourcompany.com`.
  2. The function checks if this origin is in the `ALLOWED_ORIGINS` array, which it is.
  3. The function sets the `Access-Control-Allow-Origin` header to `https://app.ourcompany.com` and returns the appropriate headers.
* **Expected Output**: 
  ```json
  {
      "Access-Control-Allow-Origin": "https://app.ourcompany.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
  }
  ```

### Test Case 2: Edge Case / Validation Fail
* **Description**: This test checks if a request from a disallowed origin is rejected.
* **Inputs**:
  ```json
  {
      "headers": {
          "origin": "https://evil-site.com"
      }
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The function `corsMiddleware` receives the request with the origin `https://evil-site.com`.
  2. The function checks if this origin is in the `ALLOWED_ORIGINS` array, which it is not.
  3. The function sets the `Access-Control-Allow-Origin` header to `null`, effectively denying the request.
* **Expected Output**: 
  ```json
  {
      "Access-Control-Allow-Origin": "null"
  }
  ``` 

By following this guide, you should be able to understand the importance of CORS, how to implement the necessary changes, and verify that your implementation works as intended.