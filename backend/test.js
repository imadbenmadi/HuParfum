// API Test Script
// Tests all critical endpoints

const axios = require("axios");

const BASE_URL = "http://localhost:5001/api";
let userToken = null;
let adminToken = null;
let testUserId = null;
let testOrderId = null;

const tests = [];

// Helper to add tests
function test(name, fn) {
    tests.push({ name, fn });
}

// Helper functions
async function runTest(testFunc) {
    try {
        await testFunc();
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.message || err.message,
        };
    }
}

// Test 1: Health check
test("Health Check", async () => {
    const res = await axios.get("http://localhost:5001/health");
    if (!res.data.status) throw new Error("Health check failed");
});

// Test 2: User Registration
test("User Registration", async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
        name: "Test User",
        email: `testuser${Date.now()}@test.com`,
        phone: "0123456789",
        password: "Test@12345",
        passwordConfirm: "Test@12345",
    });
    if (!res.data.success) throw new Error("Registration failed");
    testUserId = res.data.user.id;
});

// Test 3: User Login
test("User Login", async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: `testuser${Date.now() - 5000}@test.com`,
        password: "Test@12345",
    });
    if (!res.data.success) throw new Error("Login failed");
    // userToken = res.data.token;
});

// Test 4: Get Products
test("Get Products", async () => {
    const res = await axios.get(`${BASE_URL}/products`);
    if (!res.data.success || !Array.isArray(res.data.products))
        throw new Error("Products not found");
});

// Test 5: Admin Login
test("Admin Login", async () => {
    const res = await axios.post(`${BASE_URL}/admin/login`, {
        email: "admin@huparfum.com",
        password: "admin123",
    });
    if (!res.data.success || !res.data.token)
        throw new Error("Admin login failed");
    adminToken = res.data.token;
});

// Test 6: Get Dashboard Stats
test("Get Dashboard Stats (Admin)", async () => {
    if (!adminToken) {
        throw new Error("Admin token not available");
    }
    const res = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.data.success || !res.data.stats)
        throw new Error("Dashboard stats not found");
});

// Test 7: Get All Orders (Admin)
test("Get All Orders (Admin)", async () => {
    if (!adminToken) {
        throw new Error("Admin token not available");
    }
    const res = await axios.get(`${BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.data.success || !Array.isArray(res.data.orders))
        throw new Error("Orders not found");
});

// Test 8: Get All Products (Admin)
test("Get All Products (Admin)", async () => {
    if (!adminToken) {
        throw new Error("Admin token not available");
    }
    const res = await axios.get(`${BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.data.success || !Array.isArray(res.data.products))
        throw new Error("Products not found");
});

// Main test runner
async function runAllTests() {
    console.log("\n[INFO] Running API Tests...\n");
    console.log("=".repeat(60));

    let passed = 0;
    let failed = 0;

    for (const t of tests) {
        const result = await runTest(t.fn);
        if (result.success) {
            console.log(`[OK] ${t.name}`);
            passed++;
        } else {
            console.log(`[ERROR] ${t.name}: ${result.error}`);
            failed++;
        }
    }

    console.log("=".repeat(60));
    console.log(
        `\n[SUMMARY] Passed: ${passed}/${tests.length}, Failed: ${failed}/${tests.length}\n`
    );

    if (failed === 0) {
        console.log("[OK] All tests passed!");
        process.exit(0);
    } else {
        console.log("[ERROR] Some tests failed");
        process.exit(1);
    }
}

// Run tests
runAllTests().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
