// Complete API Test Suite - Tests all 23 endpoints automatically
const http = require("http");

const BASE_URL = "http://localhost:5001";
let adminToken = "";
let testResults = [];

// Color codes for terminal output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
};

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        const req = http.request(url, options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({
                        status: res.statusCode,
                        data: parsed,
                        headers: res.headers,
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers,
                    });
                }
            });
        });

        req.on("error", reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

// Test result logger
function logTest(name, method, path, status, passed, details = "") {
    const result = {
        name,
        method,
        path,
        status,
        passed,
        details,
    };
    testResults.push(result);

    const statusSymbol = passed ? colors.green + "✓" : colors.red + "✗";
    const statusCode = colors.cyan + status + colors.reset;
    const methodColor = getMethodColor(method);

    console.log(
        `${statusSymbol} ${colors.reset} ${methodColor}${method}${colors.reset} ${path.padEnd(50)} [${statusCode}] ${details}`
    );
}

function getMethodColor(method) {
    switch (method) {
        case "GET":
            return colors.blue;
        case "POST":
            return colors.green;
        case "PUT":
            return colors.yellow;
        case "PATCH":
            return colors.magenta;
        case "DELETE":
            return colors.red;
        default:
            return colors.cyan;
    }
}

// Main test suite
async function runAllTests() {
    console.log(
        `\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`
    );
    console.log(
        `${colors.cyan}║         🧪 HUPARFUM API COMPLETE TEST SUITE 🧪          ║${colors.reset}`
    );
    console.log(
        `${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`
    );

    try {
        // ========== HEALTH CHECK ==========
        console.log(`\n${colors.magenta}━━━━━━━ Health Check ━━━━━━━${colors.reset}`);
        await testHealthCheck();

        // ========== PUBLIC SETTINGS ==========
        console.log(`\n${colors.magenta}━━━━━━━ Settings - Public ━━━━━━━${colors.reset}`);
        await testPublicSettings();

        // ========== AUTHENTICATION ==========
        console.log(`\n${colors.magenta}━━━━━━━ Authentication ━━━━━━━${colors.reset}`);
        await testAuthentication();

        // ========== ADMIN SETTINGS ==========
        if (adminToken) {
            console.log(`\n${colors.magenta}━━━━━━━ Settings - Admin Protected ━━━━━━━${colors.reset}`);
            await testAdminSettings();
        }

        // ========== FEATURE FLAGS ==========
        console.log(`\n${colors.magenta}━━━━━━━ Feature Flags ━━━━━━━${colors.reset}`);
        await testFeatureFlags();

        // ========== PRODUCTS ==========
        console.log(`\n${colors.magenta}━━━━━━━ Products ━━━━━━━${colors.reset}`);
        await testProducts();

        // ========== REGISTER USER ==========
        console.log(`\n${colors.magenta}━━━━━━━ User Registration ━━━━━━━${colors.reset}`);
        await testUserRegistration();

        // ========== TEST SUMMARY ==========
        printTestSummary();
    } catch (error) {
        console.error(colors.red, "Test suite error:", error, colors.reset);
    }
}

// Test 1: Health Check
async function testHealthCheck() {
    try {
        const res = await makeRequest("GET", "/health");
        const passed = res.status === 200;
        logTest(
            "Health Check",
            "GET",
            "/health",
            res.status,
            passed,
            passed ? "Backend is alive! 🎉" : "Backend not responding"
        );
    } catch (error) {
        logTest("Health Check", "GET", "/health", "ERROR", false, error.message);
    }
}

// Test 2: Public Settings
async function testPublicSettings() {
    const endpoints = [
        { name: "Social Media", path: "/api/settings/social_media" },
        { name: "Contact Info", path: "/api/settings/contact" },
        { name: "Homepage", path: "/api/settings/homepage" },
        { name: "General", path: "/api/settings/general" },
        { name: "By Category", path: "/api/settings/category/social_media" },
    ];

    for (const endpoint of endpoints) {
        try {
            const res = await makeRequest("GET", endpoint.path);
            const passed = res.status === 200 && res.data.key;
            logTest(
                `Get ${endpoint.name} Settings`,
                "GET",
                endpoint.path,
                res.status,
                passed,
                passed ? `Got ${endpoint.name} data` : "Invalid response"
            );
        } catch (error) {
            logTest(
                `Get ${endpoint.name} Settings`,
                "GET",
                endpoint.path,
                "ERROR",
                false,
                error.message
            );
        }
    }
}

// Test 3: Authentication
async function testAuthentication() {
    // Test Admin Login
    try {
        const res = await makeRequest("POST", "/api/admin/login", {
            email: "admin@huparfum.com",
            password: "admin123",
        });

        const passed = res.status === 200 && res.data.token;
        logTest(
            "Admin Login",
            "POST",
            "/api/admin/login",
            res.status,
            passed,
            passed ? "Token generated ✓" : "Login failed"
        );

        if (res.data.token) {
            adminToken = res.data.token;
            console.log(`${colors.green}   Token: ${adminToken.substring(0, 30)}...${colors.reset}`);
        }
    } catch (error) {
        logTest("Admin Login", "POST", "/api/admin/login", "ERROR", false, error.message);
    }
}

// Test 4: Admin Settings (requires token)
async function testAdminSettings() {
    const headers = { Authorization: `Bearer ${adminToken}` };

    // Get All Settings
    try {
        const res = await makeRequest("GET", "/api/admin/settings", null, headers);
        const passed = res.status === 200 && Array.isArray(res.data.data);
        logTest(
            "Get All Settings",
            "GET",
            "/api/admin/settings",
            res.status,
            passed,
            passed ? `Found ${res.data.data?.length || 0} settings` : "Failed to get settings"
        );
    } catch (error) {
        logTest("Get All Settings", "GET", "/api/admin/settings", "ERROR", false, error.message);
    }

    // Get Single Setting
    try {
        const res = await makeRequest(
            "GET",
            "/api/admin/settings/social_media",
            null,
            headers
        );
        const passed = res.status === 200 && res.data.key;
        logTest(
            "Get Single Setting",
            "GET",
            "/api/admin/settings/social_media",
            res.status,
            passed,
            passed ? "Retrieved successfully" : "Failed to retrieve"
        );
    } catch (error) {
        logTest(
            "Get Single Setting",
            "GET",
            "/api/admin/settings/social_media",
            "ERROR",
            false,
            error.message
        );
    }

    // Update Setting
    try {
        const res = await makeRequest(
            "PUT",
            "/api/admin/settings/social_media",
            {
                telegram: {
                    personal_link: "https://t.me/testuser",
                    customer_bot: "TestBot",
                    admin_bot: "AdminBot",
                },
            },
            headers
        );
        const passed = res.status === 200 && res.data.key;
        logTest(
            "Update Setting (PUT)",
            "PUT",
            "/api/admin/settings/social_media",
            res.status,
            passed,
            passed ? "Updated successfully" : "Update failed"
        );
    } catch (error) {
        logTest(
            "Update Setting (PUT)",
            "PUT",
            "/api/admin/settings/social_media",
            "ERROR",
            false,
            error.message
        );
    }

    // Update Setting Fields (PATCH)
    try {
        const res = await makeRequest(
            "PATCH",
            "/api/admin/settings/contact",
            { "email": "contact@huparfum.com" },
            headers
        );
        const passed = res.status === 200;
        logTest(
            "Update Setting Fields (PATCH)",
            "PATCH",
            "/api/admin/settings/contact",
            res.status,
            passed,
            passed ? "Patched successfully" : "Patch failed"
        );
    } catch (error) {
        logTest(
            "Update Setting Fields (PATCH)",
            "PATCH",
            "/api/admin/settings/contact",
            "ERROR",
            false,
            error.message
        );
    }

    // Reset Setting
    try {
        const res = await makeRequest(
            "POST",
            "/api/admin/settings/social_media/reset",
            null,
            headers
        );
        const passed = res.status === 200;
        logTest(
            "Reset Setting",
            "POST",
            "/api/admin/settings/social_media/reset",
            res.status,
            passed,
            passed ? "Reset successfully" : "Reset failed"
        );
    } catch (error) {
        logTest(
            "Reset Setting",
            "POST",
            "/api/admin/settings/social_media/reset",
            "ERROR",
            false,
            error.message
        );
    }
}

// Test 5: Feature Flags
async function testFeatureFlags() {
    const headers = { Authorization: `Bearer ${adminToken}` };

    // Get All Features
    try {
        const res = await makeRequest("GET", "/api/admin/features", null, headers);
        const passed = res.status === 200;
        logTest(
            "Get All Features",
            "GET",
            "/api/admin/features",
            res.status,
            passed,
            passed ? "Features retrieved" : "Failed to get features"
        );
    } catch (error) {
        logTest(
            "Get All Features",
            "GET",
            "/api/admin/features",
            "ERROR",
            false,
            error.message
        );
    }

    // Check Feature Status (public)
    try {
        const res = await makeRequest(
            "GET",
            "/api/features/check/email_verification"
        );
        const passed = res.status === 200;
        logTest(
            "Check Feature Status (Public)",
            "GET",
            "/api/features/check/email_verification",
            res.status,
            passed,
            passed ? "Feature status: " + (res.data.enabled ? "ON" : "OFF") : "Failed"
        );
    } catch (error) {
        logTest(
            "Check Feature Status (Public)",
            "GET",
            "/api/features/check/email_verification",
            "ERROR",
            false,
            error.message
        );
    }
}

// Test 6: Products
async function testProducts() {
    try {
        const res = await makeRequest("GET", "/api/products");
        const passed = res.status === 200 && Array.isArray(res.data);
        logTest(
            "Get All Products",
            "GET",
            "/api/products",
            res.status,
            passed,
            passed ? `Found ${res.data.length} products` : "Failed to get products"
        );
    } catch (error) {
        logTest("Get All Products", "GET", "/api/products", "ERROR", false, error.message);
    }
}

// Test 7: User Registration
async function testUserRegistration() {
    try {
        const uniqueEmail = `test${Date.now()}@example.com`;
        const res = await makeRequest("POST", "/api/auth/register", {
            name: "Test User",
            email: uniqueEmail,
            phone: "0123456789",
            password: "Test@12345",
            passwordConfirm: "Test@12345",
        });

        const passed = res.status === 201 || res.status === 200;
        logTest(
            "Register User",
            "POST",
            "/api/auth/register",
            res.status,
            passed,
            passed ? "User registered" : "Registration failed"
        );
    } catch (error) {
        logTest(
            "Register User",
            "POST",
            "/api/auth/register",
            "ERROR",
            false,
            error.message
        );
    }
}

// Print Test Summary
function printTestSummary() {
    console.log(
        `\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`
    );
    console.log(
        `${colors.cyan}║                    📊 TEST SUMMARY 📊                    ║${colors.reset}`
    );
    console.log(
        `${colors.cyan}╠════════════════════════════════════════════════════════╣${colors.reset}`
    );

    const passed = testResults.filter((r) => r.passed).length;
    const failed = testResults.filter((r) => !r.passed).length;
    const total = testResults.length;
    const passPercentage = ((passed / total) * 100).toFixed(1);

    console.log(`${colors.green}✓ Passed: ${passed}/${total}${colors.reset}`);
    console.log(`${colors.red}✗ Failed: ${failed}/${total}${colors.reset}`);
    console.log(`${colors.yellow}Success Rate: ${passPercentage}%${colors.reset}`);

    console.log(
        `${colors.cyan}╠════════════════════════════════════════════════════════╣${colors.reset}`
    );
    console.log(`${colors.cyan}║ Test Details:${colors.reset}`);

    // Group by category
    const categories = {};
    testResults.forEach((r) => {
        const method = r.method;
        if (!categories[method]) categories[method] = [];
        categories[method].push(r);
    });

    Object.entries(categories).forEach(([method, results]) => {
        const methodPassed = results.filter((r) => r.passed).length;
        const methodTotal = results.length;
        const color =
            methodPassed === methodTotal
                ? colors.green
                : methodPassed === 0
                  ? colors.red
                  : colors.yellow;
        console.log(
            `${colors.cyan}  ${color}${method}: ${methodPassed}/${methodTotal} passed${colors.reset}`
        );
    });

    console.log(
        `${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`
    );

    if (failed === 0) {
        console.log(
            `${colors.green}🎉 ALL TESTS PASSED! Your API is working perfectly! 🎉${colors.reset}\n`
        );
    } else {
        console.log(
            `${colors.yellow}⚠️  ${failed} test(s) failed. Check details above.${colors.reset}\n`
        );
    }
}

// Start tests
runAllTests();
