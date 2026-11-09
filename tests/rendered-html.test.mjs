import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(pathname) {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const routes = [
  ["/", /An Education That Inspires/],
  ["/our-school", /A community with a/],
  ["/our-school/about-us", /A Nakuru legacy with a/],
  ["/our-school/board-chair-message", /A shared commitment to/],
  ["/our-school/school-administrator-message", /A safe place to learn/],
  ["/our-school/senior-management-team", /A clear structure for/],
  ["/education", /Learning that moves/],
  ["/education/eyfs", /Curiosity starts/],
  ["/education/junior-school", /Strong foundations for/],
  ["/education/senior-school", /Depth, direction and/],
  ["/education/igcse", /Globally recognised/],
  ["/education/a-level", /Focused study/],
  ["/admissions", /Your family’s journey/],
  ["/admissions/fee-structure", /Clear information for/],
  ["/sports-and-co-curricular", /Beyond the classroom/],
  ["/stories", /Experiences that shape/],
  ["/stories/learning-through-discovery", /Learning Through Discovery/],
  ["/stories/confidence-to-compete", /Confidence to Compete/],
  ["/stories/learning-beyond-the-classroom", /Learning Beyond the Classroom/],
  ["/gallery", /Moments that tell the/],
  ["/contact", /Let’s begin the/],
  ["/dashboard", /School Desk/],
];

for (const [pathname, heading] of routes) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, heading);
    assert.match(html, /Shah Lalji Nangpar Academy/i);
    assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
    assert.doesNotMatch(html, /https?:\/\/shahlalji\.ac\.ke/i);
  });
}

test("leadership page presents the complete management hierarchy", async () => {
  const response = await render("/our-school/senior-management-team");
  const html = await response.text();

  assert.match(html, /Board Chair/);
  assert.match(html, /School Administration/);
  assert.match(html, /School Heads/);
  assert.match(html, /Deputies and Co-curricular Leadership/);
  assert.match(html, /Operational Leadership/);
  assert.match(html, /Head Senior School/);
  assert.match(html, /Head Junior School/);
  assert.match(html, /Head of EYFS/);
  assert.match(html, /Deputy Head Senior School/);
  assert.match(html, /Deputy Head Junior School/);
  assert.match(html, /Head Co-curricular/);
  assert.match(html, /Human Resources/);
  assert.match(html, /Head of Information Technology/);
  assert.match(html, /Facilities Manager/);
});

test("the standalone Homework Policy page has been removed", async () => {
  const response = await render("/education/homework-policy");
  assert.equal(response.status, 404);
});

test("the fee structure publishes the current schedule and downloadable PDF", async () => {
  const response = await render("/admissions/fee-structure");
  const html = await response.text();

  assert.match(html, /2026-2027/);
  assert.match(html, /Playgroup/);
  assert.match(html, /Year 11/);
  assert.match(html, /Download PDF/);
  assert.match(html, /fees-structure-2026-2027[.]pdf/);
});

test("enrichment page presents the whole-school programme by section", async () => {
  const response = await render("/sports-and-co-curricular");
  const html = await response.text();

  assert.match(html, /Sports, Swimming and Co-curricular Department/);
  assert.match(html, /Physical education &amp; sport/i);
  assert.match(html, /Swimming/);
  assert.match(html, /Playgroup/);
  assert.match(html, /Junior School/);
  assert.match(html, /Senior School/);
  assert.doesNotMatch(html, /Section leadership/);
  assert.match(html, /Message from/);
});

test("the public events page does not present expired events", async () => {
  const response = await render("/events");
  const html = await response.text();

  assert.doesNotMatch(html, /Recently held/);
});

test("story cards and articles display their authors", async () => {
  const listingResponse = await render("/stories");
  const listingHtml = await listingResponse.text();
  assert.match(listingHtml, /SLNA Communications Team/);

  const articleResponse = await render("/stories/learning-through-discovery");
  const articleHtml = await articleResponse.text();
  assert.match(articleHtml, /SLNA Communications Team/);
});

test("the former School Life URL redirects to Sports and Co-curricular", async () => {
  const response = await render("/school-life");
  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "http://localhost/sports-and-co-curricular",
  );
});

test("the former School Profile URL redirects to the combined About Us page", async () => {
  const response = await render("/education/school-profile");
  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "http://localhost/our-school/about-us",
  );
});

test("the former Nursery URL redirects to the EYFS page", async () => {
  const response = await render("/education/nursery");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "http://localhost/education/eyfs");
});

test("main navigation exposes every public detail page", async () => {
  const response = await render("/");
  const html = await response.text();
  const detailRoutes = [
    "/our-school/about-us",
    "/our-school/board-chair-message",
    "/our-school/school-administrator-message",
    "/our-school/senior-management-team",
    "/education/eyfs",
    "/education/junior-school",
    "/education/senior-school",
    "/education/igcse",
    "/education/a-level",
    "/admissions/fee-structure",
    "/sports-and-co-curricular",
  ];

  for (const route of detailRoutes) {
    assert.match(html, new RegExp(`href="${route}"`));
  }

  assert.doesNotMatch(html, /education\/homework-policy/i);
  assert.doesNotMatch(html, /https?:\/\/shahlalji\.ac\.ke/i);
  assert.match(html, /Created by/);
  assert.match(html, /Mwangi Ngugi/);
  assert.match(html, /Sports &amp; Co[.]/);
  assert.match(html, /Back to the main navigation/);
});

test("sitemap is host-configurable and includes every leadership page", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();

  assert.match(xml, /http:\/\/localhost:3000\/our-school\/about-us/);
  assert.match(xml, /http:\/\/localhost:3000\/our-school\/board-chair-message/);
  assert.match(
    xml,
    /http:\/\/localhost:3000\/our-school\/school-administrator-message/,
  );
  assert.match(
    xml,
    /http:\/\/localhost:3000\/our-school\/senior-management-team/,
  );
  assert.match(xml, /http:\/\/localhost:3000\/education\/igcse/);
  assert.match(xml, /http:\/\/localhost:3000\/sports-and-co-curricular/);
  assert.doesNotMatch(xml, /shahlalji\.ac\.ke/i);
});

test("production dashboard APIs stay protected when local preview is configured", async () => {
  const response = await render("/api/dashboard/stories");
  assert.equal(response.status, 401);

  const payload = await response.json();
  assert.match(payload.error, /Sign in is required/i);
});
