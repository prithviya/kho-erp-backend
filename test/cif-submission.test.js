const test = require("node:test");
const assert = require("node:assert/strict");

const baseUrl = process.env.CIF_API_URL || "http://localhost:5000/api/cif-submissions";
const token = process.env.CIF_TEST_TOKEN;
const authenticated = { Authorization: `Bearer ${token}` };

const uniquePersonal = () => ({
    fullName: `CIF Test ${Date.now()}`,
    email: `cif-test-${Date.now()}@example.com`,
    phoneNumber: `9${String(Date.now()).slice(-9)}`,
    gender: "Other",
});

const submission = (personal = uniquePersonal()) => ({
    personal,
    academics: [{
        degree: "BSc",
        university: "Test University",
        graduationYear: 2021,
        grade: "A",
        city: "Test City",
    }],
    experiences: [{
        companyName: "Test Company",
        location: "Test City",
        role: "Developer",
        startDate: "2022-01-01",
    }],
    skills: [{
        skillName: "JavaScript",
        skillLevel: "Advanced",
        year: "2022-01-01",
        provider: "Test Institute",
    }],
    softwares: [{ tools: "Excel", levels: "Good" }],
    languages: [{ language: "English", Speak: "fluent", Read: "fluent", Write: "fluent" }],
    references: [{
        referenceName: "Test Reference",
        referenceEmail: "reference@example.com",
        referencePhone: "9876543210",
    }],
});

const multipartBody = (data) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
        form.append(key, JSON.stringify(value));
    }
    return form;
};

async function post(data, headers = authenticated) {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers,
        body: multipartBody(data),
    });
    return { response, body: await response.json() };
}

test("rejects malformed JSON before database work", async () => {
    const form = new FormData();
    form.append("personal", "not-json");
    const response = await fetch(baseUrl, { method: "POST", body: form });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
});

test("creates a complete submission", { skip: !token }, async () => {
    const { response, body } = await post(submission());
    assert.equal(response.status, 201, JSON.stringify(body));
    assert.equal(body.success, true);
});

test("creates a submission with empty optional collections", { skip: !token }, async () => {
    const data = submission();
    data.academics = [];
    data.experiences = [];
    data.skills = [];
    data.softwares = [];
    data.languages = [];
    data.references = [];
    const { response, body } = await post(data);
    assert.equal(response.status, 201, JSON.stringify(body));
    assert.equal(body.success, true);
});

test("rejects duplicate email and phone", { skip: !token }, async () => {
    const data = submission();
    const first = await post(data);
    assert.equal(first.response.status, 201, JSON.stringify(first.body));

    const duplicate = await post({ ...data, personal: { ...data.personal, phoneNumber: `8${String(Date.now()).slice(-9)}` } });
    assert.notEqual(duplicate.response.status, 201);
    assert.match(duplicate.body.message, /Email already exists|already exists/i);
});

test("accepts canonical software and language field names", { skip: !token }, async () => {
    const data = submission();
    data.softwares = [{ toolName: "Excel", proficiencyLevel: "Good" }];
    data.languages = [{ languageName: "English", speakLevel: "Fluent", readLevel: "Fluent", writeLevel: "Fluent" }];
    const { response, body } = await post(data);
    assert.equal(response.status, 201, JSON.stringify(body));
    assert.equal(body.success, true);
});
