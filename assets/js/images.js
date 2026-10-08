"use strict";
const PEXELS_KEY = "PASTE_YOUR_KEY_HERE";

function showCarSvg(img) {
  if (img.dataset.svgFallback === "true") return;
  img.dataset.svgFallback = "true";
  const color = /^#[\da-f]{6}$/i.test(img.dataset.color || "") ? img.dataset.color : "#ff5a1f";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540"><rect width="900" height="540" fill="#202124"/><path d="M0 390h900v150H0z" fill="#18191b"/><path d="m177 337 37-91q12-36 53-36h260q36 0 58 31l64 96 39 20v62H190v-48z" fill="${color}"/><path d="m273 231-33 91h361l-58-79q-9-12-25-12z" fill="#bac4c6" opacity=".72"/><path d="M197 344h490" stroke="#fff" stroke-opacity=".2" stroke-width="8"/><circle cx="300" cy="416" r="51" fill="#111214"/><circle cx="300" cy="416" r="24" fill="#777a7d"/><circle cx="592" cy="416" r="51" fill="#111214"/><circle cx="592" cy="416" r="24" fill="#777a7d"/><path d="M0 480h900" stroke="#ff5a1f" stroke-opacity=".7" stroke-width="3"/><text x="40" y="70" fill="#f2f0ec" font-family="Arial" font-size="22" letter-spacing="4">KILIMANI GARAGE</text></svg>`;
  img.onerror = null;
  img.style.visibility = "visible";
  img.title = "Illustrative car silhouette";
  img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function pexelsPhoto(query) {
  const cacheKey = `px:${query.toLowerCase()}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    // Storage may be disabled for local files or private browsing.
  }
  if (!PEXELS_KEY || PEXELS_KEY.startsWith("PASTE")) return null;
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?per_page=3&orientation=landscape&query=${encodeURIComponent(query)}`, {
      headers: { Authorization: PEXELS_KEY }
    });
    if (!response.ok) return null;
    const data = await response.json();
    const photo = data.photos && data.photos[0];
    if (!photo || !photo.src || !photo.src.large || !photo.photographer || !photo.url) return null;
    const result = { src: photo.src.large, by: photo.photographer, url: photo.url };
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (error) {
      // A cache write failure should not block the image.
    }
    return result;
  } catch (error) {
    return null;
  }
}

async function usePexels(img) {
  if (img.dataset.pexelsTried === "true") {
    showCarSvg(img);
    return;
  }
  img.dataset.pexelsTried = "true";
  img.style.visibility = "hidden";
  img.onerror = () => showCarSvg(img);
  const car = (img.dataset.car || "car").trim();
  const photo = await pexelsPhoto(`${car} car`);
  if (!photo) {
    showCarSvg(img);
    return;
  }
  img.title = `Photo by ${photo.by} on Pexels`;
  img.dataset.pexelsUrl = photo.url;
  img.onload = () => { img.style.visibility = "visible"; };
  img.src = photo.src;
}

function imageFallback(img) {
  if (img.dataset.genericFallback === "true") return;
  img.dataset.genericFallback = "true";
  const color = /^#[\da-f]{6}$/i.test(img.dataset.color || "") ? img.dataset.color : "#ff5a1f";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540"><rect width="900" height="540" fill="#202124"/><path d="M0 390h900v150H0z" fill="#18191b"/><path d="m177 337 37-91q12-36 53-36h260q36 0 58 31l64 96 39 20v62H190v-48z" fill="${color}"/><path d="m273 231-33 91h361l-58-79q-9-12-25-12z" fill="#bac4c6" opacity=".72"/><path d="M197 344h490" stroke="#fff" stroke-opacity=".2" stroke-width="8"/><circle cx="300" cy="416" r="51" fill="#111214"/><circle cx="300" cy="416" r="24" fill="#777a7d"/><circle cx="592" cy="416" r="51" fill="#111214"/><circle cx="592" cy="416" r="24" fill="#777a7d"/><path d="M0 480h900" stroke="#ff5a1f" stroke-opacity=".7" stroke-width="3"/><text x="40" y="70" fill="#f2f0ec" font-family="Arial" font-size="22" letter-spacing="4">KILIMANI GARAGE</text></svg>`;
  img.onerror = null;
  img.style.visibility = "visible";
  img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

window.imageFallback = imageFallback;
window.usePexels = usePexels;
