const apiInfo = {
  businessID: "17841448970931321" || null,
  // businessID: null,
  accessToken:
    "EAApA0cnLJOwBAB1OpHX9kIqRX1aigzePIj3LGzzv3BtRDAlTjUvZCwZArdXOoZBE9pqtdSjOTTeW5t1qmdflaalsr6aYexZBwo37d445q4AuHjhwhrruIBgxY17mS3z8T5OUJpkvn4BfmHRqysZCJv24RLkiOiwtK5fp3SxQIANVpyfP9ZAzVr" ||
    null,
  targetedUserID: "designbeautyclinic" || null,
  apiUrl: "https://graph.facebook.com/v15.0/" || null,
};

window.addEventListener("load", () => {
  const $snsGallery = document.getElementById("js-inifinte-gallery");
  let galleryItems,
    galleryOutput = "";

  if (apiInfo.businessID === null) return galleryInfiniteScrolling($snsGallery);

  getandCacheInstagramMediaData().then((data) => {
    galleryItems = data;

    galleryItems.forEach((item) => {
      galleryOutput += `
          <div class="instagram-gallery__item">
            <a href="${item.permalink}" target="_blank">
              <img src="${item.media_url}" alt="${item.caption}" />
            </a>
          </div>
        `;
    });

    $snsGallery.innerHTML = galleryOutput;
    return galleryInfiniteScrolling($snsGallery);
  });
});

/**
 * Gallery infinite scrolling animation
 */
function galleryInfiniteScrolling(target) {
  if (!target) return;

  let trackWidth = target.scrollWidth - window.innerWidth;
  let TL = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });

  TL.to(target, {
    x: -trackWidth,
    duration: 100,
  });
}

/**
 * Get and cache Instagram media data into localStorage
 * @returns
 */
async function getandCacheInstagramMediaData() {
  const date = new Date().toLocaleDateString();
  const query = `business_discovery.username(${apiInfo.targetedUserID}){id,media{permalink,caption,media_url,media_type,timestamp,id}}`;
  const targetUrl = `${apiInfo.apiUrl}${apiInfo.businessID}?fields=${query}&access_token=${apiInfo.accessToken}`;
  let galleryItems = [];
  let response;

  if (localStorage.app_date === date) {
    galleryItems = JSON.parse(localStorage.cached_gallery_items);
    return galleryItems;
  } else {
    response = await fetch(targetUrl);
    localStorage.removeItem("cached_gallery_items");

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    let json = await response.json();
    let { media } = json.business_discovery;

    galleryItems = media.data.filter((item, i) => {
      // if (i <= 14)  return item;
      if (item.media_type !== "VIDEO") return item;
    });

    localStorage.app_date = date;
    localStorage.setItem("cached_gallery_items", JSON.stringify(galleryItems));

    return galleryItems;
  }
}

/**
 * Throttle
 * Higher-order function to improve performance
 * @param {*} callback
 * @param {*} delay
 * @returns
 */
function throttle(callback, delay) {
  let throttleTimeout = null;
  let storedEvent = null;

  const throttledEventHandler = (event) => {
    storedEvent = event;

    const shouldHandleEvent = !throttleTimeout;

    if (shouldHandleEvent) {
      callback(storedEvent);

      storedEvent = null;

      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;

        if (storedEvent) {
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };

  return throttledEventHandler;
}
