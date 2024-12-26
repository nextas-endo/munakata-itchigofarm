"use strict";

let isNarrowViewport = matchMedia("(max-width: 1023px)").matches;

// Register gsap ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

(function () {
  const $gNavAnchors = document.querySelectorAll('.g-nav__item a[href^="#"]');
  const $gNavTrigger = document.querySelector(".hamburger-trigger");

  document.addEventListener("DOMContentLoaded", () => {
    Splitting({
      target: "[data-splitting]",
      by: "chars",
      key: null,
    });

    // Global navigation ancohor click event for narrow view
    if (isNarrowViewport) {
      $gNavAnchors.forEach((anchor) =>
        anchor.addEventListener("click", () => $gNavTrigger.click())
      );
    }

    // Global animations
    globalFxMotion();

    // Concept Scene animation
    conceptFxMotion();

    // Service Scene animation
    serviceFxMotion();
    outlineFxMotion();

    // Flow Scene animation
    flowFxMotion();

    // Set service gallery carousel
    infiniteCarousel();

    // Instantiate parallax effects
    jarallax(".js-jarallax");

    accordion();
  });

  window.addEventListener("load", () => {
    // Starting animations
    // onStartFxMotion();

    // Form initialization
    initForm();
  });
})();

/**
 * Global header on scroll handler
 */
function globalUIActionOnscrollHandler() {}

/**
 * Global animations (heading...)
 */
function globalFxMotion() {
  const $headingTriggers = document.querySelectorAll(".js-heading-fx-trigger");

  $headingTriggers.forEach((elem) => {
    const $title = elem.querySelector(".c-heading__title");
    const $alphabetic = elem.querySelector(".c-heading__alphabetic");
    const $alphabeticChars = $alphabetic.querySelectorAll(".char");
    let transformPropsIn, transformPropsOut;

    const TL = gsap.timeline({
      scrollTrigger: {
        trigger: elem,
        start: "top center",
        end: "20px 80%",
        invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    });

    if (isNarrowViewport) {
      transformPropsIn = {
        scaleX: -1,
        scaleY: 1,
        scaleY: 1,
      };

      transformPropsOut = {
        scaleX: 1,
        scaleY: 1,
        scaleY: 1,
      };
    } else {
      transformPropsIn = {
        transform: "scale3d(-1, 1, 1)",
      };

      transformPropsOut = {
        transform: "scale3d(1, 1, 1)",
      };
    }

    gsap.set($title, {
      opacity: 0,
    });

    gsap.set($alphabeticChars, {
      ...transformPropsIn,
      opacity: 0,
      display: "inline-block",
    });

    TL.to($alphabeticChars, {
      ...transformPropsOut,
      opacity: 1,
      stagger: 0.15,
      duration: 1,
      ease: "power.in",
      onComplete: () => $alphabetic.classList.add("is-animated"),
    }).to($title, {
      opacity: 1,
    });
  });
}

/**
 * Starting animations
 */
function onStartFxMotion() {
  const $mvCopy = document.getElementById("js-mv-copy-fx-trigger");
  const $mv = document.getElementById("js-mv");
  const $splideWrapper = $mv.querySelector(".splide__wrapper");

  let splide = new Splide(".splide", {
    type: "fade",
    rewind: true,
    speed: 800,
    autoplay: true,
    arrows: false,
  });

  let TL = gsap.timeline();
  let TL2 = gsap.timeline({
    scrollTrigger: {
      trigger: $mvCopy,
      start: "bottom bottom",
      end: "center top",
      once: true,
      toggleClass: "is-active",
    },
  });

  TL.set($mv, {
    clipPath: "inset(100% 0% 0% 0%)",
    onComplete: () => {
      splide.mount();
      ScrollTrigger.refresh();
    },
  })
    .set($splideWrapper, {
      // height: '30%',
      yPercent: 80,
      scaleY: 0.5,
      transformOrigin: "center 100%",
      opacity: 0,
    })
    .to($splideWrapper, {
      // height: '50%',
      yPercent: 40,
      scaleY: 1,
      opacity: 0.5,
      duration: 0.65,
      ease: "sine.inOut",
    })
    .to(
      $splideWrapper,
      {
        // height: '100%',
        yPercent: 0,
        scaleY: 1,
        opacity: 1,
        duration: 1,
        ease: "sine.inOut",
      },
      "-=0.65s"
    )
    .to(
      $mv,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power2.inOut",
      },
      ">-0.8"
    );

  TL2.set($mvCopy, {
    opacity: 1,
  });
}

/**
 * Concept motion animations
 */
function conceptFxMotion() {
  const $conceptBody = document.getElementById("js-concept-fx-trigger");
  const $conceptVisual =
    $conceptBody && $conceptBody.querySelector(".concept-visual");
  const $conceptContents =
    $conceptBody && $conceptBody.querySelectorAll(".concept-contents > *");
  const $worriesArea = document.getElementById("js-worries-fx-trigger");
  const $worriesAreaTitle =
    $worriesArea && $worriesArea.querySelector(".worries-sampling__title");
  const $worryBubbles =
    $worriesArea &&
    $worriesArea.querySelectorAll(".worries-sampling__list > li");
  const $worryBubblesBoxes =
    $worriesArea && $worriesArea.querySelectorAll(".worry-item");
  let $visualImg = $conceptVisual && $conceptVisual.querySelector("img");

  if (!$conceptBody) return;

  const TL = gsap.timeline({
    scrollTrigger: {
      trigger: $conceptBody,
      start: "top center",
      end: "top top",
      once: true,
    },
  });

  const TL2 = gsap.timeline({
    scrollTrigger: {
      trigger: $worriesArea,
      start: "top center",
      end: "top top",
      once: true,
    },
  });

  // concept Body phase
  gsap.set([$conceptVisual, $conceptContents], {
    autoAlpha: 0,
  });

  gsap.set($visualImg, {
    yPercent: isNarrowViewport ? 7.5 : 15.25,
    xPercent: isNarrowViewport ? 0 : 9.5,
  });

  TL.to($conceptVisual, {
    autoAlpha: 1,
    duration: 1,
    onComplete: () => {
      gsap.fromTo(
        $visualImg,
        {
          yPercent: isNarrowViewport ? 7.5 : 15.25,
          xPercent: isNarrowViewport ? 0 : 9.5,
          duration: 0.75,
          ease: "sine.inOut",
          onComplete: () => {
            gsap.to($conceptContents, {
              autoAlpha: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            });
          },
        },
        {
          yPercent: 0,
          xPercent: 0,
        }
      );
    },
  });

  // concept worries phase
  gsap.set($worriesAreaTitle, {
    autoAlpha: 0,
    clipPath: "inset(100% 100%)",
  });

  gsap.set($worryBubbles, {
    autoAlpha: 0,
    filter: isNarrowViewport ? "blur(0px)" : "blur(20px)",
    yPercent: -25,
  });

  TL2.to($worriesAreaTitle, {
    autoAlpha: 1,
    clipPath: "inset(0% 0%)",
    duration: 3,
    ease: "power2.out",
    onUpdate: () => {
      gsap.to(".moya-shape-wrapper", {
        "--worriesIllustOpacityValue": 1,
        "--worriesIllustBlurValue": "0px",
        duration: 2,
      });
    },
    onComplete: () => {
      // $worryBubblesBoxes.forEach(item => item.classList.add('is-animated'));
    },
  }).to(
    $worryBubbles,
    {
      autoAlpha: 1,
      filter: "blur(0px)",
      yPercent: 0,
      stagger: 0.25,
      duration: 1.5,
    },
    "<25%"
  );
}

/**
 * Service motion animations
 */
function serviceFxMotion() {
  const $serviceBody = document.getElementById("js-service-fx-trigger");
  const $servicePoints =
    $serviceBody && $serviceBody.querySelectorAll(".service-point");

  if (!$serviceBody) return;

  const TL = gsap.timeline({
    scrollTrigger: {
      trigger: $serviceBody,
      start: "top bottom",
      end: "top top",
      once: true,
      onEnter: () => {
        gsap.set($serviceBody, {
          yPercent: 25,
          opacity: 0,
        });
      },
    },
  });

  TL.to($serviceBody, {
    yPercent: 0,
    opacity: 1,
  });

  $servicePoints.forEach((item) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top center",
        end: "top top",
        once: true,
        toggleClass: "is-animated",
      },
    });
  });
}

/**
 * Outline motion animations
 */
function outlineFxMotion() {
  const $outlineBody = document.getElementById("js-outline-fx-trigger");
  const $outlinePoints =
    $outlineBody && $outlineBody.querySelectorAll(".outline-point");

  if (!$outlineBody) return;

  const TL = gsap.timeline({
    scrollTrigger: {
      trigger: $outlineBody,
      start: "top bottom",
      end: "top top",
      once: true,
      onEnter: () => {
        gsap.set($outlineBody, {
          yPercent: 25,
          opacity: 0,
        });
      },
    },
  });

  TL.to($outlineBody, {
    yPercent: 0,
    opacity: 1,
  });

  $outlinePoints.forEach((item) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top center",
        end: "top top",
        once: true,
        toggleClass: "is-animated",
      },
    });
  });
}

/**
 * Flow motion animation
 */
function flowFxMotion() {
  const $flowItems = document.querySelectorAll(".flow-box");

  if (!$flowItems) return;

  gsap.set($flowItems, {
    opacity: 0,
    yPercent: -25,
    clipPath: "inset(0% 0% 140% 0%)",
  });

  $flowItems.forEach((item, i) => {
    const $stepNumb = item.querySelector(".flow-box__step-numb");
    const $icon = item.querySelector(".flow-box__icon");
    const $dataBox = item.querySelector(".flow-box__data");

    let TL = gsap.timeline({
      ease: "sine.out",
      scrollTrigger: {
        trigger: item,
        start: "top center",
        end: "bottom top",
      },
    });

    gsap.set($stepNumb, {
      opacity: 0,
      scale: 0,
    });
    gsap.set([$icon, $dataBox], {
      opacity: 0,
    });

    TL.to(item, {
      opacity: 1,
      yPercent: 0,
      clipPath: "inset(-20% 0% 0% 0%)",
      duration: 0.7,
      delay: isNarrowViewport ? null : i > 0 ? i : null,
      onComplete: () => {
        gsap.to(".flow-list", {
          "--dottedLineScaleValue": "-=25%",
          duration: 1,
          ease: "linear",
        });

        gsap.to($stepNumb, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "bounce.out",
        });
        gsap.to(
          $icon,
          {
            opacity: 1,
          },
          "<25%"
        );
        gsap.to(
          $dataBox,
          {
            opacity: 1,
          },
          "<25%"
        );
      },
    });
  });
}

/**
 * Infinite Carousel (splide.js)
 */
function infiniteCarousel() {
  const $carousel = document.getElementById("js-carousel");
  let splide;

  if ($carousel) {
    splide = new Splide($carousel, {
      type: "loop",
      perPage: 1,
      perMove: 1,
      gap: "6rem",
      clones: 6,
      autoplay: true,
      interval: 0,
      arrows: false,
      pagination: false,
      speed: 50000,
      easing: "linear",
      breakpoints: {
        767: { gap: "2rem" },
      },
    });

    splide.mount();
  }
}

/**
 * Parallax animation
 * @param {String} trigger
 */
function jarallax(trigger) {
  const $trigger =
    document.querySelector(trigger) ||
    document.querySelector("[data-jarallax]");
  const $parallaxElem = $trigger && $trigger.querySelector(".jarallax-img");
  let effectType = $trigger && $trigger.dataset.type;
  let animationPropreties;

  if (!$trigger) return;

  switch (effectType) {
    case "scale-opacity":
      animationPropreties = {
        setMode: {
          scale: 1.25,
          yPercent: 12.5,
          opacity: 0,
        },
        toMode: {
          backgroundPosition: "50% 50%",
          scale: 1,
          yPercent: 0,
          opacity: 1,
        },
      };
      break;
    case "scale":
      animationPropreties = {
        setMode: {
          scale: 1.25,
        },
        toMode: {
          scale: 1,
        },
      };
      break;
    default:
      break;
  }

  gsap.set($parallaxElem, animationPropreties.setMode);

  let parallaxAnim = gsap.to($parallaxElem, {
    ...animationPropreties.toMode,
    ease: "sine.in",
    scrollTrigger: {
      trigger: $trigger,
      start: "top bottom",
      end: "top top",
      scrub: true,
      once: true,
      onComplete: () => parallaxAnim.kill(),
    },
  });
}

/**
 * Vuejsのリアルタイムフォーム
 */
function initForm() {
  let $formAnchor, form;

  new Vue({
    el: "#form",
    data: {
      confirmMode: false,
      thanksMode: false,
      processingStatus: false,
      processingStatusMsg: "送信中…",
      form: {
        name: {
          label: "お名前",
          value: "",
        },
        email: {
          label: "メールアドレス",
          value: "",
        },
        tel: {
          label: "電話番号",
          value: "",
        },
        type: {
          label: "お問い合わせ種別",
          value: "",
        },
        message: {
          label: "お問い合わせ内容",
          value: "",
        },
        acceptance: false,
      },
    },
    mounted() {
      const $errTxt = document.querySelectorAll(".is-hidden");
      const $submitBtn = document.getElementById("js-submit");

      $formAnchor = document.querySelector("#form");
      form = $formAnchor.querySelector("form");

      $submitBtn.addEventListener("click", () => {
        if (form.checkValidity()) {
          document.documentElement.style.scrollBehavior = "smooth";
        } else {
          document.documentElement.style.scrollBehavior = "auto";
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = "smooth";
          }, 1000);
        }
      });

      Array.from($errTxt).forEach(function (el) {
        el.classList.remove("is-hidden");
      });
    },
    methods: {
      onSubmit() {
        const botIdentified = sessionStorage.getItem("botIdentified");

        if (
          document.getElementById("js-honeypot").value === "" &&
          !botIdentified
        ) {
          this.confirmMode = true;
          window.scrollTo(0, $formAnchor.offsetTop + innerHeight);
        } else {
          sessionStorage.setItem("botIdentified", true);
          return false;
        }
      },
      sendForm() {
        this.thanksMode = true;
        this.confirmMode = false;
        window.scrollTo(0, $formAnchor.offsetTop + innerHeight);

        // MEMO: for testing
        // setTimeout(() => {
        //   alert('送信しました。');
        //   this.processingStatus = true,
        //   this.processingStatusMsg = 'お問い合わせありがとうございます。';
        // }, 2000);
        // return;

        const options = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            ...this.form,
            send: 1,
          }),
          headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
          }),
        };

        fetch("/api/contact/", options)
          .then((response) => {
            if (response.status !== 200)
              throw new Error(`system Error: ${response.status}`);
            if (response.redirected)
              console.log((window.location.href = response.url));

            return response.json();
          })
          .then((data) => {
            const { send_flag: sendFlag } = data;

            if (sendFlag) {
              (this.processingStatus = true),
                (this.processingStatusMsg =
                  "お問い合わせありがとうございます。");
            } else {
              alert(data.message);
            }
          })
          .catch((e) => console.log(e))
          .finally(() => console.log("送信完了"));
      },
      backToCorrect() {
        this.confirmMode = false;
      },
    },
  });
}

/**
 * アコーディオン
 */
function accordion() {
  $(".accordion-header").click(function () {
    $(this).next(".accordion-content").slideToggle();
    $(this).toggleClass("active");
  });
}
