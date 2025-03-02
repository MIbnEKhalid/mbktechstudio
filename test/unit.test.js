const { JSDOM } = require("jsdom");

function testMetaKeywords(domain, path, expectedKeywords) {
    describe(`${domain}${path} main page landing`, () => {
        it("should have specific meta data", async () => {
            const response = await fetch(`http://localhost:3000${path}`, {
                headers: {
                    "x-forwarded-host": domain, // Override hostname
                },
            });
            const text = await response.text();
            const dom = new JSDOM(text);
            const doc = dom.window.document;
            const meta = doc.querySelector('meta[name="keywords"]');
            expect(meta).not.toBeNull();
            expect(meta.getAttribute("content")).toBe(expectedKeywords);
        });
    });
}

// Test cases for specific domains and paths
testMetaKeywords(
    "mbktechstudio.com",
    "/",
    "MBK Tech Studio, Open-Source, Software Development, Technology Solutions"
);

testMetaKeywords(
    "unilib.mbktechstudio.com",
    "/",
    "Unilib MBK Tech Studio, Open-Source, Course Materials, Assignments, Quiz"
);

testMetaKeywords(
    "unilib.mbktechstudio.com",
    "/history",
    "Unilib MBK Tech Studio, Historical Assignments, Archived Quizzes"
);

testMetaKeywords(
    "privacy.mbktechstudio.com",
    "/",
    "MBK Tech Studio, Web-Portal, Terms & Conditions, Privacy Policy, User Agreement"
);


testMetaKeywords(
    "portfolio.mbktechstudio.com",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "protfolio.mbktechstudio.com",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "ibnekhalid.me",
    "/",
    "portfolio, Muhammad Bin Khalid, ibnekhalid"
);

testMetaKeywords(
    "docs.mbktechstudio.com",
    "/",
    "MBK Tech Studio, Documentation, Projects, Cpp Projects, Game Development, Unity Assets, Web Development, Python Projects"
);