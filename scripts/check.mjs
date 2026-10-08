import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = async (file) => readFile(new URL(file, root), "utf8");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const [html, carsSource, servicesSource, app, images, vercelSource] = await Promise.all([
  read("index.html"),
  read("data/cars.js"),
  read("data/services.js"),
  read("assets/js/app.js"),
  read("assets/js/images.js"),
  read("vercel.json"),
]);

const localReferences = [...html.matchAll(/(?:src|href)="((?:assets|data|images)\/[^"?#]+)"/g)];
for (const [, reference] of localReferences) {
  try {
    await access(new URL(reference, root));
  } catch {
    const isImage = /\.(?:jpe?g|png|webp|gif)$/i.test(reference);
    const hasFallback = html.includes(`src="${reference}"`) && html.includes('onerror="imageFallback(this)"');
    assert(isImage && hasFallback, `missing local asset without an image fallback: ${reference}`);
  }
}

const inventoryContext = { cars: undefined };
new Function("context", `with (context) { ${carsSource.replace('"use strict";', "").replace("const cars=", "context.cars=")} }`)(inventoryContext);
const serviceContext = { services: undefined };
new Function("context", `with (context) { ${servicesSource.replace('"use strict";', "").replace("const services=", "context.services=")} }`)(serviceContext);
const vercel = JSON.parse(vercelSource);

assert(html.trimEnd().endsWith("</html>"), "index.html must end with </html>");
assert(html.includes('href="assets/css/styles.css"'), "main stylesheet link missing");
assert(html.indexOf('src="data/cars.js"') < html.indexOf('src="assets/js/app.js"'), "car data must load before app.js");
assert(html.includes('href="assets/css/styles.css"'), "site stylesheet path must be local");
assert(html.includes('src="assets/js/images.js"') && html.includes('src="assets/js/app.js"'), "site scripts must be locally referenced");
assert(vercel.outputDirectory === "." && vercel.framework === null, "Vercel must serve this as a no-build static project");
assert(html.includes("0705 135 273"), "business phone missing from page");
assert(html.includes("rakitashadrack@gmail.com"), "business email missing from page");
assert(carsSource.includes("const cars=["), "car data array missing");
assert(serviceContext.services?.length === 8, `expected 8 services, received ${serviceContext.services?.length ?? 0}`);
assert(inventoryContext.cars?.length === 0, `expected no unverified vehicle listings, received ${inventoryContext.cars?.length ?? 0}`);
assert(app.includes("encodeURIComponent(t)"), "WhatsApp text must be URL encoded");
assert(app.includes("Order on WhatsApp"), "car cards need a WhatsApp order action");
assert(images.includes("function imageFallback"), "image fallback function missing");
assert(images.includes('const PEXELS_KEY = "PASTE_YOUR_KEY_HERE"'), "Pexels key placeholder constant missing");
assert(images.includes("sessionStorage.getItem(cacheKey)") && images.includes("sessionStorage.setItem(cacheKey"), "Pexels results must use sessionStorage cache");
assert(images.includes("async function usePexels") && images.includes("showCarSvg(img)"), "Pexels fallback must end with inline SVG");
assert(app.includes('data-car=') && app.includes('onerror=\"${handler}\"'), "generated images must identify cars and set an error handler");
assert(app.includes("Photos from Pexels") && app.includes("https://www.pexels.com/"), "Pexels footer attribution missing");
assert(images.includes('img.style.visibility = "hidden"') && images.includes('img.style.visibility = "visible"'), "failed local photos must stay hidden until a valid fallback is ready");

if (failures.length) {
  console.error("Project checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Project checks passed: empty verified inventory, 8 services, application assets and static Vercel configuration.");
}
