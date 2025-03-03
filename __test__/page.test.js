const { JSDOM } = require("jsdom");
 
function testMetaKeywords(domain, path, expectedKeywords) {
    describe(`${domain}${path} page landing`, () => {
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
    "mbktechstudio.com",
    "/404PageTest",
    "404, Page Not Found, MBK Tech Studio, Error Page"
); 

testMetaKeywords(
    "mbktechstudio.com",
    "/TrackTicket",
    "support ticket system, track ticket, resolve queries, MBK Tech Studio, customer support, ticket status, help desk, issue tracking"
); 

testMetaKeywords(
    "mbktechstudio.com",
    "/Terms&Conditions",
    "MBK Tech Studio, Web-Portal, Terms & Conditions, Privacy Policy, User Agreement"
); 

testMetaKeywords(
    "mbktechstudio.com",
    "/Support",
    "Support, Contact, MBK Tech Studio, Feedback, Collaboration, General Inquiry, Technical Support, Bug Reporting, Feature Requests"
); 

testMetaKeywords(
    "mbktechstudio.com",
    "/FAQs",
    "FAQs, Frequently Asked Questions, MBK Tech Studio, Help Center"
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